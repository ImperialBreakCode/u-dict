import React from 'react';
import PrimaryButton, { SecondaryButton } from '../components/buttons';
import $ from 'jquery';
import { DataControl } from '../components/dataControlPanel';
import { GlobalViewNames } from '../constants';



class ConnectedCreateEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
            langValue: '',
            langsOp: [],
            itemComp: [],
            selectedItemsComp: []
        };

        this.langChangeSelect.bind(this);
        this.loadItems.bind(this);
        this.search.bind(this);
        this.addItem.bind(this);
        this.removeItem.bind(this);
        this.createConnected.bind(this);
    }

    componentDidMount() {
        window.electronAPI.getLangData().then(langs => {

            if (langs.length != 0) {
                const langComps = langs.map(lang => {
                    return (
                        <option key={lang.id} value={lang.id}>{lang.langName}</option>
                    );
                });

                this.setState({ langValue: langs[0].id });
                this.setState({ langsOp: langComps });

                this.loadItems(langs[0].id);
            }

        });
    }

    loadItems(id) {
        window.electronAPI.getWordsAndPhrases(id).then(data => {
            if (this.props.type == 'wrd') {
                data = data[0];

                if (data) {
                    data = data.map(item => {
                        return (
                            <div item-id={item.id} item-data={item.word} meaning={item.meanings[0]} className='item' key={item.id}>
                                Word: <p>{item.word}</p> <br />
                                Meaning: <p>{item.meanings[0]}</p>
                                <PrimaryButton onClick={(e) => this.addItem(e)} style='add-btn'>Add</PrimaryButton>
                            </div>
                        );
                    });

                    this.setState({ itemComp: data });
                }
            } else {
                data = data[1];

                if (data) {
                    data = data.map(item => {
                        return (
                            <div item-id={item.id} item-data={item.phrase} meaning={item.meanings} className='item' key={item.id}>
                                Phrase: <p>{item.phrase}</p> <br />
                                Meaning: <p>{item.meanings}</p>
                                <PrimaryButton onClick={(e) => this.addItem(e)} style='add-btn'>Add</PrimaryButton>
                            </div>
                        );
                    });

                    this.setState({ itemComp: data });
                }
            }
        });
    }

    addItem(e) {
        const div = e.target.closest('div');
        const id = div.getAttribute('item-id');
        const data = div.getAttribute('item-data');
        const meaning = div.getAttribute('meaning');

        const newArr = [...this.state.selectedItems];

        if (!newArr.includes(id)) {
            newArr.push(id);
            this.setState({ selectedItems: newArr });

            const addedItem = (
                <div item-id={id} className='item' key={id}>
                    Word: <p>{data}</p> <br />
                    Meaning: <p>{meaning}</p>
                    <SecondaryButton onClick={(e) => this.removeItem(e)} style='remove-btn hover-danger'>Remove</SecondaryButton>
                </div>
            );

            const newArrComp = [...this.state.selectedItemsComp];
            newArrComp.push(addedItem);
            this.setState({ selectedItemsComp: newArrComp });
        }
    }

    removeItem(e) {
        const id = e.target.closest('div').getAttribute('item-id');

        const itemsSelectedCompCopy = [...this.state.selectedItemsComp];
        const selectedItemsCopy = [...this.state.selectedItems];

        for (let i = 0; i < itemsSelectedCompCopy.length; i++) {
            if (itemsSelectedCompCopy[i].key == id) {
                itemsSelectedCompCopy.splice(i, 1);
                break;
            }
        }
        this.setState({ selectedItemsComp: itemsSelectedCompCopy });

        for (let i = 0; i < selectedItemsCopy.length; i++) {
            if (selectedItemsCopy[i] == id) {
                selectedItemsCopy.splice(i, 1);
                break;
            }
        }
        this.setState({ selectedItems: selectedItemsCopy });
    }

    search(e) {
        let val = e.target.value.trim().toLowerCase();

        if (val == '') {
            $('.item').removeClass('d-none');
        }
        else {
            $('.item').addClass('d-none');
            const items = $('.item');

            for (let i = 0; i < items.length; i++) {

                const item = items[i];
                const data = item.getAttribute('item-data').toLowerCase();
                const meaning = item.getAttribute('meaning').toLowerCase();

                if (data.includes(val) || meaning.includes(val)) {
                    item.classList.remove('d-none');
                }
            }

        }
    }

    createConnected(){
        const val = $('#cn-name').val().trim();

        if (val != '') {
            window.electronAPI.manageConnectedItems('create', this.props.type, [val, this.state.selectedItems]);
            this.props.changeGlobalView(GlobalViewNames.connectedWrdPhr, this.props.type);
        }
        
    }

    langChangeSelect(e) {
        this.setState({ langValue: e.target.value });
        this.loadItems(e.target.value);
    }

    render() {

        return (
            <main className='connected-create-edit'>
                <h1>Create connected {this.props.type == 'wrd' ? <>word</> : <>phrase</>}</h1>

                <div className="container">

                    <div className="row mb-3">
                        <div className="col-12">
                            <label className='mb-2'>Item Title:</label>
                            <input id='cn-name' placeholder='Write the name / common meaning of the connected item here...' className='form-control text-input' type='text'></input>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <DataControl>
                                <h4 className='mb-3'>Add and remove {this.props.type == 'wrd' ? <>words</> : <>phrases</>}</h4>

                                <div className="container">
                                    <div className="row">

                                        <div className="col-6">
                                            <h5>Search for {this.props.type == 'wrd' ? <>words</> : <>phrases</>}</h5>
                                            <label>Language:</label><br />
                                            <select value={this.state.langValue} onChange={(e) => this.langChangeSelect(e)} className="form-select">
                                                {this.state.langsOp}
                                            </select>

                                            <label className='mt-3 mb-0'>Choose {this.props.type == 'wrd' ? <>words</> : <>phrases</>}:</label>
                                            <div className='item-box'>
                                                {this.state.itemComp}
                                            </div>
                                            <input placeholder='search...' onChange={(e) => this.search(e)} className='form-control text-input mt-3' type='text'></input>
                                        </div>

                                        <div className="col-6">
                                            <h5>Selected {this.props.type == 'wrd' ? <>words</> : <>phrases</>}</h5>
                                            <div className='item-box'>
                                                {this.state.selectedItemsComp}
                                            </div>
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
                            <PrimaryButton onClick={() => this.createConnected()} style='w-100 ms-0'>Save</PrimaryButton>
                        </div>
                    </div>
                </div>

            </main>
        );
    }

}

export default ConnectedCreateEdit;