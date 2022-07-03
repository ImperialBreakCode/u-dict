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
            }
        };

        this.tableHead = ['Article', 'Word', 'Meaning', 'Gramatical Gender', 'More'];

        this.genderChangeSelect.bind(this);
        this.createWordsHtml.bind(this);
        this.addNewWord.bind(this);
        this.deleteLanguage.bind(this);
        this.searchWords.bind(this);
        this.deleteWord.bind(this);
        this.prepareDelWrd.bind(this);
    }

    componentDidMount(){
        window.electronAPI.getLangById(this.props.langId).then(lang => {
            this.setState({lang: lang[0]});
        });

        window.electronAPI.getWordsAndPhrases(this.props.langId).then(data => {

            if (data) {
                data = data[0].sort((a, b) => a.word.localeCompare(b.word));
                let words = this.createWordsHtml(data);
                this.setState({words: words});
            }
        });
    }

    createWordsHtml(arr){
        let words = arr.map(word => {
            return(
                <tr wrdId={word.id} key={word.id}>
                    <td>{word.article}</td>
                    <td>{word.word}</td>
                    <td className={word.meanings.length > 1 ? 'meaning-expand': ''}>{word.meanings.map( (mn, i) => 
                        <div className={i == 0 ? '': 'd-none' } key={word.id + i}>
                            {mn} { i==0 && word.meanings.length > 1 ? <p>...</p>: ''}
                        </div>
                    )}</td>
                    <td>{word.gramGender ?? 'none'}</td>
                    <td>
                        <PrimaryButton style='table-buttons' elemId={word.id + '=more'}>More</PrimaryButton>
                        <button wrd={word.word} mean={word.meanings[0]} gram={word.gramGender ?? 'none'} onClick={(e) => this.prepareDelWrd(e)} id={word.id + '=del'} className='purple-button sec-button hover-danger table-buttons' data-bs-toggle="modal" data-bs-target="#delete-word-modal">
                            Delete
                        </button>
                    </td>
                </tr>
            );
            
        });

        return words;
    }

    orderChangeSelect(e){

        let arr = this.state.words;
        arr = arr.reverse();

        this.setState({words: arr});
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
                const gend = child.childNodes[3].childNodes[0];
                if (gend == val) {
                    child.classList.remove('d-none');
                }else{
                    child.classList.add('d-none');
                }
            }
        }
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

    prepareDelWrd(e){
        const elem = $(e.target);

        const word = elem.attr('wrd');
        const mean = elem.attr('mean');
        const gender = elem.attr('gram');
        
        $('#wrd-mod').html('Word: ' + word);
        $('#wrd-mean-mod').html('Meaning: ' + mean);
        $('#wrd-gend-mod').html('Gramatical Gender: ' + gender);
        $('#del-wrd').attr('wrdId', e.target.id.split('=')[0]);
    }

    deleteWord(e){
        const id = $(e.target).attr('wrdId');
        window.electronAPI.deleteWord(id);

        //$(`tr[wrdId="${id}"]`).remove();
        this.componentDidMount();
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

    searchWords(e){

        let val = e.target.value.trim().toLowerCase();
        
        if (val == '') {
            $('tr').removeClass('d-none-search');
        }
        else{
            
            const trList = $('tbody').children('tr');
            for (let i = 0; i < trList.length; i++) {
                const tr = trList[i];
                let text = tr.childNodes[1].childNodes[0].wholeText.toLowerCase();

                trList[i].classList.add('d-none-search');

                if (text.includes(val)) {
                    trList[i].classList.remove('d-none-search');
                }

                const listMeanings = tr.childNodes[2].childNodes;

                for (let е = 0; е < listMeanings.length; е++) {
                    text = listMeanings[е].childNodes[0].wholeText.toLowerCase();
                    
                    if (text.includes(val)) {
                        trList[i].classList.remove('d-none-search');
                    }
                }
            }

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
                <SecondaryButton dissmiss='modal' onClick={() => this.deleteLanguage()} style='danger-btn'>Delete Language</SecondaryButton>
                <SecondaryButton elemId='close-del-lang-modal' dissmiss='modal'>Cancel</SecondaryButton>
            </>
        );

        const deleteWordFooter = (
            <>
                <SecondaryButton elemId='del-wrd' onClick={(e)=> this.deleteWord(e)} dissmiss='modal' style='danger-btn'>Delete</SecondaryButton>
                <SecondaryButton dissmiss='modal'>Cancel</SecondaryButton>
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

                <Modal elemId='delete-word-modal' title='delete a word' footer={deleteWordFooter}>
                    <p>Do you want to delete this word?</p>
                    <p id='wrd-mod'></p>
                    <p id='wrd-mean-mod'></p>
                    <p id='wrd-gend-mod'></p>
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
                                    <label>Search words or meanings:</label>
                                    <input onChange={(e) => this.searchWords(e)} className='form-control text-input' type='text'></input>
                                </span>
                                <span>
                                    <label>Word Order:</label>
                                    <select value={this.state.values.orderValue} onChange={(e) => this.orderChangeSelect(e)} className="form-select" aria-label="order select">
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