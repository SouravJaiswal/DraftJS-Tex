import React from 'react';
import EditorLatex from './EditorLatex';

class QuestionEditor extends React.Component {
    render(){
        return (
            <div style={{width: "80%", margin: 'auto'}}>
                <h3>Editor:</h3>
                <EditorLatex />
            </div>
        )
    }
}

export default QuestionEditor;