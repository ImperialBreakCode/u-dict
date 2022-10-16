import React from 'react';
import PrimaryButton from '../components/buttons';
import { ContentBox, ContentRow } from '../components/contentBoxes';
import Row from '../components/row';
import { GlobalViewNames } from '../constants';
import "../styles/view-styles/style.css";


class ExercView extends React.Component{

    render(){
        return(
            <div className='exercises-view'>
                <div className="container cont-view">
                    <Row>
                        <div className="title-box">
                            <h1>Exercises</h1>
                        </div>
                    </Row>

                    <Row>
                        <ContentBox>
                            <h2>closed answer questions</h2>
                            <ContentRow>
                                <h5>Exercise the meanings of words and phrases</h5>
                                <PrimaryButton onClick={(e) => this.props.changeGlobalView(GlobalViewNames.prepExercise, GlobalViewNames.wordPhraseMeaningTest)} style='ms-auto'>Begin Test</PrimaryButton>
                            </ContentRow>
                            <ContentRow>
                                <h5>Guess the words from a given meaning</h5>
                                <PrimaryButton onClick={(e) => this.props.changeGlobalView(GlobalViewNames.prepExercise, GlobalViewNames.meaningWordPhrase)} style='ms-auto'>Begin Test</PrimaryButton>
                            </ContentRow>
                            <ContentRow>
                                <h5>Guess the grammatical gender</h5>
                                <PrimaryButton onClick={(e) => this.props.changeGlobalView(GlobalViewNames.prepExercise, GlobalViewNames.gramGenderTest)} style='ms-auto'>Begin Test</PrimaryButton>
                            </ContentRow>
                        </ContentBox>

                        <ContentBox>
                            <h2>questions with open ended answers</h2>
                            <ContentRow>
                                <h5>Exercise the spelling of words and phrases</h5>
                                <PrimaryButton style='ms-auto'>Begin Test</PrimaryButton>
                            </ContentRow>
                        </ContentBox>
                    </Row>
                </div>
            </div>
        );
    }

}

export default ExercView;