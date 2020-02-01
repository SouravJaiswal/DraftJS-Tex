import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import { EditorState, Modifier } from 'draft-js';

export function findInlineBlock(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity();
            return (
                entityKey !== null &&
                contentState.getEntity(entityKey).getType() === 'INLINEMATH'
            );
        },
        callback,
    );
}


export class LatexInlineBlock extends React.Component {
    constructor(props) {
        super(props);
        //console.log("Inline Block:", props);
        const math = this.props.contentState.getEntity(this.props.entityKey).getData().content;
        this.state = {
            math
        }
        this.editMode = false;
    }

    onClick = (e) => {
        e.preventDefault();
        const latex = window.prompt("Enter new formula or click cancel");
        if (!latex) {
            return;
        }
        //console.log(this.props);
        const { editorState } = this.props;
        debugger;
        const entityKey = this.props.entityKey;
        const contentState = this.props.editorState.getCurrentContent();
        let newContentState = contentState.mergeEntityData(
            entityKey,
            { content: latex },
        )
        const entityKeyNew = newContentState.getLastCreatedEntityKey();
        const finalContentState = Modifier.replaceText(
            editorState.getCurrentContent(),
            editorState.getSelection(),
            'math',
            editorState.getCurrentInlineStyle(),
            entityKeyNew
        )
        let newEditorState = EditorState.push(
            editorState,
            finalContentState,
            'insert-characters'
        );
        this.props.onChange(
            newEditorState
        );
        this.setState({ math: latex });
    }

    render() {
        //console.log(this.state.math);
        return (
            <span onClick={this.onClick} readOnly contentEditable="false" suppressContentEditableWarning={true}>
                <InlineMath math={this.state.math} />
            </span>
        );
    }
}

export default LatexInlineBlock;