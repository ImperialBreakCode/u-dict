import React from 'react';
import $ from 'jquery';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/js/dist/modal';
import "../styles/view-styles/style.css";

import { Table } from '../components/table';
import Row from '../components/row';
import { Modal } from '../components/modal';
import PrimaryButton, { SecondaryButton } from '../components/buttons';


class LangView extends React.Component{

    constructor(props){
        super(props);
        this.headTable = ['languages', 'word and phrase count', ''];
        this.state = { languages: [] };

        this.getLangs.bind(this);
        this.updateLangs.bind(this);
        this.addButtonClick.bind(this);
    }

    componentDidMount(){
        this.getLangs(this.updateLangs);
    }

    getLangs = (callback) => {
    
        window.electronAPI.getLangData().then( (result) => {
            if (result) {

                let data = result.map(lang => 
                    <tr key={lang.id} lang-id={lang.id}>
                        <td>{lang.langName}</td>
                        <td>{lang.lenWords + lang.lenPhrases}</td>
                        <td>
                            <SecondaryButton onClick={(e) => this.props.onLangSelect(e, 'wrd')} style='langv-table-button'>Words</SecondaryButton>
                            <SecondaryButton onClick={(e) => this.props.onLangSelect(e, 'phr')} style='langv-table-button'>Phrases</SecondaryButton>
                        </td>
                    </tr>    
                );

                callback(data);
            }
        });
    };

    updateLangs = (langs) => {        
        this.setState({languages: langs});
    };

    async addButtonClick(){

        let newlang = [];

        const langNameInput = document.querySelector('#lang-name-input');
        const name = langNameInput.value.trim();
        if (name) {
            $('#close-btn').click();
            $('#lang-name-input').css('box-shadow', '');

            newlang = await window.electronAPI.addLang(name); 

            let newlangElement = (
                <tr key={newlang.id} lang-id={newlang.id}>
                    <td>{newlang.langName}</td>
                    <td>0</td>
                    <td>
                        <SecondaryButton onClick={(e) => this.props.onLangSelect(e, 'wrd')} style='langv-table-button'>Words</SecondaryButton>
                        <SecondaryButton onClick={(e) => this.props.onLangSelect(e, 'phr')} style='langv-table-button'>Phrases</SecondaryButton>
                    </td>
                </tr>  
            );
    
            let langs = this.state.languages;
            langs.push(newlangElement);
    
            this.updateLangs(langs);
        }
        else{
            $('#lang-name-input').css('box-shadow', '0 0 0 5px #ff0000a0');
        }
        
        langNameInput.value = '';  
    }

    render(){

        const modalId = 'add-lang-modal';

        const addButton = (
            <button data-bs-toggle="modal" data-bs-target={'#' + modalId} id='add-lang'>
                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> add language
            </button>
        );

        const modalFooter = (
            <>
                <SecondaryButton elemId='close-btn' dissmiss='modal'>Close</SecondaryButton>
                <PrimaryButton onClick={(e) => this.addButtonClick(e)}>Add Language</PrimaryButton>
            </>
        );

        return(
            <div className="langview">

                <Modal elemId={modalId} title='new language' footer={modalFooter}>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="lang-name" className="col-form-label">Language Name:</label>
                            <input type="text" className="form-control" id="lang-name-input"/>
                        </div>
                    </form>
                </Modal>

                <div className="container d-flex align-items-center justify-content-center cont-view">
                    <Row>
                        <h1>Your Languages</h1>
                    </Row>

                    <Row>
                        <div className='position-relatie table-wrapper'>
                            <Table overStyle='table-override' head={this.headTable} data={this.state.languages}/>
                        </div>
                        {addButton}
                    </Row>
                </div>
            </div>
        );
    }
}

export default LangView;