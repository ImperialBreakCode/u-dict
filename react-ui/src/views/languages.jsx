import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/js/dist/modal';
import "../styles/view-styles/style.css";

import { Table } from '../components/table';
import Row from '../components/row';
import { Modal } from '../components/modal';


class LangView extends React.Component{

    constructor(props){
        super(props);
        this.headTable = ['languages', 'word count'];
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
                    <tr key={lang.id}>
                        <td>{lang.langName}</td>
                        <td>100</td>
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
        let newlang = await window.electronAPI.addLang(); 

        let newlangElement = (
            <tr key={newlang.id}>
                <td>{newlang.langName}</td>
                <td>100</td>
            </tr>  
        );

        let langs = this.state.languages;
        langs.push(newlangElement);

        this.updateLangs(langs);
    }

    render(){

        const addButton = (
            <button data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => this.addButtonClick() } id='add-lang'>
                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> add language
            </button>
        );

        return(
            <div className="langview">

                <Modal/>

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