/**
 * Compare two ProseMirror documents using a simple tree-diff algorithm.
 * Returns an array of diff segments. Each segment is an object with:
 *   - value: the ProseMirror node involved,
 *   - pos: the position in the source document,
 *   - added: true if this node is new in the target,
 *   - removed: true if this node was removed from the source,
 *   - unchanged: true if the node is unchanged.
 */
import { DOMParser as ProseMirrorDOMParser, Node as ProseMirrorNode, Schema as ProseMirrorSchema } from "prosemirror-model";
import { diffWords } from 'diff';

export type NodeDiff = Partial<NodeValueDiff> & {
    value: ProseMirrorNode;
    nodePos: number;
}

interface NodeValueDiff {
    changeValue: string,
    added?: boolean;
    removed?: boolean;
}

export function diffDocs(sourceDoc: ProseMirrorNode, targetDoc: ProseMirrorNode | string): NodeDiff[] {
    // Start diffing at the document level, with an initial position of 0.
    if (typeof targetDoc === "string") {
        targetDoc = parseDocument(targetDoc, sourceDoc.type.schema);
    }
    return diffNode(sourceDoc, targetDoc, 0);
}

function parseDocument(docString: string, schema: ProseMirrorSchema): ProseMirrorNode {
    const parser = ProseMirrorDOMParser.fromSchema(schema);
    const tempEl = document.createElement('div');
    tempEl.innerHTML = docString;  // your HTML string content
    return parser.parse(tempEl);
}

/**
 * Recursively diff two nodes.
 * pos is the current offset in the source document.
 */
function diffNode(source: ProseMirrorNode, target: ProseMirrorNode, nodePos: number): NodeDiff[] {
    let diffs: NodeDiff[] = [];

    // Determine the maximum number of children we need to examine.
    const maxNumChildren = Math.max(source.childCount, target.childCount);
    // In ProseMirror, a node's content is wrapped by start/end tokens.
    // We start the position offset for children at pos + 1.
    let currentPos = nodePos + 1;

    for (let i = 0; i < maxNumChildren; i++) {
        const sourceChild = i < source.childCount ? source.child(i) : null;
        const targetChild = i < target.childCount ? target.child(i) : null;

        // If both nodes exist at this index and have the same type and attributes,
        // consider them unchanged and recursively diff their children.
        const childrenAreSame = sourceChild &&
            targetChild &&
            sourceChild.type === targetChild.type &&
            compareAttrs(sourceChild.attrs, targetChild.attrs);
        if (childrenAreSame) {
            // If both nodes are text nodes, perform a text diff.
            if (sourceChild.text && targetChild.text) {
                const textDiffs: NodeValueDiff[] = diffWords2(sourceChild.text, targetChild.text);
                const nodeDiffs: NodeDiff[] = textDiffs.map(textDiff => ({ ...textDiff, nodePos, value: sourceChild }));
                diffs.push(...nodeDiffs);
            }
            else {
                // Mark the node as unchanged.
                diffs.push({ value: sourceChild, nodePos: currentPos });
            }
            // If the nodes have children, diff those recursively.
            if (sourceChild.childCount || targetChild.childCount) {
                const childDiffs = diffNode(sourceChild, targetChild, currentPos);
                diffs = diffs.concat(childDiffs);
            }
            // Advance the current position by the size of the source node.
            currentPos += sourceChild.nodeSize;
        } else {
            // If there is a node in the source that doesn't match the target,
            // mark it as removed.
            if (sourceChild) {
                diffs.push({ value: sourceChild, nodePos: currentPos, removed: true });
                currentPos += sourceChild.nodeSize;
            }
            // If there is a node in the target that doesn't appear in the source,
            // mark it as added. Note: since the node isn’t in the source,
            // we use the current position as the insertion point.
            if (targetChild) {
                diffs.push({ value: targetChild, nodePos: currentPos, added: true });
            }
        }
    }
    return diffs;
}

/**
 * Simple helper to compare node attributes.
 * Returns true if both attribute sets are equal.
 */
function compareAttrs(attrs1: { [key: string]: any }, attrs2: { [key: string]: any }): boolean {
    const keys1 = Object.keys(attrs1);
    const keys2 = Object.keys(attrs2);
    if (keys1.length !== keys2.length) return false;
    for (const key of keys1) {
        if (attrs1[key] !== attrs2[key]) return false;
    }
    return true;
}


/**
 * diff wrapper around Myers' Diff algorithm from diff library
 */
function diffWords2(oldStr: string, newStr: string): NodeValueDiff[] {
    //the diff library returns an array of changes but does not include the index of the change
    //we are going to index by the token position in the original string
    const diffs = diffWords(oldStr, newStr);
    
    let currentPos = 0;
    const result: NodeValueDiff[] = [];
    
    for (const diff of diffs) {
        // Create a NodeValueDiff object for each change
        const nodeDiff: NodeValueDiff = {
            changeValue: diff.value,
            added: diff.added || false,
            removed: diff.removed || false
        };
        
        // Add to result array
        result.push(nodeDiff);
        
        // Only advance position for non-added segments (original text)
        if (!diff.added) {
            currentPos += diff.value.length;
        }
    }
    
    return result;
}

/**
 * A custom diffWords implementation that compares two strings on a word level.
 * It tokenizes each string (preserving trailing whitespace) and computes a longest
 * common subsequence (LCS) to determine which tokens have been added or removed.
 *
 * @param {string} oldStr - The original string.
 * @param {string} newStr - The updated string.
 * @returns {Array<NodeValueDiff>} An array of diff segments
 */
function customDiffWords(oldStr: string, newStr: string): NodeValueDiff[] {
    const oldTokens = tokenize(oldStr);
    const newTokens = tokenize(newStr);

    // Build an LCS matrix.
    const lcs = Array(oldTokens.length + 1)
        .fill(null)
        .map(() => Array(newTokens.length + 1).fill(0));

    //efficient lookup to find the substring position of each token in the original string
    let posCounter = 0;
    const tokenPosLookup = Array(oldTokens.length + 1)
        .fill(null)
        .map((_, index: number) => {
            //the start of this token is the value of the counter
            const pos = posCounter;
            //add the length of the token (this includes separator)
            posCounter += oldTokens[index]?.length ?? 0;
            //set pos in array
            return pos;
        });

    for (let i = 1; i <= oldTokens.length; i++) {
        for (let j = 1; j <= newTokens.length; j++) {
            if (oldTokens[i - 1] === newTokens[j - 1]) {
                lcs[i][j] = lcs[i - 1][j - 1] + 1;
            } else {
                lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
            }
        }
    }

    // Backtrack through the matrix to build the diff segments.
    let i = oldTokens.length;
    let j = newTokens.length;
    const segments: NodeValueDiff[] = [];

    while (i > 0 || j > 0) {
        //values are equal
        if (i > 0 && j > 0 && oldTokens[i - 1] === newTokens[j - 1]) {
            // const stringStart = i - 1;
            // const changeValue = oldTokens[stringStart];
            // const stringEnd = stringStart + changeValue.length
            // segments.push({ changeValue, stringStart, stringEnd });
            i--;
            j--;
            //if lcs is longer in the newString, then it's an add
        } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
            const tokenIndex = j - 1;
            const stringStart = tokenPosLookup[tokenIndex]
            const changeValue = newTokens[tokenIndex].trim()
            const stringEnd = stringStart + changeValue.length
            segments.push({ changeValue, stringStart, stringEnd, added: true });
            j--;
        }
        //if lcs is shorter in the newString, then it's a remove
        else if (i > 0 && (j === 0 || lcs[i][j - 1] < lcs[i - 1][j])) {
            const tokenIndex = i - 1;
            const stringStart = tokenPosLookup[tokenIndex]
            const changeValue = oldTokens[tokenIndex].trim()
            const stringEnd = stringStart + changeValue.length
            segments.push({ changeValue, stringStart, stringEnd, removed: true });
            i--;
        }
    }

    segments.reverse();
    return segments;
}

const TOKEN_REGEX = /(\S+\s*)/g;
/**
 * Tokenize a string into an array of tokens.
 * Each token is a contiguous group of non‑whitespace characters along with any trailing whitespace.
 *
 * For example, "A cat jumped" becomes ["A ", "cat ", "jumped"].
 *
 * @param {string} str - The input string.
 * @returns {Array<string>} An array of tokens.
 */
function tokenize(str: string) {
    return str.match(TOKEN_REGEX) || [];
}

