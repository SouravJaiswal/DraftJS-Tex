import React, { Component } from 'react';
import { EditorState, convertToRaw, convertFromHTML, ContentBlock, RichUtils } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import LatexToolbarOption from './LatexToolbarOption';
import LatexInlineToolbarOption from './LatexInlineToolbarOption';
import LatexBlock from './LatexBlock'
import { findInlineBlock, LatexInlineBlock } from './LatexInlineBlock';
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
      //console.log("Block:", block);
      const contentState = config.getEditorState().getCurrentContent();
      //console.log("ContentState:", contentState);
      const entity = contentState.getEntity(block.getEntityAt(0));
      //console.log("Entity:", entity);
      if (entity) {
        switch (entity.type) {
          case 'BLOCKMATH':
            return {
              component: LatexBlock,
              editable: false,
              props: {
                math: "\\int_0^\\infty x^2 dx",
                onChange: (newContentState) => {
                  this.setState({ editorState: EditorState.createWithContent(newContentState) });
                },
                editorState: this.state.editorState
              }
            }
          default:
            return false;
        }
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
    console.log(command);
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
          toolbar={{ options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'embedded', 'image', 'remove', 'history'] }}
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={this.onEditorStateChange}
          toolbarCustomButtons={[<LatexToolbarOption />, <LatexInlineToolbarOption />]}
          customBlockRenderFunc={this.blockRenderer}
          handleKeyCommand={this._handleKeyCommand}
          editorStyle={{ border: '1px', height: '400px', border: '1px solid grey' }}
          customDecorators={[{
            strategy: findInlineBlock, component: LatexInlineBlock,
            props: {
              editorState: editorState, onChange: this.onEditorStateChange
            }
          }]}
        />
      </div>
    )
  }
}

export default EditorLatex;