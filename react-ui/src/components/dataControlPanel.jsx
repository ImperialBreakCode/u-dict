import React from "react";

export function DataControl(props) {
    return(
        <div className="data-control-panel">
            {props.children}
        </div>
    );
}

export function DCSection(props) {
    return(
        <div  className='dc-section'>
            {props.children}
        </div>
    );
}

