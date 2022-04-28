import React from 'react';

export const Modal = (props) => {

    return (
        <div className="modal fade" id={props.elemId} tabIndex="-1" aria-labelledby={props.elemId + 'label'} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={props.elemId + 'label'}>{props.title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {props.children}
                    </div>
                    <div className="modal-footer">
                        {props.footer}
                    </div>
                </div>
            </div>
        </div>
    );
}