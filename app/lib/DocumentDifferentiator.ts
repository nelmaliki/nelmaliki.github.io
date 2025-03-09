/**
 * Compare two ProseMirror documents using a simple tree-diff algorithm.
 * Returns an array of diff segments. Each segment is an object with:
 *   - value: the ProseMirror node involved,
 *   - pos: the position in the source document,
 *   - added: true if this node is new in the target,
 *   - removed: true if this node was removed from the source,
 *   - unchanged: true if the node is unchanged.
 */
import { Node as ProsemirrorNode, Schema } from '@tiptap/pm/model';
import { diffWords } from 'diff';

export interface NodeDiff {
    value: ProsemirrorNode
    nodePos: number
    stringStart?: number
    stringEnd?: number
    changeValue?: string
    added?: boolean
    removed?: boolean
}

export function diffDocs(sourceDoc: ProsemirrorNode, targetDoc: ProsemirrorNode | string): ProsemirrorNode {
    if (typeof targetDoc === "string") {
        if (targetDoc.length > 0) {
            targetDoc = parseDocument(targetDoc, sourceDoc.type.schema);
        } else {
            return sourceDoc;
        }
    }

    // Get the text content from both documents
    const sourceText = sourceDoc.textContent;
    const targetText = targetDoc.textContent;

    // Perform word-level diff
    const diffs = diffWords(sourceText, targetText);

    // Create a new document starting with the schema from the source
    const schema = sourceDoc.type.schema;

    // Build content array for the paragraph
    const content: ProsemirrorNode[] = [];

    // Build new document with correction nodes
    diffs.forEach(diff => {
        if (diff.removed) {
            // Add removed text as a correction node
            const correctionNode = schema.nodes.correction.create({
                text: diff.value,
                removed: true,
                added: false
            });
            content.push(correctionNode);
        } else if (diff.added) {
            // Add added text as a correction node
            const correctionNode = schema.nodes.correction.create({
                text: diff.value,
                removed: false,
                added: true
            });
            content.push(correctionNode);
        } else {
            // Add unchanged text as a regular text node
            const textNode = schema.text(diff.value);
            content.push(textNode);
        }
    });

    // Create the paragraph with all content
    const paragraph = schema.node('paragraph', null, content);

    // Create the document with the paragraph
    return schema.node('doc', null, [paragraph]);
}

function parseDocument(docString: string, schema: Schema): ProsemirrorNode {
    // Create a basic document with the text content
    return schema.node('doc', null, [
        schema.node('paragraph', null, [
            schema.text(docString)
        ])
    ]);
}
