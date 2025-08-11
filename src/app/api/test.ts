import { OpenAI } from "openai";
import { NextResponse } from 'next/server';

export async function GET() {
  const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: process.env.HF_TOKEN,
  });

  try {
    const test = await client.chat.completions.create({
      model: "openai/gpt-oss-20b:fireworks-ai",
      messages: [{ role: "user", content: "Say 'hello' in French" }],
    });
    return NextResponse.json({ status: "OK", response: test.choices[0]?.message });
  } catch (error: any) {
    return NextResponse.json(
      { status: "ERROR", error: error.message },
      { status: 500 }
    );
  }
}