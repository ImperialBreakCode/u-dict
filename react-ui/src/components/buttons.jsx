import React from 'react';

const PrimaryButton = (props) => {

    const style = `purple-button ${props.style ?? ''}`;

    return(
        <button id={props.elemId} data-bs-dismiss={props.dissmiss} onClick={(e) => props.onClick(e)} className={style}>{props.children}</button>
    );
}

export const SecondaryButton = (props) => {

    const style = `purple-button sec-button ${props.style ?? ''}`;

    return(
        <button id={props.elemId} onClick={(e) => props.onClick(e)} data-bs-dismiss={props.dissmiss} className={style}>{props.children}</button>
    );
}

export default PrimaryButton;