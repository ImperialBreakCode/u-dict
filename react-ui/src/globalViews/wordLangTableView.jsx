import React from 'react';
import { DataControl, DCSection } from '../components/dataControlPanel';
import Row from '../components/row';

import '../styles/globalView/globalViews.css';

class WordsLangGlobalView extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        return(
            <main className='lang-words-view'>
                <section>
                <div className="container">
                    <Row>
                        <h1>Language</h1>
                        <DataControl>
                            <DCSection>
                                <span>
                                    <label>Gramatical Gender:</label>
                                    <select class="form-select" aria-label="Default select example">
                                        <option selected>All</option>
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