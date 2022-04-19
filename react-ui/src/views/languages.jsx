import React from 'react';
import { Table } from '../components/table';
import Row from '../components/row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import "../styles/view-styles/style.css";

class LangView extends React.Component{

    constructor(props){
        super(props);
        this.headTable = ['languages', 'word count'];
        this.state = { languages: [] };

        this.getLangs.bind(this);
        this.updateLangs.bind(this);
    }

    componentDidMount(){
        this.getLangs(this.updateLangs);
    }

    getLangs = (callback) => {
        let data = [];
    
        window.electronAPI.getLangData().then( (result) => {
            console.log(result);
    
            if (result) {
                data = result.map(lang => 
                    <tr key={lang.LangID}>
                        <td>{lang.language}</td>
                        <td>{lang.wordCount}</td>
                    </tr>    
                );
    
                callback(data);
            }
        });
    };

    updateLangs = (langs) => {
        this.setState({languages: langs});
    };

    render(){

        const addButton = (
            <button onClick={() => {window.electronAPI.addLang(); this.getLangs(this.updateLangs);} } id='add-lang'>
                <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> add language
            </button>
        );

        return(
            <div className="langview">
                <div className="container d-flex align-items-center justify-content-center cont-view">
                    <Row>
                        <h1>Your Languages</h1>
                    </Row>

                    <Row>
                        <Table overStyle='table-override' head={this.headTable} data={this.state.languages}/>
                        {addButton}
                    </Row>
                </div>
            </div>
        );
    }
}

export default LangView;