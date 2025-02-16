import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { UIEventHandler, useCallback, useEffect, useRef } from "react";

export interface DocumentTextBoxProps {
    textContent: string;
    updateTextContent: (newContent: string) => void;
    //this value is ignored on first render which may become an issue later idk
    scrollValue: number;
    setScrollValue: (newScrollValue: number) => void;
    editable?: boolean;
}

export default function DocumentTextBox(props: DocumentTextBoxProps): React.ReactElement {

    const editor = useEditor({
        extensions: [StarterKit],
        content: props.textContent,
    })
    return <EditorContent editor={editor} className="flex-1 border resize-none overflow-auto text-black overflow-y-scroll bg-white"/>
}