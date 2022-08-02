import React from 'react';
import '../styles/globalView/globalViews.css';

class WordInfo extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            word: ''
        };
    }

    componentDidMount(){
        window.electronAPI.getItem(this.props.wordId).then(wrd => {
            if(wrd){
                this.setState({word: wrd});
            }
        });
    }

    render(){
        return(
            <h1>{this.state.word.id}</h1>
        );
    }
}

export default WordInfo;