import React, { Component } from 'react';
import { EditorState, convertToRaw, convertFromHTML, ContentBlock, RichUtils } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import LatexToolbarOption from './LatexToolbarOption';
import LatexBlock from './LatexBlock'
/*
    const rawState = convertToRaw(editorState.getCurrentContent());
    console.log(draftToHtml);
    const markup = draftToHtml(
      rawState
    );
    const backToInput = convertFromHTML(markup);
    console.log("New State:", backToInput);
    console.log("Markup:", rawState, "R:",markup);

     
    */



class EditorLatex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(), 
      text: 1
    };
  }

  blockRenderer = (block, config, editorState) => {
    if (block.getType() === 'atomic') {
      const contentState = config.getEditorState().getCurrentContent();
      const entity = contentState.getEntity(block.getEntityAt(0));
      if (entity && entity.type === 'TOKEN') {
        return {
          component: LatexBlock,
          editable: false,
          props: {
            math: "\\int_0^\\infty x^2 dx",
            onChange: (newContentState) => {
              this.setState({editorState: EditorState.createWithContent(newContentState)});
            },
            editorState: this.state.editorState
          }
        }
      } else {
        return false;
      }
    }
    return null;
  };

  onEditorStateChange: Function = (editorState) => {
    this.setState({
      editorState,
    });
  };

  _handleKeyCommand = (command, editorState) => {
    var newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onEditorStateChange(newState);
      return true;
    }
    return false;
  };

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
        toolbar={{ options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'embedded', 'image', 'remove', 'history']}}
        editorState={editorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={this.onEditorStateChange}
        toolbarCustomButtons={[ <LatexToolbarOption />]}
        customBlockRenderFunc={this.blockRenderer}
        handleKeyCommand={this._handleKeyCommand}
        editorStyle={{border:'1px', height: '400px', border: '1px solid grey'}}
      />
      </div>
    )
  }
}

export default EditorLatex;