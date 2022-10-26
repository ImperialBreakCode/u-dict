import React from 'react';
import "../styles/view-styles/style.css";
import Row from '../components/row';


class HomeView extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            data: ''
        }
    }

    componentDidMount(){
        window.electronAPI.getStats().then(stats => {
            this.setState({data: stats});
        })
    }

    render(){
        return(
            <div className='home-view'>
                <div className="container cont-view">
                    <Row>
                        <div className='title-wrapper'>
                            <h1 className='home-title'>UDict</h1>
                        </div>
                    </Row>

                    <div className="container inner-cont">
                        <div className="row">
                            <h2>Stats</h2>
                        </div>
                        <div className="row">
                            <div className="col-xl-4">
                                <Card title='languages' data={this.state.data.langCount} />
                            </div>
                            <div className="col-xl-4">
                                <Card title='words' data={this.state.data.wordCount} />
                            </div>
                            <div className="col-xl-4">
                                <Card title='phrases' data={this.state.data.phraseCount} />
                            </div>
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

export default HomeView;