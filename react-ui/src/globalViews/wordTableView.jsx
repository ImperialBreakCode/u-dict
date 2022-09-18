import React from 'react';
import $ from 'jquery';
import { DataControl, DCSection } from '../components/dataControlPanel';
import Row from '../components/row';
import PrimaryButton, { SecondaryButton } from '../components/buttons';
import {Table} from '../components/table';

import '../styles/globalView/globalViews.css';
import { GlobalViewNames, ViewNames } from '../constants';

class WordsGlobalView extends React.Component{

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

        this.tableHead = ['Language', 'Article', 'Word', 'Meaning', 'Gramatical Gender', 'More'];

        this.genderChangeSelect.bind(this);
        this.createWordsHtml.bind(this);
        this.searchWords.bind(this);
        this.moreInfo.bind(this);
    }

    componentDidMount(){

        window.electronAPI.getWordsData().then(data => {

            if (data) {
                data = data.sort((a, b) => a.word.localeCompare(b.word));
                let words = this.createWordsHtml(data);
                this.setState({words: words});
            }
        });
    }

    createWordsHtml(arr){
        let words = arr.map(word => {
            return(
                <tr wrd-id={word.id} key={word.id}>
                    <td>{word.language}</td>
                    <td>{word.article}</td>
                    <td>{word.word}</td>
                    <td className={word.meanings.length > 1 ? 'meaning-expand': ''}>{word.meanings.map( (mn, i) => 
                        <div className={i == 0 ? '': 'd-none' } key={word.id + i}>
                            {mn} { i==0 && word.meanings.length > 1 ? <p>...</p>: ''}
                        </div>
                    )}</td>
                    <td>{word.gramGender ?? 'none'}</td>
                    <td>
                        <PrimaryButton onClick={(e) => this.moreInfo(e)} style='table-buttons' elemId={word.id + '=more'}>More</PrimaryButton>
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
                const gend = child.childNodes[4].childNodes[0];

                if (gend.textContent == val) {
                    child.classList.remove('d-none');
                }else{
                    child.classList.add('d-none');
                }
            }
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
                let text = tr.childNodes[2].childNodes[0].wholeText.toLowerCase();

                trList[i].classList.add('d-none-search');

                if (text.includes(val)) {
                    trList[i].classList.remove('d-none-search');
                }

                const listMeanings = tr.childNodes[3].childNodes;

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
        this.props.selectElement(id, GlobalViewNames.words);
    }

    render(){

        return(
            <main className='lang-words-view'>

                <section>
                <div className="container">
                    <Row>
                        <h1 className='position-relative'>
                            <SecondaryButton elemId='go-back-btn' onClick={() => {this.props.changeGlobalView(GlobalViewNames.viewController, ViewNames.words)}} style='go-back-btn'>
                                Go Back
                            </SecondaryButton>
                            List of all words
                        </h1>

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

export default WordsGlobalView;