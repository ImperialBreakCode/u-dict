import React from 'react';
import { DataControl, DCSection } from '../components/dataControlPanel';
import Row from '../components/row';

import '../styles/globalView/globalViews.css';

class WordsLangGlobalView extends React.Component{

    constructor(props){
        super(props);
        this.language = '';
        this.state = {langName: this.language};
    }

    componentDidMount(){
        window.electronAPI.getLangById(this.props.langId).then(lang => {
            this.language = lang[0];
            this.setState({langName: this.language.langName});
            console.log(this.language);
        });
    }

    render(){
        return(
            <main className='lang-words-view'>
                <section>
                <div className="container">
                    <Row>
                        <h1>{this.state.langName}</h1>
                        <DataControl>
                            <DCSection>
                                <span>
                                    <label>Order:</label>
                                    <select className="form-select" aria-label="order select">
                                        <option defaultValue>None</option>
                                        <option value="1">A-Z</option>
                                        <option value="1">Z-A</option>
                                    </select>
                                </span>
                                <span>
                                    <label>Gramatical Gender:</label>
                                    <select className="form-select" aria-label="Gender select">
                                        <option defaultValue>All</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </select>
                                </span>
                                <span>
                                    <label>Groups:</label>
                                    <select className="form-select" aria-label="Group select">
                                        <option defaultValue>All</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </select>
                                </span>
                            </DCSection>
                            
                        </DataControl>
                    </Row>
                </div>
                </section>
                
            </main>
        );
    }

}

export default WordsLangGlobalView;