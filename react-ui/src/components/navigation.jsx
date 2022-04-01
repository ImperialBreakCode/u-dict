import React from 'react';
import NavButton from './navButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faLanguage, faA, faCheck } from '@fortawesome/free-solid-svg-icons';
import { ViewNames } from '../constants';

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

            const path = e.nativeEvent.path;
            for (let i = 0; i < path.length; i++) {
                if (path[i].nodeName == 'BUTTON') {
                    path[i].classList.add(activeNavClass);

                    const view = document.querySelector(`.${activeNavClass}`).dataset.toview;
                    console.log(view);
                }
            }

            this.props.ChangeView();
        }

    }

    render(){
        return(

            <nav className='navigation'>
                <AppTitle/>

                <NavControl>
                    <NavButton onClick={this.handleClickNavButton} active={true} toView={ViewNames.home} text='home'>
                        <FontAwesomeIcon icon={faHouse} />
                    </NavButton>
                    <NavButton onClick={this.handleClickNavButton} active={false} text='languages'>
                        <FontAwesomeIcon icon={faLanguage}/>
                    </NavButton>
                    <NavButton onClick={this.handleClickNavButton} active={false} text='words'>
                        <FontAwesomeIcon icon={faA}/>
                    </NavButton>
                    <NavButton onClick={this.handleClickNavButton} active={false} text='exercises'>
                        <FontAwesomeIcon icon={faCheck}/>
                    </NavButton>
                </NavControl>
            </nav>

        );
    }
}



export default Navigation;