import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState, Modifier, AtomicBlockUtils, } from 'draft-js';
import {InlineMath, BlockMath} from 'react-katex';


class LatexToolbarOption extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    editorState: PropTypes.object,
  };

  addStar: Function = (): void => {
    const { editorState, onChange } = this.props;
    const latex = window.prompt("Enter the formula: ");
    if (!latex){
      return;
    }
    const contentState = editorState.getCurrentContent();
    const nextFormula = latex;
    const contentStateWithEntity = contentState.createEntity(
      'TOKEN',
      'IMMUTABLE',
      {content: nextFormula},
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(
      editorState,
      {currentContent: contentStateWithEntity},
    );

    return onChange(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '));
  };

  render() {
    return (
      <div onClick={this.addStar} className="rdw-option-wrapper">$</div>
    );
  }
}

export default LatexToolbarOption;



function insertTeXBlock() {
  const { editorState, onChange } = this.props;
  const latex = window.prompt("Enter the formula: ");
  const contentState = editorState.getCurrentContent();
  const nextFormula = latex;
  const contentStateWithEntity = contentState.createEntity(
    'TOKEN',
    'IMMUTABLE',
    {content: nextFormula},
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newEditorState = EditorState.set(
    editorState,
    {currentContent: contentStateWithEntity},
  );
  return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' ');
}