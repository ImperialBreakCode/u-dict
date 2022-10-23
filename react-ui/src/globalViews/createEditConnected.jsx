import React from 'react';
import PrimaryButton, { SecondaryButton } from '../components/buttons';
import { DataControl, DCSection } from '../components/dataControlPanel';
import { GlobalViewNames } from '../constants';



class ConnectedCreateEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            words: [],
            selectedWords: [],
            langValue: '',
            langsOp: [],
            itemComp: []
        };

        this.langChangeSelect.bind(this);
        this.loadItems.bind(this);
    }

    componentDidMount() {
        window.electronAPI.getLangData().then(langs => {

            if (langs.length != 0) {
                const langComps = langs.map(lang => {
                    return(
                        <option key={lang.id} value={lang.id}>{lang.langName}</option>
                    );
                });
    
                this.setState({langValue: langs[0].id});
                this.setState({langsOp: langComps});

                this.loadItems(langs[0].id);
            }

        });
    }

    loadItems(id){
        window.electronAPI.getWordsAndPhrases(id).then(data => {
            if (this.props.type == 'wrd') {
                data = data[0];

                if (data) {
                    data = data.map(item => {
                        return(
                            <div className='item' key={item.id}>
                                Word: <p>{item.word}</p> <br/>
                                Meaning: <p>{item.meanings[0]}</p>
                                <PrimaryButton style='add-btn'>Add</PrimaryButton>
                            </div>
                        );
                    });

                    this.setState({itemComp: data});
                }

            } else {
                data = data[1];

                if (data) {
                    data = data.map(item => {
                        return(
                            <div className='item' key={item.id}>
                                Phrase: <p>{item.phrase}</p> <br/>
                                Meaning: <p>{item.meanings}</p>
                                <PrimaryButton style='add-btn'>Add</PrimaryButton>
                            </div>
                        );
                    });

                    this.setState({itemComp: data});
                }
            }
        });
    }

    langChangeSelect(e){
        this.setState({langValue: e.target.value});
        this.loadItems(e.target.value);
    }

    render() {

        return (
            <main className='connected-create-edit'>
                <h1>Create connected {this.props.type == 'wrd'? <>word</>: <>phrase</>}</h1>

                <div className="container">

                    <div className="row mb-4">
                        <div className="col-12">
                            <label className='mb-2'>Item Title:</label>
                            <input placeholder='Write the name / common meaning of the connected item here...' className='form-control text-input' type='text'></input>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <DataControl>
                                <h4>Add and remove {this.props.type == 'wrd'? <>words</>: <>phrases</>}</h4>

                                <div className="container">
                                    <div className="row">

                                        <div className="col-6">
                                            <h5>Search for {this.props.type == 'wrd'? <>words</>: <>phrases</>}</h5>
                                            <label>Language:</label><br/>
                                            <select value={this.state.langValue} onChange={(e) => this.langChangeSelect(e)} className="form-select">
                                                {this.state.langsOp}
                                            </select>

                                            <label className='mt-3 mb-0'>Choose {this.props.type == 'wrd'? <>words</>: <>phrases</>}:</label>
                                            <div className='item-box'>
                                                {this.state.itemComp}
                                            </div>
                                        </div>

                                        <div className="col-6">

                                        </div>

                                    </div>
                                </div>
                            </DataControl>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-6">
                            <SecondaryButton onClick={() => this.props.changeGlobalView(GlobalViewNames.connectedWrdPhr, this.props.type)} style='w-100 ms-0'>Cancel</SecondaryButton>
                        </div>
                        <div className="col-6">
                            <PrimaryButton style='w-100 ms-0'>Save</PrimaryButton>
                        </div>
                    </div>
                </div>

            </main>
        );
    }

}

export default ConnectedCreateEdit;