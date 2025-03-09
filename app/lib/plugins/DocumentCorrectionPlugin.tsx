import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { diffDocs } from '../DocumentDifferentiator'

export interface DocumentCorrectionOptions {
    correctDocument: string
}

export const getTextDocumentCorrectionPlugin = Extension.create<DocumentCorrectionOptions>({
    name: 'documentcorrection',

    addOptions() {
        return {
            correctDocument: '',
        }
    },

    addProseMirrorPlugins() {
        const { correctDocument } = this.options

        return [
            new Plugin({
                key: new PluginKey('documentcorrection'),
                appendTransaction(transactions, oldState, newState) {
                    // Check if the correctDocument has changed
                    const correctDocumentChanged = correctDocument !== oldState.schema.cached.correctDocument;
                    if (correctDocumentChanged && correctDocument.length > 0) {
                        // Cache the current correctDocument for future comparisons
                        newState.schema.cached = newState.schema.cached || {};
                        newState.schema.cached.correctDocument = correctDocument;
                        // Generate new document with corrections
                        const newDoc = diffDocs(newState.doc, correctDocument);

                        // Replace entire document with new version
                        const transaction = newState.tr;
                        transaction.replaceWith(0, newState.doc.content.size, newDoc);

                        return transaction;

                    }
                    return null;
                }
            })
        ]
    }
}) 