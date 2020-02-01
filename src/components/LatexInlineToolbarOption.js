import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditorState, Modifier, AtomicBlockUtils, } from 'draft-js';
import { InlineMath, BlockMath } from 'react-katex';
import {
  getSelectionEntity,
  getEntityRange
} from 'draftjs-utils';


class LatexInlineToolbarOption extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    editorState: PropTypes.object,
  };

  addStar: Function = (): void => {
    /*
const { editorState, onChange } = this.props;
const latex = window.prompt("Enter the formula: ");
if (!latex) {
  return;
}


let contentState = editorState.getCurrentContent();
const nextFormula = latex;
const contentStateWithEntity = contentState.createEntity(
  'INLINEMATH',
  'IMMUTABLE',
  { content: nextFormula },
);
console.log("Current Selection:", editorState
  .getSelection()
  .getFocusOffset()
);
let selection = editorState.getSelection();

const currentEntity = getSelectionEntity(editorState);
if (currentEntity) {
  const entityRange = getEntityRange(editorState, currentEntity);
  const isBackward = selection.getIsBackward();
  if (isBackward) {
    selection = selection.merge({
      anchorOffset: entityRange.end,
      focusOffset: entityRange.start,
    });
  } else {
    selection = selection.merge({
      anchorOffset: entityRange.start,
      focusOffset: entityRange.end,
    });
  }
}

selection = newEditorState.getSelection().merge({
  anchorOffset: selection.get('anchorOffset') + latex.length,
  focusOffset: selection.get('anchorOffset') + latex.length,
});
console.log(selection);
const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
const finalContentState = Modifier.replaceText(
  editorState.getCurrentContent(),
  selection,
  'math',
  editorState.getCurrentInlineStyle(),
  entityKey
)
let newEditorState = EditorState.push(
  editorState,
  finalContentState,
  'insert-characters'
);
==
    */
    const { editorState, onChange } = this.props;
    const currentEntity = getSelectionEntity(editorState);
    let selection = editorState.getSelection();
    const latex = window.prompt("Enter the formula: ");
    if (!latex) {
      return;
    }

    if (currentEntity) {
      const entityRange = getEntityRange(editorState, currentEntity);
      const isBackward = selection.getIsBackward();
      if (isBackward) {
        selection = selection.merge({
          anchorOffset: entityRange.end,
          focusOffset: entityRange.start,
        });
      } else {
        selection = selection.merge({
          anchorOffset: entityRange.start,
          focusOffset: entityRange.end,
        });
      }
    }
    console.log("Latex:", latex);
    const entityKey = editorState
      .getCurrentContent()
      .createEntity('INLINEMATH', 'MUTABLE', {
        content: latex
      })
      .getLastCreatedEntityKey();

    let contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      selection,
      latex,
      editorState.getCurrentInlineStyle(),
      entityKey
    );
    let newEditorState = EditorState.push(
      editorState,
      contentState,
      'insert-characters'
    );

    // insert a blank space after link
    selection = newEditorState.getSelection().merge({
      anchorOffset: selection.get('anchorOffset') + latex.length,
      focusOffset: selection.get('anchorOffset') + latex.length,
    });
    newEditorState = EditorState.acceptSelection(newEditorState, selection);
    contentState = Modifier.insertText(
      newEditorState.getCurrentContent(),
      selection,
      ' ',
      newEditorState.getCurrentInlineStyle(),
      undefined
    );
    onChange(
      EditorState.push(newEditorState, contentState, 'insert-characters')
    );
  };

  render() {
    return (
      <div onClick={this.addStar} className="rdw-option-wrapper">$'</div>
    );
  }
}

export default LatexInlineToolbarOption;
