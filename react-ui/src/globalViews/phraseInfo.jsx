import React from 'react';
import $ from 'jquery';
import PrimaryButton, { SecondaryButton } from '../components/buttons';
import { DataControl, DCSection } from '../components/dataControlPanel';
import { Modal } from '../components/modal';
import '../styles/globalView/globalViews.css';

class PhraseInfo extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            phrase: '',
            gramGendSelect: '',
            meanings: '',
            primaryMeaning: '',
            viewMeanings: ''
        };

        this.endEditing.bind(this);
        this.save.bind(this);
        this.addMean.bind(this);
        this.removeMeaning.bind(this);
        this.setup.bind(this);
        this.saveMeanings.bind(this);
        this.makePrimary.bind(this);
    }

    componentDidMount(){
        this.setup();
    }

    setup(){
        window.electronAPI.getItem(this.props.phraseId).then(phr => {
            if(phr){

                $('#meaning-wrapper').children('div').removeClass('primary-meaning');

                const meanings = phr.meanings.map((meaning, index) => {

                    if (index == 0) {
                        this.setState({primaryMeaning: meaning});
                    }

                    return (
                        <div className={'meaning-box ' + (index == 0 ? 'primary-meaning': '')} meaning={index} key={meaning}>
                            <SecondaryButton style='me-auto' onClick={(e) => this.makePrimary(e)}>P</SecondaryButton>
                            <h5 className='m-0'>{meaning}</h5>
                            <SecondaryButton onClick={(e) => {this.removeMeaning(e)}} style='danger-btn ms-auto'>Remove</SecondaryButton>
                        </div>
                    );

                })

                const viewMeaning = phr.meanings.map((mn, index) => {

                    return(
                        <>
                            <div key={index}>
                                <h4 className='text-center'>{mn}</h4>
                            </div>
                        </>
                        
                    );
                    
                });

                this.setState({phrase: phr});
                this.setState({gramGendSelect: phr.gramGender});
                this.setState({meanings: meanings});
                this.setState({viewMeanings: viewMeaning});

                $('#meaning-wrapper').children('div').first().addClass('primary-meaning');
            }
        });
    }

    endEditing(e){
        this.setState({gramGendSelect: this.state.phrase.gramGender});
        document.querySelector('#phrase-input').value = this.state.phrase.phrase;
        document.querySelector('#phrase-info').value = this.state.phrase.info;
    }

    save(e){

        const final = {
            phrase: document.querySelector('#phrase-input').value.trim() == '' ? this.state.phrase.phrase: document.querySelector('#phrase-input').value.trim(),
            gramGender: this.state.gramGendSelect == 'none' ? null : this.state.gramGendSelect,
            info: document.querySelector('#phrase-info').value.trim() == ''? null : document.querySelector('#phrase-info').value.trim(),
        };

        window.electronAPI.updatePhrase(final, this.props.phraseId);

        window.electronAPI.getItem(this.props.phraseId).then(phr => {
            if(phr){
                this.setState({phrase: phr});
                this.setState({gramGendSelect: phr.gramGender})
            }
        });
    }

    saveMeanings(e){

        const htmlMeanings = $('#meaning-wrapper').children('div');
        let mn = [];

        for (let i = 0; i < htmlMeanings.length; i++) {
            const element = htmlMeanings[i];

            if (element.classList.contains('primary-meaning')) {
                mn = [element.children[1].innerHTML, ...mn];
            }
            else{
                mn.push(element.children[1].innerHTML);
            }

        }

        window.electronAPI.updateMeaningPhr(mn, this.props.phraseId);    
        this.setup();
    }

    addMean(e){
        const meaning = document.querySelector('#new-mean').value.trim();
        document.querySelector('#new-mean').value = '';

        if (meaning) {

            const meaningsTemp = this.state.meanings;
            const newMeaning = (
                <div className='meaning-box' meaning={meaningsTemp.length} key={meaning}>
                    <SecondaryButton style='me-auto' onClick={(e) => this.makePrimary(e)}>P</SecondaryButton>
                    <h5 className='m-0'>{meaning}</h5>
                    <SecondaryButton onClick={(e) => {this.removeMeaning(e)}} style='danger-btn ms-auto'>Remove</SecondaryButton>
                </div>
            );

            meaningsTemp.push(newMeaning);
            this.setState({meanings: meaningsTemp});
        }
    }

    removeMeaning(e){
        const htmlMeanings = document.querySelector('#meaning-wrapper');

        if (htmlMeanings.children.length > 1 ) {
            const element = e.target.closest('div');
            const index = element.getAttribute('meaning');

            let stateCopy = [...this.state.meanings];

            for (let i = 0; i < stateCopy.length; i++) {

                if (stateCopy[i].props.meaning == index) {
                    stateCopy.splice(i, 1);
                    break;
                }
            }

            this.setState({meanings: stateCopy});

            if (element.classList.contains('primary-meaning')) {
                $('#meaning-wrapper').children('div').first().addClass('primary-meaning');
            } 
        }
    }

    makePrimary(e){
        $('#meaning-wrapper').children('div').removeClass('primary-meaning');
        e.target.closest('div').classList.add('primary-meaning');
    }

    render(){

        const keys = this.state.phrase.foreignKeys;

        const footerEditModal = (
            <>
                <PrimaryButton onClick={(e) => { this.save(e) }} dissmiss='modal'>Save</PrimaryButton>
                <SecondaryButton onClick={(e) => { this.endEditing(e) }} dissmiss='modal'>Cancel</SecondaryButton>
            </>
        );

        const footerMeaningsMan = (
            <>
                <PrimaryButton onClick={(e) => this.saveMeanings(e)} dissmiss='modal'>Save</PrimaryButton>
                <SecondaryButton onClick={() => { this.setup(); document.querySelector('#new-mean').value = ''; }} dissmiss='modal'>Cancel</SecondaryButton>
            </>
        );

        return(
            <main className='phrase-info-view'>

                <Modal elemId='edit-phr-modal' title='edit phrase data' footer={footerEditModal}>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="phrase-input" className="col-form-label">Phrase:</label>
                            <input type="text" className="form-control" id="phrase-input" defaultValue={this.state.phrase.phrase}/>
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
                            <label htmlFor="phrase-info">More information:</label>
                            <textarea className="form-control" placeholder="More information..." id="phrase-info" defaultValue={this.state.phrase.info}></textarea>
                        </div>
                    </form>
                </Modal>

                <Modal elemId='manage-meaning-modal' title='manage meanings' footer={footerMeaningsMan}>
                    <p>One word should have at least one meaning</p>
                    <div id='meaning-wrapper'>
                        {this.state.meanings}
                    </div>
                    
                    <div className='add-mean'>
                        <input id='new-mean' placeholder='add a new meaning...' className='form-control' type='text'/>
                        <PrimaryButton onClick={(e) => this.addMean(e)}>Add</PrimaryButton>
                    </div>
                </Modal>

                <DataControl>
                    <h1 className='phrase-name'>

                        <button onClick={(e) => this.props.changeGlobalView(this.props.fromView, keys) } 
                            className='go-back-btn'>
                                Go Back  
                        </button>

                        {this.state.phrase.phrase}
                    </h1>
                </DataControl>

                <DataControl>

                    <DCSection>

                        <div className='info-box'>
                            <h5>Phrase:</h5>
                            <h3>{this.state.phrase.phrase}</h3>
                        </div>

                        <div className='info-box'>
                            <h5>Primary Meaning:</h5>
                            <h3>{this.state.primaryMeaning}</h3>
                        </div>

                    </DCSection>

                    <DCSection>

                        <div className='info-box'>
                            <h5>Gramatical Gender:</h5>
                            <h3>{this.state.phrase.gramGender ?? '--'}</h3>
                        </div>

                        <div className='info-box'>
                            <h5>Info:</h5>
                            <p className='mb-0'>{this.state.phrase.info ?? '--'}</p>
                        </div>
                    </DCSection>

                    <DCSection>
                        <button data-bs-toggle="modal" data-bs-target="#edit-phr-modal" className='purple-button w-50'>Edit</button>
                        <button data-bs-toggle="modal" data-bs-target="#manage-meaning-modal" className='purple-button w-50'>Manage meanings</button>
                    </DCSection>

                </DataControl>

                <DataControl>
                    <DCSection>
                        <h2>Meanings:</h2>
                    </DCSection>

                    <div>
                        {this.state.viewMeanings}
                    </div>
                </DataControl>
            </main>
        );
    }
}

export default PhraseInfo;