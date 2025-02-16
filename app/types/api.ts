export interface CorrectDocumentRequest {
    prompt: string;
}

export interface CorrectDocumentResponse {
    response: string;
}

export interface GeminiStreamingRequest {
    request: CorrectDocumentRequest;
    onUpdate?: (contentSoFar: string) => void;
    onComplete?: (finalContent: CorrectDocumentResponse) => void;
    onError?: (error: Error) => void;
}