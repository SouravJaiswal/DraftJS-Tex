import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentBlock, RichUtils } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import LatexToolbarOption from './LatexToolbarOption';
import LatexInlineToolbarOption from './LatexInlineToolbarOption';
import LatexBlock from './LatexBlock'
import { findInlineBlock, LatexInlineBlock } from './LatexInlineBlock';
import {convertToHTML, convertFromHTML } from 'draft-convert';
import { InlineMath } from 'react-katex';

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



function LatexToHtml (entity, text) {
  console.log("Entity:", entity, "Text:", text);
  if (entity.type === 'INLINEMATH'){
    return `<latex math="${entity.data.content}">${entity.data.content}</latex>`;
  }else if (entity.type === 'BLOCKMATH'){
    return `<blocklatex math="${entity.data.content}">${entity.data.content}</blocklatex>`;
  }
}

function htmlToBlock(nodeName, node){
  console.log("NodeName1:", nodeName, "Node1:", node);
  if(nodeName === "blocklatex"){
    return {type: 'atomic', data: { content: node.innerText}}
  }
}

function HTMLtoLatex (nodeName, node, createEntity) {
  console.log("NodeName:", nodeName, "Node:", node);
   if (nodeName === "latex") {
    return createEntity(
      'INLINEMATH', 'MUTABLE', {
        content: node.innerText
      }
    )
  }else if (nodeName === "blocklatex") {
    return createEntity(
      'BLOCKMATH', 'MUTABLE', {
        content: node.innerText
      }
    )
  }
}
class EditorLatex extends Component {
  constructor(props) {
    super(props);
    this.default = '<p>aesrdghfgjh<latex math="adfsghfgjh">adfsghfgjh</latex> fghj,&nbsp;</p><blocklatex math="dfjgkh">dfjgkh</blocklatex><p></p>';
    this.contentState2 = convertFromHTML({htmlToEntity: HTMLtoLatex, htmlToBlock})(this.default);
    this.state = {
      editorState: EditorState.createWithContent(this.contentState2),
      text: 1
    };
  }

  blockToHTML = (block) => {
    debugger;
    console.log("Block:", block.type);
    if (block.type === 'atomic'){
      const contentState = this.state.editorState.getCurrentContent();
      //console.log("ContentState:", contentState);
      let entity = contentState.getBlockForKey(block.key);
      entity = entity.getEntityAt(0);
      //console.log("Entity:", entity);
      if (entity) {
        switch (entity.type) {
          case 'BLOCKMATH':
            return <blocklatex></blocklatex>;
          default:
            return ;
        }
      }
      
    }
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
    const rawState = convertToRaw(editorState.getCurrentContent());
    console.log("HTML:", draftToHtml(rawState, null, null,LatexToHtml));
    console.log()
  };

  _handleKeyCommand = (command, editorState) => {
    //console.log(command);
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