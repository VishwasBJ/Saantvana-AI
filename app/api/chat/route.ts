import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `You are a warm, supportive mental-health companion. You respond gently, empathetically, and safely. You do not diagnose. You provide emotional support and helpful coping suggestions.

Guidelines:
- Always be compassionate and non-judgmental
- Use a calm, caring, therapist-like tone
- Validate the user's feelings
- Offer practical coping strategies when appropriate
- If someone mentions self-harm or crisis, gently suggest professional help
- Keep responses concise but meaningful (2-4 sentences typically)
- Use "I" statements to show empathy (e.g., "I hear that you're feeling...")
- Never claim to be a licensed therapist
- Encourage self-care and healthy habits`;

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file." },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    // Build conversation context
    let conversationContext = SYSTEM_PROMPT + "\n\n";
    
    if (history && history.length > 0) {
      conversationContext += "Previous conversation:\n";
      history.forEach((msg: any) => {
        conversationContext += `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}\n`;
      });
      conversationContext += "\n";
    }
    
    conversationContext += `User: ${message}\nAssistant:`;

    const result = await model.generateContent(conversationContext);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get AI response. Please try again." },
      { status: 500 }
    );
  }
}
