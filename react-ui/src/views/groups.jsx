import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import $ from 'jquery';
import PrimaryButton, { SecondaryButton } from '../components/buttons';
import { ContentBox, ContentRow } from '../components/contentBoxes';
import { Modal } from "../components/modal";
import Row from '../components/row';
import "../styles/view-styles/style.css";


class GroupView extends React.Component{

    constructor(props){
        super(props);
        this.state = { 
            groupsComp: []
        };

        this.addButtonClick.bind(this);
        this.loadGroups.bind(this);
        this.prepareEdit.bind(this);
        this.saveEdit.bind(this);
        this.prepareDelete.bind(this);
        this.delete.bind(this);
    }

    componentDidMount(){
        this.loadGroups();
    }

    loadGroups(){

        window.electronAPI.getGroups().then(groups => {

            if (groups.length != 0) {
                const groupsComponents = groups.map(group => {
                    return(
                        <span key={group.id}>
                            <ContentRow>
                                <h5>{group.groupName}</h5>
                                <span group-id={group.id} className='ms-auto d-flex'>
                                    <button onClick={(e) => this.prepareEdit(e)} className='purple-button' data-bs-toggle="modal" data-bs-target='#edit-group-modal'>
                                        Edit
                                    </button>
                                    <button onClick={(e) => this.prepareDelete(e)} className='purple-button sec-button danger-btn' data-bs-toggle="modal" data-bs-target='#delete-group-modal'>
                                        Delete
                                    </button>
                                </span>
                            </ContentRow>
                        </span> 
                    );
                })
    
                this.setState({groupsComp: groupsComponents});
            } else {
                this.setState({groupsComp: <h5 className='text-center mb-0'>No groups</h5>});
            }

            
        });
    }

    addButtonClick(e){

        const name = document.querySelector('#group-name-input').value.trim();

        if (name) {
            window.electronAPI.addEditGroup('add', name);

            document.querySelector('#group-name-input').value = '';
            $('#close-btn').click();
            this.loadGroups();

        } else {
            $('#group-name-input').css('box-shadow', '0 0 0 5px #ff0000a0');
        }
        
    }

    prepareEdit(e){
        const span = e.target.closest('span');
        const name = span.previousElementSibling.innerHTML;
        $('#group-edit-input').val(name);
        $('#data-for-edit').data('group-id', span.getAttribute('group-id'));
    }

    saveEdit(e){

        const name = document.querySelector('#group-edit-input').value.trim();

        if (name) {
            const id = $('#data-for-edit').data('group-id');
            window.electronAPI.addEditGroup('edit', {id: id, name: name});
            $('#cancel-edit').click();

            this.loadGroups();

        } else {
            $('#group-name-input').css('box-shadow', '0 0 0 5px #ff0000a0');
        }
    }

    prepareDelete(e){
        const span = e.target.closest('span');
        $('#data-for-delete').html(`Are you sure you want to delete this group: ${span.previousElementSibling.innerHTML} ?`);
        $('#data-for-delete').data('group-id', span.getAttribute('group-id'));
    }

    delete(e){
        const id = $('#data-for-delete').data('group-id');
        window.electronAPI.addEditGroup('delete', id);
        $('#cancel-delete').click();

        this.loadGroups();
    }

    render(){

        const modalFooter = (
            <>
                <SecondaryButton elemId='close-btn' dissmiss='modal'>Close</SecondaryButton>
                <PrimaryButton onClick={(e)=> {this.addButtonClick(e)}}>Add Group</PrimaryButton>
            </>
        );

        const editModalFooter = (
            <>
                <SecondaryButton elemId='cancel-edit' dissmiss='modal'>Cancel</SecondaryButton>
                <PrimaryButton onClick={(e)=> {this.saveEdit(e)}}>Save</PrimaryButton>
            </>
        );

        const deleteModalFooter = (
            <>
                <SecondaryButton elemId='cancel-delete' dissmiss='modal'>Cancel</SecondaryButton>
                <SecondaryButton style='danger-btn' onClick={(e)=> {this.delete(e)}}>Delete</SecondaryButton>
            </>
        );

        return(
            <div className='group-view'>

                <Modal elemId='add-group-modal' title='new group' footer={modalFooter}>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="group-name-input" className="col-form-label">Group Name:</label>
                            <input type="text" className="form-control" id="group-name-input"/>
                        </div>
                    </form>
                </Modal>

                <Modal elemId='edit-group-modal' title='edit group' footer={editModalFooter}>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="group-edit-input" className="col-form-label">Edit Group Name:</label>
                            <input type="text" className="form-control" id="group-edit-input"/>
                        </div>

                        <div id='data-for-edit' className='d-none'></div>
                    </form>
                </Modal>

                <Modal elemId='delete-group-modal' title='delete group' footer={deleteModalFooter}>
                    <div id='data-for-delete'></div>
                </Modal>

                <div className="container cont-view">
                    <Row>
                        <div className="title-box">
                            <h1>Groups</h1>
                        </div>
                    </Row>

                    <Row>
                        <div className='groups-wrapper'>
                            <ContentBox>
                                {this.state.groupsComp}
                            </ContentBox>
                        </div>
                    </Row>

                    <Row>
                        <button className='add-group' data-bs-toggle="modal" data-bs-target='#add-group-modal'>
                            <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon> 
                            Add Group
                        </button>
                    </Row>
                </div>
            </div>
        );
    }

}

export default GroupView;