import { Extension, nodeInputRule } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Node as ProsemirrorNode } from '@tiptap/pm/model'
import { diffDocs, NodeDiff } from '../DocumentDifferentiator'

export interface DocumentCorrectionOptions {
    correctDocument: string
}

export const DocumentCorrectionPlugin = Extension.create<DocumentCorrectionOptions>({
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
                    // Only process if document changed
                    const documentChanged = transactions.some(tr => tr.docChanged);
                    // Check if the correctDocument has changed
                    const correctDocumentChanged = correctDocument !== oldState.schema.cached.correctDocument;

                    // Cache the current correctDocument for future comparisons
                    newState.schema.cached = newState.schema.cached || {};
                    newState.schema.cached.correctDocument = correctDocument;

                    // Only proceed if document changed or correctDocument changed
                    if (!documentChanged && !correctDocumentChanged) {
                        return null;
                    }

                    const transaction = newState.tr

                    // Remove all existing correction nodes first
                    const pos = 0;
                    if (newState.doc.type.name === 'correction') {
                        transaction.delete(pos, pos + newState.doc.nodeSize)
                    }
                    newState.doc.descendants((child, childPos) => {
                        if (child.type.name === 'correction') {
                            transaction.delete(pos + childPos, pos + childPos + child.nodeSize)
                        }
                    })

                    // Compare documents and add correction nodes
                    const results: NodeDiff[] = diffDocs(newState.doc, correctDocument)
                    //as we manipulate the document, we need to keep track of the offset
                    let stringDeltaOffset = 0;
                    results.forEach(issue => {
                        if (issue.stringStart && issue.stringEnd && (issue.added)) {
                            //replacements can change content size, so we need to use the transaction doc size
                            //if we go past max size, we should append to the end
                            const from = Math.min(stringDeltaOffset + issue.stringStart, transaction.doc.content.size)
                            const to = Math.min(stringDeltaOffset + issue.stringEnd, transaction.doc.content.size)
                            const correctionNode =newState.schema.nodes.correction.create({
                                text: issue.changeValue,
                                removed: issue.removed,
                                added: issue.added
                            });
                            transaction.replaceWith(from, to, correctionNode)
                            const stringDelta = (from - to) - correctionNode.nodeSize;
                            //stringDeltaOffset += stringDelta;
                        }
                    })

                    return transaction
                }
            })
        ]
    }
}) 