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
                            <Card></Card>
                        </div>
                        <div className="col-xl-4">
                            <h4>words</h4>
                        </div>
                        <div className="col-xl-4">
                            <h4>phrases</h4>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

function Card(props) {
    return(
        <div className="card dash-card" style={{width: 19 + 'rem'}}>
            <div className="card-body">
                <h5 className="card-title">Card title</h5>
                <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
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