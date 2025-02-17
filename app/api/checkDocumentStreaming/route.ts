import { CORRECT_DOCUMENT_SYSTEM_INSTRUCTIONS } from '@/app/types/routes';
import { GenerateContentStreamResult, GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const API_KEY = process.env.GEMINI_API_KEY; // Store your API key in .env

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json(); // Get input prompt from request

        if (!prompt) {
            return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
        }

        if (API_KEY) {
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash', systemInstruction: CORRECT_DOCUMENT_SYSTEM_INSTRUCTIONS });

            const streamingResult: GenerateContentStreamResult = await model.generateContentStream(prompt);

            const encoder = new TextEncoder();

            const stream = new ReadableStream({
                async start(controller) {
                    for await (const chunk of streamingResult.stream) {
                        const textChunk = chunk.text(); // Extract text from response
                        controller.enqueue(encoder.encode(textChunk)); // Stream it to client
                    }
                    controller.close();
                },
            });

            return new Response(stream);
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
