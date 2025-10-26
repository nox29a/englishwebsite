import { NextResponse } from "next/server";

const DEFAULT_TRANSLATION_URL = "https://libretranslate.de/translate";

interface TranslationRequestBody {
  text?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TranslationRequestBody;
    const text = typeof body.text === "string" ? body.text.trim() : "";
    const sourceLanguage =
      typeof body.sourceLanguage === "string" && body.sourceLanguage.length > 0
        ? body.sourceLanguage
        : "auto";
    const targetLanguage =
      typeof body.targetLanguage === "string" && body.targetLanguage.length > 0
        ? body.targetLanguage
        : "pl";

    if (!text) {
      return NextResponse.json(
        { error: "Brak tekstu do przetłumaczenia." },
        { status: 400 }
      );
    }

    const endpoint =
      process.env.LIBRETRANSLATE_API_URL?.trim() || DEFAULT_TRANSLATION_URL;

    const payload = new URLSearchParams({
      q: text,
      source: sourceLanguage,
      target: targetLanguage,
      format: "text",
    });

    if (process.env.LIBRETRANSLATE_API_KEY) {
      payload.set("api_key", process.env.LIBRETRANSLATE_API_KEY);
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload.toString(),
    });

    if (!response.ok) {
      const errorPayload = await response.text().catch(() => "");
      console.error("Translation API error:", errorPayload || response.statusText);
      return NextResponse.json(
        { error: "Nie udało się pobrać tłumaczenia z serwisu." },
        { status: 502 }
      );
    }

    const data = (await response.json()) as
      | { translatedText?: string }
      | { error?: string };

    const translatedText =
      typeof (data as { translatedText?: string }).translatedText === "string"
        ? (data as { translatedText: string }).translatedText
        : null;

    if (!translatedText) {
      console.error("Translation API returned invalid payload", data);
      return NextResponse.json(
        { error: "Serwis tłumaczeń zwrócił nieprawidłową odpowiedź." },
        { status: 502 }
      );
    }

    return NextResponse.json({ translation: translatedText });
  } catch (error) {
    console.error("Translation API request failed", error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas tłumaczenia." },
      { status: 500 }
    );
  }
}
