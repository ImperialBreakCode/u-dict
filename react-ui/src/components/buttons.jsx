import React from 'react';

export class PrimaryButton extends React{

    constructor(props){
        super(props)
    }

    render(){
        return(
            <button className="purple-button">{this.props.children}</button>
        );
    }
}