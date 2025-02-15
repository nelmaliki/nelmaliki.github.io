'use client'
import { CORRECT_DOCUMENT_ROUTE } from '@/app/api/correctDocument/route';
import React, { UIEventHandler, useCallback, useEffect, useRef, useState } from 'react';
export default function Page() {
    const [inputText, setInputText] = useState("Put your text here!");
    const [outputText, setOutputText] = useState("Click the button to see edits!");
    const [scrollState, setScrollState] = useState(0);
    const onClick = useCallback(async () => {
        const res = await fetch(CORRECT_DOCUMENT_ROUTE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: inputText }),
        });
        const responseJSON = await res.json();
        setOutputText(responseJSON["response"]);
    }, [setOutputText, inputText]);
    return (
        <div className="page-contents mx-6 flex flex-col">
            <div className="toolbar h-10 flex justify-center">
                <button className="accept-button bg-Asparagus my-2" onClick={onClick}>Click Me</button>
            </div>
            <div className="editor flex justify-evenly flex-1 min-h-[70vh] mt-4">
                <ScrollableTextBox textContent={inputText} scrollValue={scrollState} updateTextContent={setInputText} setScrollValue={setScrollState} editable />
                <div className="divider mx-6" />
                <ScrollableTextBox textContent={outputText} scrollValue={scrollState} updateTextContent={setOutputText} setScrollValue={setScrollState} />
            </div>
        </div>
    );
};


interface ScrollableTextBoxProps {
    textContent: string;
    updateTextContent: (newContent: string) => void;
    //this value is ignored on first render which may become an issue later idk
    scrollValue: number;
    setScrollValue: (newScrollValue: number) => void;
    editable?: boolean;
}

function ScrollableTextBox(props: ScrollableTextBoxProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.scrollTop = props.scrollValue;
        }
    }, [props.scrollValue]);

    const onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (props.editable) {
            props.updateTextContent(e.target.value);
        }
    }, [props.updateTextContent]);
    const onScroll: UIEventHandler<HTMLTextAreaElement> = useCallback((e) => {
        if (textareaRef.current) {
            props.setScrollValue(textareaRef.current.scrollTop);
        }
    }, [props.setScrollValue]);
    return (
        <textarea
            ref={textareaRef}
            value={props.textContent}
            onChange={onChange}
            onScroll={onScroll}
            className="flex-1 border resize-none overflow-auto text-black overflow-y-scroll"
        />
    );
}
