import { UIEventHandler, useCallback, useEffect, useRef } from "react";


export interface SimpleDocumentTextBoxProps {
    textContent: string;
    updateTextContent: (newContent: string) => void;
    //this value is ignored on first render which may become an issue later idk
    scrollValue: number;
    setScrollValue: (newScrollValue: number) => void;
    editable?: boolean;
}

export default function SimpleDocumentTextBox(props: SimpleDocumentTextBoxProps): React.ReactElement {
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