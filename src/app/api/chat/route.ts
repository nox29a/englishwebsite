import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { messages, model, scenario, mode } = await req.json();

  const SYSTEM_PROMPTS = {
    npc: `You are a friendly English native speaker having a natural conversation. Follow these rules:
1. Respond naturally like a real person
2. Never correct grammar or mistakes
3. Keep responses short (1-2 sentences max)
4. Show interest by asking follow-up questions
5. Adapt to user's language level naturally
6. Use casual expressions and contractions
7. Allow minor errors to maintain flow`,

    correction: `You are an English teacher correcting the student's grammar and vocabulary mistakes.
Highlight each incorrect part in <span style="color:red;">...</span> and show the correct form in parentheses right after it.
Do not rewrite the whole text unless needed.
Keep all correct parts unchanged.
Return only HTML, no extra explanation outside the text. If there is no mistakes return 0`
  };

  let finalMessages: any[] = [];

  if (mode === 'correction') {
    // Tryb korektora — tylko ostatnia wiadomość gracza
    finalMessages = [
      { role: "system", content: SYSTEM_PROMPTS.correction },
      { role: "user", content: messages[messages.length - 1]?.text || "" }
    ];
  } else {
    // Tryb NPC
    const systemPrompt =
      SYSTEM_PROMPTS.npc;

    finalMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((msg: any) => ({
        role: msg.sender === 'npc' ? 'assistant' : 'user',
        content: msg.text
      }))
    ];
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: model || "deepseek/deepseek-r1:free",
        messages: finalMessages,
        temperature: mode === 'correction' ? 0 : 0.7,
        max_tokens: mode === 'correction' ? 200 : 30,
        frequency_penalty: 0.2,
        presence_penalty: 0.2
      })
    });

    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();
    let reply = data.choices[0]?.message?.content || "";

    if (mode === 'npc') {
      // usuń wszelkie ślady "nauczania" w trybie NPC
      reply = reply.replace(/should say|correct is|proper way/gi, '');
    }

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error("API Error:", error.message);
    return NextResponse.json(
      { reply: mode === 'correction' ? "<span style='color:red;'>Error</span>" : "Oh, let me think... What were we talking about?" },
      { status: 500 }
    );
  }
}
