import { Blockquote } from "@tiptap/extension-blockquote";
import { Bold } from "@tiptap/extension-bold";
import { Document } from "@tiptap/extension-document";
import { Heading } from "@tiptap/extension-heading";
import { History } from "@tiptap/extension-history";
import { Italic } from "@tiptap/extension-italic";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Strike } from "@tiptap/extension-strike";
import { Text } from "@tiptap/extension-text";
import { EditorContent, useEditor } from "@tiptap/react";
import React from "react";
import { TextDecoratorPlugin } from "../lib/plugins/TextDecoratorPlugin";

export interface CombinedDocumentTextBoxProps {
    textContent: string;
    updateTextContent: (newContent: string) => void;
    //this value is ignored on first render which may become an issue later idk
    correctedTextContent: string;
}

const defaultExtensions = [Bold, Strike, History, Blockquote, Document, Heading, Italic, Paragraph, Text];


export default function CombinedDocumentTextBox(props: CombinedDocumentTextBoxProps): React.ReactElement {
    const content = props.textContent;
    const correctedTextContent = props.correctedTextContent;
    const textDecoratorPlugin = React.useMemo(() => TextDecoratorPlugin.configure({ correctDocument: correctedTextContent }), [correctedTextContent]);
    const extensions = [textDecoratorPlugin, ...defaultExtensions];
    const editor = useEditor({ extensions, content, immediatelyRender: false });

    return <EditorContent editor={editor} className="flex-1 border resize-none overflow-auto text-black overflow-y-scroll bg-white" />
}
