import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { messages, model, scenario } = await req.json();

  const SYSTEM_PROMPTS = {
    default: `You are a friendly English native speaker having a natural conversation. Follow these rules:
1. Respond naturally like a real person
2. Never correct grammar or mistakes
3. Keep responses short (1-2 sentences max)
4. Show interest by asking follow-up questions
5. Adapt to user's language level naturally
6. Use casual expressions and contractions
7. Allow minor errors to maintain flow`,

  };

  const systemPrompt = SYSTEM_PROMPTS[scenario as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.default;

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
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          ...messages.map((msg: any) => ({
            role: msg.sender === 'npc' ? 'assistant' : 'user',
            content: msg.text
          }))
        ],
        temperature: 0.7, // Wyższe dla bardziej naturalnych odpowiedzi
        max_tokens: 30, // Krótsze odpowiedzi
        frequency_penalty: 0.2,
        presence_penalty: 0.2
      })
    });

    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();
    let reply = data.choices[0]?.message?.content;

    // Usuń wszelkie ślady "nauczania"
    reply = reply.replace(/should say|correct is|proper way/gi, '');
    
    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error("API Error:", error.message);
    return NextResponse.json(
      { reply: "Oh, let me think... What were we talking about?" }, // Naturalna kontynuacja
      { status: 500 }
    );
  }
}