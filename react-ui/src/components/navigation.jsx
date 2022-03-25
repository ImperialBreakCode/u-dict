import React from 'react';

function AppTitle() {
    return(
        <div className='app-title'>
            <h3>App</h3>
        </div>
    );
}

class Navigation extends React.Component{

    render(){
        return(
            <nav className='navigation'>
                <AppTitle/>
            </nav>
        );
    }
}

export default Navigation;