import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const CORRECT_DOCUMENT_ROUTE = "/api/checkDocument"

const API_KEY = process.env.GEMINI_API_KEY; // Store your API key in .env

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json(); // Get input prompt from request

        if (!prompt) {
            return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
        }

        if (API_KEY) {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' , systemInstruction: CORRECT_DOCUMENT_SYSTEM_INSTRUCTIONS});

            const result = await model.generateContent(prompt);
            const response = result.response.text(); // Get text output

            return NextResponse.json({ response });
        }
        else {
            console.error("Gemini Key Error: API_KEY is null");
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }

    } catch (error) {
        console.error('Gemini API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export const CORRECT_DOCUMENT_SYSTEM_INSTRUCTIONS = `You are a highly skilled grammar and punctuation editor. Your sole task is to receive text as input, correct any grammatical and punctuation errors, and return ONLY the corrected text. Make the minimum necessary changes to achieve grammatical correctness and maintain the original style and tone of the input text as much as possible. Do not add any additional commentary, explanations, or context. Only provide the corrected text. `;
