import { Extension } from '@tiptap/core'
import { Node as ProsemirrorNode } from '@tiptap/pm/model'
import { EditorState, EditorStateConfig, Plugin, PluginKey, Transaction } from '@tiptap/pm/state'
import { Decoration, DecorationSet, DecorationSource } from '@tiptap/pm/view'
import { diffDocs, NodeDiff } from '../diffDocuments'
import { renderTextDecoration } from './TextDecoration'

export interface TextDecoratorOptions {
    correctDocument: string
}

export const TextDecoratorPlugin = Extension.create<TextDecoratorOptions>({
    name: 'textdecorator',

    addOptions(): TextDecoratorOptions {
        return {
            correctDocument: "",
        }
    },

    addProseMirrorPlugins() {
        const { correctDocument } = this.options

        return [
            new Plugin({
                key: new PluginKey('textdecorator'),
                state: {
                    init(_: EditorStateConfig, editorState: EditorState) {
                        return compareDocumentToCorrectedDocument(editorState.doc, correctDocument);
                    },
                    apply(transaction: Transaction, oldState: DecorationSet): DecorationSet {
                        return transaction.docChanged ? compareDocumentToCorrectedDocument(transaction.doc, correctDocument) : oldState
                    },
                },
                props: {
                    decorations(state: EditorState): DecorationSource | null | undefined {
                        return this.getState(state)
                    }
                },
            }),
        ]
    },
})

export interface Result {
    message: string
    from: number
    to: number
    fix?: string
}

function compareDocumentToCorrectedDocument(doc: ProsemirrorNode, otherDoc: string): DecorationSet {
    const decorations: Decoration[] = []

    const results: NodeDiff[] = diffDocs(doc, otherDoc);

    results.forEach(issue => {
        if (issue.stringStart && issue.stringEnd && issue.changeValue && issue.added) {
            decorations.push(
                Decoration.inline(issue.stringStart, issue.stringEnd + 1, {
                    class: 'problem bg-NaplesYellow',
                    style: "text-decoration: line-through;"
                }));
            decorations.push(
                Decoration.widget(issue.stringEnd + 1, renderTextDecoration(issue.changeValue ?? "")))
        }
    }
    );
    return DecorationSet.create(doc, decorations);
}

