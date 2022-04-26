import React from 'react';

class PrimaryButton extends React.Component{

    constructor(props){
        super(props);
        this.style = `purple-button ${props.style ?? ''}`;
    }

    render(){
        return(
            <button className={this.style}>{this.props.children}</button>
        );
    }
}

export const SecondaryButton = (props) => {

    const style = `purple-button sec-button ${props.style ?? ''}`;

    return(
        <button data-bs-dismiss={props.dissmiss} className={style}>{props.children}</button>
    );
}

export default PrimaryButton;