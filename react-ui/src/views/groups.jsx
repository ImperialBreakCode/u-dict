import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import PrimaryButton, { SecondaryButton } from '../components/buttons';
import { ContentBox, ContentRow } from '../components/contentBoxes';
import { Modal } from "../components/modal";
import Row from '../components/row';
import "../styles/view-styles/style.css";


class GroupView extends React.Component{

    constructor(props){
        super(props);
        this.state = { groups: [] };

        this.addButtonClick.bind(this);
    }

    addButtonClick(e){
        // .....
    }

    render(){

        const modalFooter = (
            <>
                <SecondaryButton elemId='close-btn' dissmiss='modal'>Close</SecondaryButton>
                <PrimaryButton onClick={(e)=> {this.addButtonClick(e)}}>Add Group</PrimaryButton>
            </>
        );

        return(
            <div className='group-view'>

                <Modal elemId='add-group-modal' title='new group' footer={modalFooter}>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="group-name" className="col-form-label">Group Name:</label>
                            <input type="text" className="form-control" id="group-name-input"/>
                        </div>
                    </form>
                </Modal>

                <div className="container cont-view">
                    <Row>
                        <div className="title-box">
                            <h1>Groups</h1>
                        </div>
                    </Row>

                    <Row>
                        <ContentBox>
                            <ContentRow>
                                <h5>Group 1</h5>
                                <span className='ms-auto d-flex'>
                                    <PrimaryButton>Edit</PrimaryButton>
                                    <SecondaryButton style='danger-btn'>Delete</SecondaryButton>
                                </span>
                            </ContentRow>
                        </ContentBox>
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