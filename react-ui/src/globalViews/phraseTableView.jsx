import React from 'react';
import $ from 'jquery';
import { DataControl, DCSection } from '../components/dataControlPanel';
import Row from '../components/row';
import PrimaryButton, { SecondaryButton } from '../components/buttons';
import {Table} from '../components/table';

import '../styles/globalView/globalViews.css';
import { Modal } from '../components/modal';
import { GlobalViewNames, ViewNames } from '../constants';

class PhrasesGlobalView extends React.Component{

    constructor(props){

        super(props);

        this.state = {
            phrases: <tr></tr>,
            groups: '',
            values: {
                genderValue: 'all',
            }
        };

        this.tableHead = ['Language', 'Phrase', 'Meaning', 'Gramatical Gender', 'More'];

        this.genderChangeSelect.bind(this);
        this.createPhrasesHtml.bind(this);
        this.searchPhrases.bind(this);
        this.moreInfo.bind(this);
    }

    componentDidMount(){

        window.electronAPI.getPhrasesData().then(data => {

            if (data) {
                data = data.sort((a, b) => a.phrase.localeCompare(b.phrase));
                let phrases = this.createPhrasesHtml(data);
                this.setState({phrases: phrases});
            }
        });
    }

    createPhrasesHtml(arr){
        let phrases = arr.map(phrase => {
            return(
                <tr wrd-id={phrase.id} key={phrase.id}>
                    <td>{phrase.language}</td>
                    <td>{phrase.phrase}</td>
                    <td className={phrase.meanings.length > 1 ? 'meaning-expand': ''}>{phrase.meanings.map( (mn, i) => 
                        <div className={i == 0 ? '': 'd-none' } key={phrase.id + i}>
                            {mn} { i==0 && phrase.meanings.length > 1 ? <p>...</p>: ''}
                        </div>
                    )}</td>
                    <td>{phrase.gramGender ?? 'none'}</td>
                    <td>
                        <PrimaryButton onClick={(e) => this.moreInfo(e)} style='table-buttons' elemId={phrase.id + '=more'}>More</PrimaryButton>
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
                const gend = child.childNodes[3].childNodes[0];

                if (gend.textContent == val) {
                    child.classList.remove('d-none');
                }else{
                    child.classList.add('d-none');
                }
            }
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

    moreInfo(e){
        const id = e.target.id.split('=')[0];
        this.props.selectElement(id, GlobalViewNames.phrases);
    }

    render(){

        return(
            <main className='lang-phrases-view'>

                <section>
                <div className="container">
                    <Row>
                        <h1 className='position-relative'>
                            <SecondaryButton elemId='go-back-btn' onClick={() => {this.props.changeGlobalView(GlobalViewNames.viewController, ViewNames.words)}} style='go-back-btn'>
                                Go Back
                            </SecondaryButton>
                            List of all phrases
                        </h1>

                        <DataControl>
                            <DCSection>
                                <span>
                                    <label>Search phrases or meanings:</label>
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

export default PhrasesGlobalView;