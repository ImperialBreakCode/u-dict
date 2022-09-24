import React from 'react';
import "../styles/view-styles/style.css";
import Row from '../components/row';
import PrimaryButton from '../components/buttons';
import { GlobalViewNames } from '../constants';

class WordsView extends React.Component{

    constructor(props){
        super(props);
    }

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
                                <PrimaryButton onClick={(e) => this.props.changeGlobalView(GlobalViewNames.words)} style='ms-auto'>View Table</PrimaryButton>
                            </ContentRow>
                            <ContentRow>
                                <h5>Table with all phrases</h5>
                                <PrimaryButton onClick={(e) => this.props.changeGlobalView(GlobalViewNames.phrases)} style='ms-auto'>View Table</PrimaryButton>
                            </ContentRow>
                        </ContentBox>
                    </Row>

                    <Row>
                        <ContentBox>
                            <h2 className='mb-3'>Connected Words</h2>
                            <ContentRow>
                                <h5>Words, from different languages grouped by meaning</h5>
                                <PrimaryButton style='ms-auto'>View Table</PrimaryButton>
                            </ContentRow>
                            <ContentRow>
                                <h5>Phrases, from different languages grouped by meaning</h5>
                                <PrimaryButton style='ms-auto'>View Table</PrimaryButton>
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