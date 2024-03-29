import React from 'react';
import NavButton from './navButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faLanguage, faA, faCheck, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { ViewNames } from '../constants';
import icon from '../images/icon.png'

const activeNavClass = 'active-nav';

function AppTitle() {
    return(
        <div className='app-title'>
            <img src={icon}></img>
            <h3>Dict</h3>
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

                    const view = path[i].getAttribute('toview');
                    this.props.changeView(view);
                }
            }
        }

    }

    render(){
        return(

            <nav className='navigation'>
                <AppTitle/>

                <NavControl>
                    <NavButton onClick={(e) => this.handleClickNavButton(e)} active={this.props.currentView == ViewNames.home} toView={ViewNames.home} text='home'>
                        <FontAwesomeIcon icon={faHouse} />
                    </NavButton>
                    <NavButton onClick={(e) => this.handleClickNavButton(e)} active={this.props.currentView == ViewNames.lang} toView={ViewNames.lang} text='languages'>
                        <FontAwesomeIcon icon={faLanguage}/>
                    </NavButton>
                    <NavButton onClick={(e) => this.handleClickNavButton(e)} active={this.props.currentView == ViewNames.words} toView={ViewNames.words} text='words and phrases'>
                        <FontAwesomeIcon icon={faA}/>
                    </NavButton>
                    <NavButton onClick={(e) => this.handleClickNavButton(e)} active={this.props.currentView == ViewNames.groups} toView={ViewNames.groups} text='groups'>
                        <FontAwesomeIcon icon={faLayerGroup}/>
                    </NavButton>
                    <NavButton onClick={(e) => this.handleClickNavButton(e)} active={this.props.currentView == ViewNames.exercises} toView={ViewNames.exercises} text='exercises'>
                        <FontAwesomeIcon icon={faCheck}/>
                    </NavButton>
                </NavControl>
            </nav>

        );
    }
}



export default Navigation;