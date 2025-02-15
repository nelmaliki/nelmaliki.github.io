import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const CORRECT_DOCUMENT_ROUTE = "/api/correctDocument"

const API_KEY = process.env.GEMINI_API_KEY; // Store your API key in .env

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json(); // Get input prompt from request

        if (!prompt) {
            return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
        }

        if (API_KEY) {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

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
