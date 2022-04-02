import React from 'react';
import { Table } from '../components/table';
import "../styles/view-styles/style.css";


class LangView extends React.Component{

    constructor(props){
        super(props);
        this.headTable = ['languages', 'word count']
        this.data = [{id:'1', lang: 'english', num: 100}, {id:'2', lang: 'french', num: 200}]
    }

    render(){

        const data = this.data.map(lang => 
            <tr key={lang.id}>
                <td>{lang.lang}</td>
                <td>{lang.num}</td>
            </tr>    
        );

        return(
            <div className="langview">
                <div className="container d-flex align-items-center justify-content-center cont-view">
                    <Row>
                        <h1>Your Languages</h1>
                    </Row>

                    <Row>
                        <Table overStyle='table-override' head={this.headTable} data={data}/>
                    </Row>
                </div>
            </div>
        );
    }
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

export default LangView;