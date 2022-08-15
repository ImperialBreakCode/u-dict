import React from 'react';
import { DataControl, DCSection } from '../components/dataControlPanel';
import { GlobalViewNames } from '../constants';
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
                console.log(wrd);
                this.setState({word: wrd});
            }
        });
    }

    render(){

        const keys = this.state.word.foreignKeys;

        return(
            <main className='word-info-view'>

                <DataControl>
                    <h1 className='word-name'>

                        <button onClick={(e) => this.props.changeGlobalView(GlobalViewNames.langWord, keys)} 
                            className='go-back-btn'>
                                Go Back  
                        </button>

                        {this.state.word.word}
                    </h1>
                </DataControl>

                <DataControl>

                    <DCSection>

                        <div className='info-box'>
                            <h5>Article:</h5>
                            <h3>{this.state.word.article != "" ? this.state.word.article : '--'}</h3>
                        </div>

                        <div className='info-box'>
                            <h5>Word:</h5>
                            <h3>{this.state.word.word}</h3>
                        </div>

                        <div className='info-box'>
                            <h5>Meaning:</h5>
                            <h3>{this.state.word.meanings}</h3>
                        </div>

                        <div className='info-box'>
                            <h5>Plural:</h5>
                            <h3>{this.state.word.plural != null ? this.state.word.plural : '--'}</h3>
                        </div>

                    </DCSection>

                    <DCSection>

                        <div className='info-box'>
                            <h5>Gramatical Gender:</h5>
                            <h3>{this.state.word.gramGender != null ? this.state.word.gramGender : '--'}</h3>
                        </div>

                        <div className='info-box'>
                            <h5>Info:</h5>
                            <h3>{this.state.word.info != null ? this.state.word.info : '--'}</h3>
                        </div>
                    </DCSection>

                </DataControl>
            </main>
        );
    }
}

export default WordInfo;