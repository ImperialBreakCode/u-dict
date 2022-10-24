import React from 'react';
import $ from 'jquery';
import { DataControl, DCSection } from '../components/dataControlPanel';
import Row from '../components/row';
import PrimaryButton, { SecondaryButton } from '../components/buttons';
import {Table} from '../components/table';

import '../styles/globalView/globalViews.css';
import { Modal } from '../components/modal';
import { GlobalViewNames, ViewNames } from '../constants';

class ConnectedWrdPhrTable extends React.Component{

    constructor(props){

        super(props);

        this.state = {
            connectedItem: '',
            tableData: []
        };

        this.tableHead = ['Language', this.props.type === 'wrd'? 'Word': 'Phrase', 'Meaning'];

        this.createTableData.bind(this);
        this.deleteTable.bind(this);
    }

    componentDidMount(){
        window.electronAPI.getItem(this.props.cnId).then(data => {
            this.setState({connectedItem: data});
            this.createTableData(data.children);
        })
    }

    createTableData(arr){
        let data = arr.map(element => {
            return(
                <tr item-id={element.id} key={element.id}>
                    <td>{element.language}</td>
                    <td>{this.props.type === 'wrd'? element.word: element.phrase}</td>
                    <td>{element.meanings[0]}</td>
                </tr>
            );
            
        });

        this.setState({tableData: data});
    }

    deleteTable(){
        window.electronAPI.manageConnectedItems('delete', this.props.type, this.props.cnId);
        this.props.changeGlobalView(GlobalViewNames.connectedWrdPhr, this.props.type);
    }

    render(){

        const deletLangFooter = (
            <>
                <SecondaryButton dissmiss='modal' onClick={() => this.deleteTable()} style='danger-btn'>Delete</SecondaryButton>
                <SecondaryButton elemId='close-del-lang-modal' dissmiss='modal'>Cancel</SecondaryButton>
            </>
        );

        return(
            <main className='connected-table-view'>

                <Modal elemId='delete-connected-modal' title={'delete connected data table: ' + this.state.connectedItem.commonMeaning} footer={deletLangFooter}>
                    Are you sure you want to delete this table?
                </Modal>

                <section>
                <div className="container">
                    <Row>
                        <h1 className='position-relative'>
                            <SecondaryButton elemId='go-back-btn' onClick={() => {this.props.changeGlobalView(GlobalViewNames.connectedWrdPhr, this.props.type)}} style='go-back-btn'>
                                Go Back
                            </SecondaryButton>
                            {this.state.connectedItem.commonMeaning}
                        </h1>

                        <DataControl>
                            <DCSection>
                                <SecondaryButton onClick={() => this.props.changeGlobalView(GlobalViewNames.createEditConnected, [this.props.type, this.state.connectedItem])} style='w-50'>Edit</SecondaryButton>
                                <button className='purple-button sec-button hover-danger w-50' data-bs-toggle="modal" data-bs-target="#delete-connected-modal">Delete the table</button>
                            </DCSection>
                        </DataControl>
                    </Row>

                    <Row>
                        <Table overStyle='global-table' head={this.tableHead} data={this.state.tableData}/>
                    </Row>
                </div>
                </section>
                
            </main>
        );
    }

}

export default ConnectedWrdPhrTable;