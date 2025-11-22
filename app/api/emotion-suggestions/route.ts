import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { emotion } = await req.json();

    if (!emotion) {
      return NextResponse.json(
        { error: "Emotion is required" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are a compassionate mental health assistant. A person's emotion has been detected as "${emotion}". 

Please provide a response with these THREE sections (use clear headings):

**💭 Understanding Your Emotion**
Write 2-3 empathetic sentences acknowledging their ${emotion} emotion.

**✨ Three Actionable Suggestions**
Provide 3 specific, practical things they can do right now to feel better. Number them 1, 2, 3.

**🌬️ Quick Breathing Exercise**
Describe one simple breathing or mindfulness technique they can try immediately (2-3 sentences with clear steps).

Keep your response warm, supportive, and practical. Use the exact section headings shown above.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ suggestion: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
