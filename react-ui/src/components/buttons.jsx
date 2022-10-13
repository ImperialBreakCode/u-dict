import React from 'react';

const PrimaryButton = (props) => {

    const style = `purple-button ${props.style ?? ''}`;

    function Click(e) {
        if (props.onClick) {
            props.onClick(e);
        }
    }

    return(
        <button id={props.elemId} data-bs-dismiss={props.dissmiss} onClick={(e) => Click(e)} className={style}>{props.children}</button>
    );
}

export const SecondaryButton = (props) => {

    const style = `purple-button sec-button ${props.style ?? ''}`;

    function Click(e) {
        if (props.onClick) {
            props.onClick(e);
        }
    }

    return(
        <button id={props.elemId} onClick={(e) => Click(e)} data-bs-dismiss={props.dissmiss} className={style}>{props.children}</button>
    );
}

export default PrimaryButton;