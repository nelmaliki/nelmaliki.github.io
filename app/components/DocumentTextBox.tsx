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
import { getTextDocumentCorrectionPlugin } from "../lib/plugins/DocumentCorrectionPlugin";
import { CorrectionNode } from "../lib/extensions/CorrectionNode";

export interface CombinedDocumentTextBoxProps {
    textContent: string;
    updateTextContent: (newContent: string) => void;
    //this value is ignored on first render which may become an issue later idk
    correctedTextContent: string;
}

const defaultExtensions = [
    Bold,
    Strike,
    History,
    Blockquote,
    Document,
    Heading,
    Italic,
    Paragraph,
    Text,
    CorrectionNode,
];

export default function CombinedDocumentTextBox(props: CombinedDocumentTextBoxProps): React.ReactElement {
    const { textContent, correctedTextContent, updateTextContent } = props;
    
    const documentCorrectionPlugin = React.useMemo(
        () => getTextDocumentCorrectionPlugin.configure({ correctDocument: correctedTextContent }),
        [correctedTextContent]
    );
    
    const extensions = [documentCorrectionPlugin, ...defaultExtensions];
    
    const editor = useEditor({
        extensions,
        content: textContent,
        immediatelyRender: false,
        shouldRerenderOnTransaction: true,
        onUpdate: ({ editor }) => {
            updateTextContent(editor.getText());
        },
        onBlur: ({ editor }) => {
            updateTextContent(editor.getText());
        }
    }, [correctedTextContent]);
    
    // // Update editor content when textContent prop changes
    // React.useEffect(() => {
    //     if (editor && editor.getText() !== textContent) {
    //         editor.commands.setContent(textContent);
    //     }
    // }, [editor, textContent]);

    return <EditorContent editor={editor} className="flex-1 border resize-none overflow-auto text-black overflow-y-scroll bg-white" />
}
