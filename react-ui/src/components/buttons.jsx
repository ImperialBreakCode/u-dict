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

export default PrimaryButton;