import React from 'react';
import $ from 'jquery';
import { DataControl, DCSection } from '../components/dataControlPanel';
import Row from '../components/row';
import PrimaryButton, { SecondaryButton } from '../components/buttons';
import {Table} from '../components/table';

import '../styles/globalView/globalViews.css';
import { Modal } from '../components/modal';
import { GlobalViewNames, ViewNames } from '../constants';

class WordsLangGlobalView extends React.Component{

    constructor(props){

        super(props);

        this.state = {
            lang: '',
            words: <tr></tr>,
            groups: '',
            values: {
                genderValue: 'all',
                orderValue: 'none'
            }
        };

        this.tableHead = ['Article', 'Word', 'Meaning', 'Gramatical Gender', 'More'];

        this.genderChangeSelect.bind(this);
        this.createWordsHtml.bind(this);
        this.addNewWord.bind(this);
        this.deleteLanguage.bind(this);
    }

    componentDidMount(){
        window.electronAPI.getLangById(this.props.langId).then(lang => {
            this.setState({lang: lang[0]});
        });

        window.electronAPI.getWordsAndPhrases(this.props.langId).then(data => {

            if (data) {
                let words = this.createWordsHtml(data[0]);
                this.setState({words: words});
            }
        });
    }

    createWordsHtml(arr){
        let words = arr.map(word => {
            return(
                <tr key={word.id}>
                    <td>{word.article}</td>
                    <td>{word.word}</td>
                    <td className={word.meanings.length > 1 ? 'meaning-expand': ''}>{word.meanings.map( (mn, i) => 
                        <div className={i == 0 ? '': 'd-none' } key={word.id + i}>
                            {mn} { i==0 && word.meanings.length > 1 ? <p>...</p>: ''}
                        </div>
                    )}</td>
                    <td>{word.gramGender ?? 'none'}</td>
                    <td></td>
                </tr>
            );
            
        });

        return words;
    }

    orderChangeSelect(e){
        this.setState({values: {orderValue: e.target.value}});
    }

    genderChangeSelect(e){
        this.setState({values: {genderValue: e.target.value}});
    }

    async addNewWord(){
        const wordName = document.querySelector('#word-input').value.trim();
        const wordMeaning = document.querySelector('#meaning-input').value.trim();

        $('#meaning-input').css('box-shadow', '');
        $('#word-input').css('box-shadow', '');

        if (wordName == '' || wordMeaning == '') {

            if (wordName == '') {
                $('#word-input').css('box-shadow', '0 0 0 5px #ff0000a0');
            }

            if(wordMeaning == ''){
                $('#meaning-input').css('box-shadow', '0 0 0 5px #ff0000a0');
            }

            return;
        }

        const word = {
            langId: this.props.langId,
            word: wordName,
            meaning: wordMeaning,
            article: document.querySelector('#article-input').value.trim(),
            gender: document.querySelector('#form-gram-gender').value
        }

        document.querySelector('#word-input').value = '';
        document.querySelector('#meaning-input').value = '';
        document.querySelector('#article-input').value = '';
        document.querySelector('#form-gram-gender').value = 'none';

        let newWord = await window.electronAPI.addNewWord(word);
        newWord = this.createWordsHtml([newWord]);

        const newState = [...this.state.words, ...newWord];
        this.setState({words: newState});

        $('#close-btn').click();
    }

    deleteLanguage(){

        const langName = document.querySelector('#lang-del-confirm').value.trim();

        console.log(langName);
        console.log(this.state.lang.langName);
        
        if (langName == this.state.lang.langName) {
            window.electronAPI.deleteLang(this.state.lang.id);
            $('#close-del-lang-modal').click();
            $('#go-back-btn').click();
        }
        else{
            $('#lang-del-confirm').css('box-shadow', '0 0 0 5px #ff0000a0');
        }
    }

    render(){

        const newWordFooter = (
            <>
                <PrimaryButton onClick={(e) => this.addNewWord(e)}>Add Word</PrimaryButton>
                <SecondaryButton elemId='close-btn' dissmiss='modal'>Close</SecondaryButton>
            </>
        );

        const deletLangFooter = (
            <>
                <SecondaryButton onClick={() => this.deleteLanguage()} style='danger-btn'>Delete Language</SecondaryButton>
                <SecondaryButton elemId='close-del-lang-modal' dissmiss='modal'>Cancel</SecondaryButton>
            </>
        );

        return(
            <main className='lang-words-view'>

                <Modal elemId='new-word-modal' title='Add New Word' footer={newWordFooter}>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="word-input" className="col-form-label">Word:</label>
                            <input type="text" className="form-control" id="word-input"/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="meaning-input" className="col-form-label">Meaning:</label>
                            <input type="text" className="form-control" id="meaning-input"/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="article-input" className="col-form-label">Article (a, an, un ...): <br></br><i>If there is no article leave the field blank</i></label>
                            <input type="text" className="form-control" id="article-input"/>
                        </div>
                        <div className="mb-3">
                            <label>Gramatical Gender:</label>
                            <select id='form-gram-gender' onChange={(e) => this.genderChangeSelect(e)} className="form-select modal-opt" aria-label="Gender select">
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
                                <button className='purple-button w-50' data-bs-toggle="modal" data-bs-target="#new-word-modal">Add new word</button>
                                <button className='purple-button sec-button hover-danger w-50' data-bs-toggle="modal" data-bs-target="#delete-lang-modal">Delete language</button>
                            </DCSection>
                        </DataControl>

                        <DataControl>
                            <DCSection>
                                <span>
                                    <label>Order:</label>
                                    <select value={this.state.values.orderValue} onChange={(e) => this.orderChangeSelect(e)} className="form-select" aria-label="order select">
                                        <option value='none'>None</option>
                                        <option value="1">A-Z</option>
                                        <option value="2">Z-A</option>
                                    </select>
                                </span>
                                <span>
                                    <label>Gramatical Gender:</label>
                                    <select value={this.state.values.genderValue} onChange={(e) => this.genderChangeSelect(e)} className="form-select" aria-label="Gender select">
                                        <option value="all">All</option>
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
                        <Table overStyle='global-table' head={this.tableHead} data={this.state.words}/>
                    </Row>
                </div>
                </section>
                
            </main>
        );
    }

}

export default WordsLangGlobalView;