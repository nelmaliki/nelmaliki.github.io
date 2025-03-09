import { mergeAttributes, Node } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewRendererProps, NodeViewWrapper } from '@tiptap/react'
import React from 'react'

function CorrectionComponent(props: NodeViewRendererProps): React.ReactElement {
    const { text, removed, added } = props.node.attrs

    return (
        <NodeViewWrapper className="correction-node inline-block">
            {removed && <span className="original-text problem bg-NaplesYellow" style={{ textDecoration: 'line-through' }}>{text}</span>}
            {added && <span className="corrected-text bg-Asparagus">{text}</span>}
            {!added && !removed && <span className="original-text">{text}</span>}
        </NodeViewWrapper>
    )
}

export const CorrectionNode = Node.create({
    name: 'correction',
    group: 'inline',
    inline: true,
    selectable: false,
    editable: true,
    atom: true,
    addAttributes() {
        return {
            text: {
                default: '',
            },
            removed: {
                default: false,
            },
            added: {
                default: false,
            }
        }
    },
    parseHTML() {
        return [
            {
                tag: 'span[data-correction]',
            },
        ]
    },
    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(HTMLAttributes, { 'data-correction': '' }), 0]
    },
    addNodeView() {
        return ReactNodeViewRenderer(CorrectionComponent)
    },
}) 