import React from 'react';


function NavButton(props) {

    const classNameStr = props.active === true ? 'nav-btn active-nav': 'nav-btn';

    return(
        <div className='button-box-nav'>
            <button onClick={(e) => props.onClick(e)} className={classNameStr}>
                <span>
                    {props.children}
                </span>
            {props.text}</button>
        </div>
    );
}

export default NavButton;