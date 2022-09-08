import React from 'react';
import PrimaryButton, { SecondaryButton } from '../components/buttons';
import { DataControl, DCSection } from '../components/dataControlPanel';
import { GlobalViewNames } from '../constants';
import { Modal } from '../components/modal';
import '../styles/globalView/globalViews.css';

class WordInfo extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            word: '',
            gramGendSelect: ''
        };

        this.endEditing.bind(this);
        this.save.bind(this);
    }

    componentDidMount(){
        window.electronAPI.getItem(this.props.wordId).then(wrd => {
            if(wrd){
                console.log(wrd);
                this.setState({word: wrd});
                this.setState({gramGendSelect: wrd.gramGender})
            }
        });
    }

    endEditing(e){
        this.setState({gramGendSelect: this.state.word.gramGender});
        document.querySelector('#word-input').value = this.state.word.word;
        document.querySelector('#article-input').value = this.state.word.article;
        document.querySelector('#plural-input').value = this.state.word.plural;
        document.querySelector('#word-info').value = this.state.word.info;
    }

    save(e){

        const final = {
            word: document.querySelector('#word-input').value.trim() == '' ? this.state.word.word: document.querySelector('#word-input').value.trim(),
            article: document.querySelector('#article-input').value.trim(),
            plural: document.querySelector('#plural-input').value.trim() == '' ? null: document.querySelector('#plural-input').value.trim(),
            gramGender: this.state.gramGendSelect == 'none' ? null : this.state.gramGendSelect,
            info: document.querySelector('#word-info').value.trim() == ''? null : document.querySelector('#word-info').value.trim(),
        };

        window.electronAPI.updateWord(final, this.props.wordId);

        window.electronAPI.getItem(this.props.wordId).then(wrd => {
            if(wrd){
                console.log(wrd);
                this.setState({word: wrd});
                this.setState({gramGendSelect: wrd.gramGender})
            }
        });

        //this.endEditing(e);
    }

    render(){

        const keys = this.state.word.foreignKeys;

        const footerEditModal = (
            <>
                <PrimaryButton onClick={(e)=> {this.save(e) }} dissmiss='modal'>Save</PrimaryButton>
                <SecondaryButton onClick={(e)=> {this.endEditing(e) }} dissmiss='modal'>Cancel</SecondaryButton>
            </>
        );

        return(
            <main className='word-info-view'>

                <Modal elemId='edit-wrd-modal' title='edit word data' footer={footerEditModal}>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="word-input" className="col-form-label">Word:</label>
                            <input type="text" className="form-control" id="word-input" defaultValue={this.state.word.word}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="article-input" className="col-form-label">Article (a, an, un ...): <br></br><i>If there is no article leave the field blank</i></label>
                            <input type="text" className="form-control" id="article-input" defaultValue={this.state.word.article}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="plural-input" className="col-form-label">Plural:</label>
                            <input type="text" className="form-control" id="plural-input" defaultValue={this.state.word.plural}/>
                        </div>
                        <div className="mb-3">
                            <label>Gramatical Gender:</label>
                            <select id='form-gram-gender' className="form-select modal-opt" aria-label="Gender select" 
                                value={this.state.gramGendSelect} onChange={(e)=> {this.setState({gramGendSelect: e.target.value})}}>
                                <option value="none">None</option>
                                <option value="masculine">masculine</option>
                                <option value="feminine">feminine</option>
                                <option value="neuter">neuter</option>
                                <option value="animate">animate</option>
                                <option value="inanimate">inanimate</option>
                                <option value="common">common</option>
                            </select>
                        </div>
                        <div className='mb-3'>
                            <label for="word-info">More information:</label>
                            <textarea className="form-control" placeholder="More information..." id="word-info" defaultValue={this.state.word.info}></textarea>
                        </div>
                    </form>
                </Modal>

                <Modal elemId='manage-meaning-modal' title='manage meanings'>

                </Modal>

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
                            <h3>{this.state.word.plural ?? '--'}</h3>
                        </div>

                    </DCSection>

                    <DCSection>

                        <div className='info-box'>
                            <h5>Gramatical Gender:</h5>
                            <h3>{this.state.word.gramGender ?? '--'}</h3>
                        </div>

                        <div className='info-box'>
                            <h5>Info:</h5>
                            <p className='mb-0'>{this.state.word.info ?? '--'}</p>
                        </div>
                    </DCSection>

                    <DCSection>
                        <button data-bs-toggle="modal" data-bs-target="#edit-wrd-modal" className='purple-button w-50'>Edit</button>
                        <button data-bs-toggle="modal" data-bs-target="#manage-meaning-modal" className='purple-button w-50'>Manage meanings</button>
                    </DCSection>

                </DataControl>
            </main>
        );
    }
}

export default WordInfo;