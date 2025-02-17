import { Extension } from '@tiptap/core'
import { Node as ProsemirrorNode } from '@tiptap/pm/model'
import { EditorState, EditorStateConfig, Plugin, PluginKey, Transaction } from '@tiptap/pm/state'
import { Decoration, DecorationSet, DecorationSource } from '@tiptap/pm/view'
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
        //const { correctDocument } = this.options

        return [
            new Plugin({
                key: new PluginKey('textdecorator'),
                state: {
                    init(_: EditorStateConfig, editorState: EditorState) {
                        return compareDocumentToCorrectedDocument(editorState.doc);
                    },
                    apply(transaction: Transaction, oldState: DecorationSet): DecorationSet {
                        return transaction.docChanged ? compareDocumentToCorrectedDocument(transaction.doc) : oldState
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

function compareDocumentToCorrectedDocument(doc: ProsemirrorNode): DecorationSet {
    const decorations: Decoration[] = []

    const results: Result[] = [
        { from: 133, to: 139, message: 'charred' },
        { from: 0, to: 6, message: 'Karen' }
    ] //todo generate results

    results.forEach(issue => {
        decorations.push(
            Decoration.inline(issue.from, issue.to, {
                class: 'problem bg-NaplesYellow',
                style: "text-decoration: line-through;"
            }),
            Decoration.widget(issue.to, renderTextDecoration(issue.message)),
        )
    })

    return DecorationSet.create(doc, decorations);
}

