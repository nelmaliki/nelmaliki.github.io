import { CORRECT_DOCUMENT_ROUTE } from "../api/checkDocument/route";
import { CORRECT_DOCUMENT_STREAMING_ROUTE } from "../api/checkDocumentStreaming/route";
import { CorrectDocumentRequest, CorrectDocumentResponse, GeminiStreamingRequest } from "../types/api";

export async function correctDocument(request: CorrectDocumentRequest): Promise<CorrectDocumentResponse> {
    const res = await fetch(CORRECT_DOCUMENT_ROUTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });

    if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
    }

    return res.json() as Promise<CorrectDocumentResponse>;
}

export async function correctDocumentStreaming(streamingRequest: GeminiStreamingRequest): Promise<void> {
    const res = await fetch(CORRECT_DOCUMENT_STREAMING_ROUTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(streamingRequest.request),
    });

    if (!res.ok) {
        streamingRequest.onError?.(new Error(`API Error: ${res.status}`));
    }

    if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            accumulatedText += decoder.decode(value, { stream: true });
            streamingRequest.onUpdate?.(accumulatedText);
        }
        streamingRequest.onComplete?.({ response: accumulatedText });
    }
}