import React from 'react';
import "../styles/view-styles/style.css";
import Row from '../components/row';
import { PrimaryButton } from '../components/buttons';

class WordsView extends React.Component{

    render(){
        return(
            <div className='word-view'>
                <div className="container cont-view">
                    <Row>
                        <div className="title-box">
                            <h1>Words and Phrases</h1>
                        </div>
                    </Row>
                    
                    <Row>
                        <ContentBox>
                            <h2 className='mb-3'>Tables</h2>
                            <ContentRow>
                                <h5>Table with all words</h5>
                                <PrimaryButton>View Table</PrimaryButton>
                            </ContentRow>
                            
                        </ContentBox>
                    </Row>
                </div>
            </div>
        );
    }

}

function ContentBox(props) {
    return(
        <div className="content-box">
            {props.children}
        </div>
    );
}

function ContentRow(props) {
    return(
        <div className="content-row">
            {props.children}
        </div>
    );
}

export default WordsView;