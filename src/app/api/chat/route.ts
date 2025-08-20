import { NextResponse } from 'next/server';

// Definicje poziomów trudności
const DIFFICULTY_LEVELS = {
  beginner: {
    npc: `You are a friendly English native speaker having a natural conversation with a beginner student. Follow these rules:
1. Use simple vocabulary (A1-A2 level)
2. Keep sentences short and clear (max 8-10 words)
3. Use basic grammatical structures (present simple, basic questions)
4. Speak slowly and clearly in your responses
5. Use common everyday expressions
6. Be encouraging and patient
7. Never correct grammar or mistakes directly
8. Allow minor errors to maintain flow
9. Repeat key vocabulary naturally in context
10. Ask simple follow-up questions
11. Keep sentences short and clear (max 8-10 words)
`,

    correction: `You are an English teacher correcting a beginner student's grammar and vocabulary mistakes.
Focus only on major errors that impede understanding.
Use simple, clear explanations.
Highlight each incorrect part in <span style="color:red;">...</span> and show the correct form in parentheses right after it.
Keep corrections minimal and encouraging.
Return only HTML, no extra explanation outside the text. If there are no major mistakes return empty message.`
  },

  intermediate: {
    npc: `You are a friendly English native speaker having a natural conversation with an intermediate student. Follow these rules:
1. Use intermediate vocabulary (B1-B2 level)
2. Use a variety of sentence structures (compound and complex sentences)
3. Include phrasal verbs and common idioms naturally
4. Ask open-ended questions to encourage longer responses
5. Use appropriate tenses (past, present, future, perfect forms)
6. Never correct grammar or mistakes directly
7. Allow minor errors to maintain flow
8. Introduce new vocabulary in context
9. Show interest by asking follow-up questions
10. Use casual expressions and contractions naturally
11. Keep sentences short and clear (max 8-10 words)
`,

    correction: `You are an English teacher correcting an intermediate student's grammar and vocabulary mistakes.
Correct both major errors and common intermediate-level mistakes (articles, prepositions, tense consistency).
Explain subtle differences when appropriate.
Highlight each incorrect part in <span style="color:red;">...</span> and show the correct form in parentheses right after it.
Provide brief explanations for complex corrections.
Return only HTML, no extra explanation outside the text. If there are no significant mistakes return empty message.`
  },

  advanced: {
    npc: `You are a friendly English native speaker having a natural conversation with an advanced student. Follow these rules:
1. Use advanced vocabulary (C1 level) including idioms and nuanced expressions
2. Use complex grammatical structures naturally
3. Discuss abstract topics and express nuanced opinions
4. Use sophisticated linking words and discourse markers
5. Challenge the user with thought-provoking questions
6. Never correct grammar or mistakes directly
7. Allow very minor errors to maintain flow
8. Use humor, sarcasm, and cultural references appropriately
9. Engage in deeper, more substantive conversations
10. Adapt to the user's interests and responses naturally
11. Keep sentences short and clear (max 8-10 words)
`,

    correction: `You are an English teacher correcting an advanced student's grammar and vocabulary mistakes.
Focus on nuanced errors, collocations, preposition use, and stylistic improvements.
Correct subtle grammatical inaccuracies and awkward phrasing.
Explain why certain word choices are more natural.
Highlight each incorrect part in <span style="color:red;">...</span> and show the correct form in parentheses right after it.
Provide detailed explanations for complex corrections.
Return only HTML, no extra explanation outside the text. If there are only very minor issues return empty message.`
  }
};

export async function POST(req: Request) {
  const { messages, model, scenario, difficulty = 'intermediate', mode } = await req.json();

  // Wybierz odpowiedni prompt na podstawie poziomu trudności
  const selectedDifficulty = DIFFICULTY_LEVELS[difficulty as keyof typeof DIFFICULTY_LEVELS] || DIFFICULTY_LEVELS.intermediate;

  let finalMessages: any[] = [];

  if (mode === 'correction') {
    // Tryb korektora — tylko ostatnia wiadomość gracza
    finalMessages = [
      { role: "system", content: selectedDifficulty.correction },
      { role: "user", content: messages[messages.length - 1]?.text || "" }
    ];
  } else {
    // Tryb NPC - dodaj informacje o scenariuszu jeśli istnieje
    let systemPrompt = selectedDifficulty.npc;
    
    if (scenario) {
      // Tutaj możesz dodać specyficzne prompty dla scenariuszy jeśli potrzebujesz
      systemPrompt += `\n\nCurrent scenario: ${scenario}. Adapt your conversation to this context naturally.`;
    }

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
        model: model || "gpt-4o-mini",
        messages: finalMessages,
        temperature: mode === 'correction' ? 0 : 0.7,
        max_tokens: mode === 'correction' ? 300 : 150,
        frequency_penalty: mode === 'correction' ? 0 : 0.2,
        presence_penalty: mode === 'correction' ? 0 : 0.2
      })
    });

    if (!response.ok) throw new Error(await response.text());

    const data = await response.json();
    let reply = data.choices[0]?.message?.content || "";

    if (mode === 'npc') {
      // usuń wszelkie ślady "nauczania" w trybie NPC
      reply = reply.replace(/should say|correct is|proper way|you should/gi, '');
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