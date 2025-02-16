import { UIEventHandler, useCallback, useEffect, useRef } from "react";
import { DocumentTextBoxProps } from "./DocumentTextBox";


export default function DocumentTextBox(props: DocumentTextBoxProps): React.ReactElement {
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