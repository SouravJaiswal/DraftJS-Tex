import React from 'react';
import { BlockMath } from 'react-katex';
import {EditorState} from 'draft-js';

class LatexBlock extends React.Component {
    constructor(props){
        super(props);
        const math = this.props.contentState
        .getEntity(this.props.block.getEntityAt(0))
        .getData()['content'];
        console.log(this.props.contentState.getEntity(this.props.block.getEntityAt(0)));
        this.state = {
            math
        }
        this.editMode = false;
    }

    onClick = (e) => {
            e.preventDefault();
            const latex = window.prompt("Enter new formula or click cancel");
            if (!latex){
                return;
            }
            const entityKey = this.props.block.getEntityAt(0);
            const contentState = this.props.blockProps.editorState.getCurrentContent();
            const newContentState = contentState.mergeEntityData(
                entityKey,
                {content: latex},
            )
            this.props.blockProps.onChange(
                newContentState
            );
            this.setState({math: latex});
        }

    render(){
        //console.log(this.state.math);
        return (
            <div onClick={this.onClick}><BlockMath math={this.state.math} /></div>
            
        );
    }
}

export default LatexBlock;