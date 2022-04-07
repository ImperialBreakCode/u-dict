import React from 'react';
import "../styles/view-styles/style.css";


class HomeView extends React.Component{

    render(){
        return(
            <div className='home-view'>
                <div className="container d-flex align-items-center justify-content-center cont-view">
                    <Row>
                        <h1 className='home-title'>Dashboard</h1>
                    </Row>

                    <div className="row">
                        <div className="col-xl-4">
                            <Card title='languages' data='10' />
                        </div>
                        <div className="col-xl-4">
                            <Card title='words' data='10' />
                        </div>
                        <div className="col-xl-4">
                            <Card title='phrases' data='10' />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

function Card(props) {
    return(
        <div className="card dash-card">
            <div className="card-body">
                <h5 className="card-title">{props.title}</h5>
                <h3 className="mb-2">{props.data}</h3>
            </div>
        </div>
    );
}

function Row(props) {
    return(
        <div className="row">
            <div className='col'>
                {props.children}
            </div>
        </div>
    );
}

export default HomeView;