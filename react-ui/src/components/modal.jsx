import React from 'react';
import PrimaryButton, { SecondaryButton } from './buttons';

export const Modal = (props) => {

    return (
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{props.title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {props.children}
                    </div>
                    <div className="modal-footer">
                        <SecondaryButton dissmiss='modal'>Close</SecondaryButton>
                        <PrimaryButton>Add Language</PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
    );
}