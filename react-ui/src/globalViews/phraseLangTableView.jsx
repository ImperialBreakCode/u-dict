import React from 'react';
import $ from 'jquery';
import { DataControl, DCSection } from '../components/dataControlPanel';
import Row from '../components/row';
import PrimaryButton, { SecondaryButton } from '../components/buttons';
import {Table} from '../components/table';

import '../styles/globalView/globalViews.css';
import { Modal } from '../components/modal';
import { GlobalViewNames, ViewNames } from '../constants';

class PhrasesLangGlobalView extends React.Component{

    constructor(props){

        super(props);

        this.state = {
            lang: '',
            phrases: <tr></tr>,
            groups: '',
            values: {
                genderValue: 'all',
            }
        };

        this.tableHead = ['Phrase', 'Meaning', 'Gramatical Gender', 'More'];

        this.genderChangeSelect.bind(this);
        this.createPhrasesHtml.bind(this);
        this.addNewPhrase.bind(this);
        this.deleteLanguage.bind(this);
        this.searchPhrases.bind(this);
        this.deletePhrase.bind(this);
        this.prepareDelPhr.bind(this);
        this.moreInfo.bind(this);
    }

    componentDidMount(){
        window.electronAPI.getLangById(this.props.langId).then(lang => {
            this.setState({lang: lang[0]});
        });

        window.electronAPI.getWordsAndPhrases(this.props.langId).then(data => {

            if (data) {
                data = data[1].sort((a, b) => a.phrase.localeCompare(b.phrase));
                let phrase = this.createPhrasesHtml(data);
                this.setState({phrases: phrase});
            }
        });
    }

    createPhrasesHtml(arr){
        let phrases = arr.map(phrase => {
            return(
                <tr wrd-id={phrase.id} key={phrase.id}>
                    <td>{phrase.phrase}</td>
                    <td className={phrase.meanings.length > 1 ? 'meaning-expand': ''}>{phrase.meanings.map( (mn, i) => 
                        <div className={i == 0 ? '': 'd-none' } key={phrase.id + i}>
                            {mn} { i==0 && phrase.meanings.length > 1 ? <p>...</p>: ''}
                        </div>
                    )}</td>
                    <td>{phrase.gramGender ?? 'none'}</td>
                    <td>
                        <PrimaryButton onClick={(e) => this.moreInfo(e)} style='table-buttons' elemId={phrase.id + '=more'}>More</PrimaryButton>
                        <button phr={phrase.phrase} mean={phrase.meanings[0]} gram={phrase.gramGender ?? 'none'} onClick={(e) => this.prepareDelPhr(e)} id={phrase.id + '=del'} className='purple-button sec-button hover-danger table-buttons' data-bs-toggle="modal" data-bs-target="#delete-phrase-modal">
                            Delete
                        </button>
                    </td>
                </tr>
            );
            
        });

        return phrases;
    }

    orderChangeSelect(e){

        let arr = this.state.phrases;
        arr = arr.reverse();

        this.setState({phrases: arr});
    }

    genderChangeSelect(e){
        const val = e.target.value;
        this.setState({values: {genderValue: val}});

        if (val == 'all') {
            $('tbody').children('tr').removeClass('d-none');
        } else {
            const children = $('tbody').children('tr');

            for (let i = 0; i < children.length; i++) {
                const child = children.get(i);
                const gend = child.childNodes[2].childNodes[0];

                if (gend.textContent == val) {
                    child.classList.remove('d-none');
                }else{
                    child.classList.add('d-none');
                }
            }
        }
    }

    async addNewPhrase(){
        const phraseName = document.querySelector('#phrase-input').value.trim();
        const phraseMeaning = document.querySelector('#meaning-input').value.trim();

        $('#meaning-input').css('box-shadow', '');
        $('#phrase-input').css('box-shadow', '');

        if (phraseName == '' || phraseMeaning == '') {

            if (phraseName == '') {
                $('#phrase-input').css('box-shadow', '0 0 0 5px #ff0000a0');
            }

            if(phraseMeaning == ''){
                $('#meaning-input').css('box-shadow', '0 0 0 5px #ff0000a0');
            }

            return;
        }

        const phrase = {
            langId: this.props.langId,
            phrase: phraseName,
            meaning: phraseMeaning,
            gender: document.querySelector('#form-gram-gender').value
        }

        document.querySelector('#phrase-input').value = '';
        document.querySelector('#meaning-input').value = '';
        document.querySelector('#form-gram-gender').value = 'none';

        let newPhrase = await window.electronAPI.addNewPhrase(phrase);
        newPhrase = this.createPhrasesHtml([newPhrase]);

        const newState = [...this.state.phrases, ...newPhrase];
        this.setState({phrases: newState});

        $('#close-btn').click();
    }

    prepareDelPhr(e){
        const elem = $(e.target);

        const phrase = elem.attr('phr');
        const mean = elem.attr('mean');
        const gender = elem.attr('gram');
        
        $('#phr-mod').html('Phrase: ' + phrase);
        $('#phr-mean-mod').html('Meaning: ' + mean);
        $('#phr-gend-mod').html('Gramatical Gender: ' + gender);
        $('#del-phr').attr('phr-id', e.target.id.split('=')[0]);
    }

    deletePhrase(e){
        const id = $(e.target).attr('phr-id');
        window.electronAPI.deletePhrase(id);

        //$(`tr[wrd-id="${id}"]`).remove();
        this.componentDidMount();
    }

    deleteLanguage(){

        const langName = document.querySelector('#lang-del-confirm').value.trim();
        
        if (langName == this.state.lang.langName) {
            window.electronAPI.deleteLang(this.state.lang.id);
            $('#close-del-lang-modal').click();
            $('#go-back-btn').click();
        }
        else{
            $('#lang-del-confirm').css('box-shadow', '0 0 0 5px #ff0000a0');
        }
    }

    searchPhrases(e){

        let val = e.target.value.trim().toLowerCase();
        
        if (val == '') {
            $('tr').removeClass('d-none-search');
        }
        else{
            
            const trList = $('tbody').children('tr');
            for (let i = 0; i < trList.length; i++) {
                const tr = trList[i];
                let text = tr.childNodes[0].childNodes[0].wholeText.toLowerCase();

                trList[i].classList.add('d-none-search');

                if (text.includes(val)) {
                    trList[i].classList.remove('d-none-search');
                }

                const listMeanings = tr.childNodes[1].childNodes;

                for (let е = 0; е < listMeanings.length; е++) {
                    text = listMeanings[е].childNodes[0].wholeText.toLowerCase();
                    
                    if (text.includes(val)) {
                        trList[i].classList.remove('d-none-search');
                    }
                }
            }

        }
    }

    moreInfo(e){
        const id = e.target.id.split('=')[0];
        this.props.selectElement(id, GlobalViewNames.langPhrase);
    }

    render(){

        const newPhraseFooter = (
            <>
                <PrimaryButton onClick={(e) => this.addNewPhrase(e)}>Add Phrase</PrimaryButton>
                <SecondaryButton elemId='close-btn' dissmiss='modal'>Close</SecondaryButton>
            </>
        );

        const deletLangFooter = (
            <>
                <SecondaryButton dissmiss='modal' onClick={() => this.deleteLanguage()} style='danger-btn'>Delete Language</SecondaryButton>
                <SecondaryButton elemId='close-del-lang-modal' dissmiss='modal'>Cancel</SecondaryButton>
            </>
        );

        const deletePhraseFooter = (
            <>
                <SecondaryButton elemId='del-phr' onClick={(e)=> this.deletePhrase(e)} dissmiss='modal' style='danger-btn'>Delete</SecondaryButton>
                <SecondaryButton dissmiss='modal'>Cancel</SecondaryButton>
            </>
        );

        return(
            <main className='lang-phrases-view'>

                <Modal elemId='new-phrase-modal' title='Add New Phrase' footer={newPhraseFooter}>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="phrase-input" className="col-form-label">Phrase:</label>
                            <input type="text" className="form-control" id="phrase-input"/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="meaning-input" className="col-form-label">Meaning:</label>
                            <input type="text" className="form-control" id="meaning-input"/>
                        </div>
                        <div className="mb-3">
                            <label>Gramatical Gender:</label>
                            <select id='form-gram-gender' className="form-select modal-opt" aria-label="Gender select">
                                <option defaultValue value="none">None</option>
                                <option value="masculine">masculine</option>
                                <option value="feminine">feminine</option>
                                <option value="neuter">neuter</option>
                                <option value="animate">animate</option>
                                <option value="inanimate">inanimate</option>
                                <option value="common">common</option>
                            </select>
                        </div>
                    </form>
                </Modal>

                <Modal elemId='delete-lang-modal' title={'delete ' + this.state.lang.langName} footer={deletLangFooter}>
                    <p>Once you delete this language there is no going back.</p>
                    <p>All words and data are going to be deleted forever.</p>
                    <label>If you are sure type the name of the language to confirm:</label>
                    <input type="text" className="form-control" id="lang-del-confirm"/>
                </Modal>

                <Modal elemId='delete-phrase-modal' title='delete a phrase' footer={deletePhraseFooter}>
                    <p>Do you want to delete this phrase?</p>
                    <p id='phr-mod'></p>
                    <p id='phr-mean-mod'></p>
                    <p id='phr-gend-mod'></p>
                </Modal>

                <section>
                <div className="container">
                    <Row>
                        <h1 className='position-relative'>
                            <SecondaryButton elemId='go-back-btn' onClick={() => {this.props.changeGlobalView(GlobalViewNames.viewController, ViewNames.lang)}} style='go-back-btn'>
                                Go Back
                            </SecondaryButton>
                            {this.state.lang.langName}
                        </h1>

                        <DataControl>
                            <DCSection>
                                <button className='purple-button w-50' data-bs-toggle="modal" data-bs-target="#new-phrase-modal">Add new phrase</button>
                                <button className='purple-button sec-button hover-danger w-50' data-bs-toggle="modal" data-bs-target="#delete-lang-modal">Delete language</button>
                            </DCSection>
                        </DataControl>

                        <DataControl>
                            <DCSection>
                                <span>
                                    <label>Search words or meanings:</label>
                                    <input onChange={(e) => this.searchPhrases(e)} className='form-control text-input' type='text'></input>
                                </span>
                                <span>
                                    <label>Phrase Order:</label>
                                    <select value={this.state.values.orderValue} onChange={(e) => this.orderChangeSelect(e)} className="form-select" aria-label="order select">
                                        <option value="1">A-Z</option>
                                        <option value="2">Z-A</option>
                                    </select>
                                </span>
                                <span>
                                    <label>Gramatical Gender:</label>
                                    <select value={this.state.values.genderValue} onChange={(e) => this.genderChangeSelect(e)} className="form-select" aria-label="Gender select">
                                        <option value="all">All</option>
                                        <option value="none">None</option>
                                        <option value="masculine">masculine</option>
                                        <option value="feminine">feminine</option>
                                        <option value="neuter">neuter</option>
                                        <option value="animate">animate</option>
                                        <option value="inanimate">inanimate</option>
                                        <option value="common">common</option>
                                    </select>
                                </span>
                            </DCSection>
                        </DataControl>
                    </Row>

                    <Row>
                        <Table overStyle='global-table' head={this.tableHead} data={this.state.phrases}/>
                    </Row>
                </div>
                </section>
                
            </main>
        );
    }

}

export default PhrasesLangGlobalView;