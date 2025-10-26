import { NextResponse } from "next/server";


import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const STOP_WORDS = new Set([
  "the","and","you","that","for","with","have","this","but","not","your","from","they","will","what","their","about","would","there","which","when","make","like","time","just","know","take","people","into","year","good","some","could","them","other","than","then","also","more","these","because","come","over","only","look","see","well","even","back","very","much","here","where","most","used","using","are","was","were","been","being","while","those","it's","its","don't","doesn't","can't","i'm","we're","you're","he's","she's","they're","isn't","won't","didn't","i'll","we'll","you'll","he'll","she'll","they'll","i've","we've","you've","they've","had","has","did","does","each","every","any","all","our","out","who","why","how","https","www","http"
]);

const SUPPORTED_LANGUAGES = ["en", "pl", "es", "de", "fr", "it"] as const;

type TranscriptItem = {
  text: string;
};

type TranscriptResponse = TranscriptItem[] | { error: string };

const decodeHtmlEntities = (value: string) =>
  value.replace(/&(#x?[0-9a-fA-F]+|\w+);/g, (match, entity) => {
    if (entity.startsWith("#x") || entity.startsWith("#X")) {
      const codePoint = Number.parseInt(entity.slice(2), 16);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }

    if (entity.startsWith("#")) {
      const codePoint = Number.parseInt(entity.slice(1), 10);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }

    switch (entity) {
      case "amp":
        return "&";
      case "lt":
        return "<";
      case "gt":
        return ">";
      case "quot":
        return '"';
      case "apos":
        return "'";
      default:
        return match;
    }
  });

const parseXmlTranscript = (xml: string): TranscriptItem[] => {
  const matches = xml.matchAll(/<text[^>]*>(.*?)<\/text>/g);
  const items: TranscriptItem[] = [];

  for (const match of matches) {
    const text = decodeHtmlEntities(match[1])
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (text) {
      items.push({ text });
    }
  }

  return items;
};

const normalizeWord = (word: string) =>
  word
    .toLowerCase()
    .replace(/[“”"'`’]/g, "")
    .replace(/[^a-ząęćłńóśźż-]/g, "")
    .replace(/^-+|-+$/g, "")
    .trim();

const extractVideoId = (url: string) => {
  try {
    const parsed = new URL(url);

    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.replace(/\//g, "");
    }

    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id) {
        return id;
      }

      const pathMatch = parsed.pathname.match(/\/embed\/([\w-]+)/);
      if (pathMatch?.[1]) {
        return pathMatch[1];
      }
    }

    return null;
  } catch (error) {
    console.error("Niepoprawny link do YouTube", error);
    return null;
  }
};

const buildTranscriptUrls = (videoId: string, language: string) => [
  `https://youtubetranscript.com/?format=json&lang=${language}&video_id=${encodeURIComponent(videoId)}`,
  `https://youtubetranscript.com/?server_vid2=${encodeURIComponent(videoId)}&lang=${language}`,
];

const fetchTranscript = async (videoId: string): Promise<TranscriptItem[] | null> => {
  for (const language of SUPPORTED_LANGUAGES) {
    for (const url of buildTranscriptUrls(videoId, language)) {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
          },
          cache: "no-store",
        });

        if (!response.ok) {
          continue;
        }

        const rawPayload = await response.text();
        const trimmedPayload = rawPayload.trim();

        if (!trimmedPayload) {
          continue;
        }

        if (trimmedPayload.startsWith("<")) {
          const transcript = parseXmlTranscript(trimmedPayload);

          if (transcript.length > 0) {
            return transcript;
          }

          continue;
        }

        try {
          const payload = JSON.parse(trimmedPayload) as TranscriptResponse;

          if (!Array.isArray(payload) || payload.length === 0) {
            continue;
          }

          return payload;
        } catch (error) {
          console.warn(`Błąd parsowania transkrypcji (${language})`, error);
        }
      } catch (error) {
        console.warn(`Błąd pobierania transkrypcji (${language})`, error);
      }
    }
  }

  return null;
};

const buildWordList = (transcript: TranscriptItem[]) => {
  const counter = new Map<string, number>();

  for (const item of transcript) {
    const parts = item.text.split(/\s+/);

    for (const part of parts) {
      const normalized = normalizeWord(part);

      if (!normalized || STOP_WORDS.has(normalized) || normalized.length < 2) {
        continue;
      }

      counter.set(normalized, (counter.get(normalized) ?? 0) + 1);
    }
  }

  return Array.from(counter.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
};

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError) {
      console.error("Błąd autoryzacji użytkownika przy pobieraniu kategorii z YouTube", authError);
      return NextResponse.json(
        { error: "Nie udało się potwierdzić sesji użytkownika." },
        { status: 401 }
      );
    }
    if (!user) {
      return NextResponse.json(
        { error: "Pobieranie kategorii z YouTube jest dostępne tylko dla użytkowników Premium." },
        { status: 401 }
      );
    }
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("id", user.id)
      .single();
    if (profileError) {
      console.error("Nie udało się pobrać profilu użytkownika", profileError);
      return NextResponse.json(
        { error: "Nie udało się potwierdzić statusu subskrypcji." },
        { status: 500 }
      );
    }
    if (profile?.user_type?.toLowerCase() !== "premium") {
      return NextResponse.json(
        { error: "Pobieranie kategorii z YouTube jest dostępne tylko dla użytkowników Premium." },
        { status: 403 }
      );
    }

    const body = (await request.json()) as { url?: string } | null;

    if (!body?.url) {
      return NextResponse.json({ error: "Brak linku do filmu." }, { status: 400 });
    }

    const videoId = extractVideoId(body.url);

    if (!videoId) {
      return NextResponse.json({ error: "Nie udało się rozpoznać identyfikatora filmu." }, { status: 400 });
    }

    const transcript = await fetchTranscript(videoId);

    if (!transcript) {
      return NextResponse.json({ error: "Nie znaleziono transkrypcji dla tego filmu." }, { status: 404 });
    }

    const words = buildWordList(transcript);

    if (words.length === 0) {
      return NextResponse.json({ error: "Nie udało się znaleźć żadnych słów w transkrypcji." }, { status: 422 });
    }

    return NextResponse.json({ words });
  } catch (error) {
    console.error("Błąd przetwarzania transkrypcji YouTube", error);
    return NextResponse.json({ error: "Wystąpił problem z przetworzeniem filmu." }, { status: 500 });
  }
}
