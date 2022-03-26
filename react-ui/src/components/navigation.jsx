import React from 'react';
import NavButton from './navButton';

const activeNavClass = 'active-nav';

function AppTitle() {
    return(
        <div className='app-title'>
            <h3>App</h3>
        </div>
    );
}

function NavControl(props) {
    return(
        <div className='nav-control'>
            {props.children}
        </div>
    );    
}

class Navigation extends React.Component{

    constructor(props){
        super(props);
        this.handleClickNavButton.bind(this);
    }

    handleClickNavButton(e){
        if(!e.target.classList.contains(activeNavClass)){
            const elements = document.getElementsByClassName('nav-btn');

            for(let i = 0; i < elements.length; i ++){
                if (elements[i].classList.contains(activeNavClass)) {
                    elements[i].classList.remove(activeNavClass);
                }
            }
            e.target.classList.add(activeNavClass);
        } 

    }

    render(){
        return(

            <nav className='navigation'>
                <AppTitle/>

                <NavControl>
                    <NavButton onClick={this.handleClickNavButton} active={true} text='home'/>
                    <NavButton onClick={this.handleClickNavButton} active={false} text='languages'/>
                    <NavButton onClick={this.handleClickNavButton} active={false} text='exercise'/>
                    <NavButton onClick={this.handleClickNavButton} active={false} text='more..'/>
                </NavControl>
            </nav>

        );
    }
}



export default Navigation;