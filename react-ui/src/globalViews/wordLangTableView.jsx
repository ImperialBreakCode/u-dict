import React from 'react';
import { DataControl, DCSection } from '../components/dataControlPanel';
import Row from '../components/row';
import PrimaryButton, { SecondaryButton } from '../components/buttons';
import {Table} from '../components/table';

import '../styles/globalView/globalViews.css';

class WordsLangGlobalView extends React.Component{

    constructor(props){

        super(props);

        this.state = {
            lang: '',
            words: '',
            groups: '',
            values: {
                genderValue: 'all',
                orderValue: 'none',
                groupValue: 'all' 
            }
        };

        this.tableHead = ['Word', 'Article', 'Meaning', 'Gramatical Gender', 'Group', 'More'];

        this.genderChangeSelect.bind(this);
    }

    componentDidMount(){
        window.electronAPI.getLangById(this.props.langId).then(lang => {
            this.setState({lang: lang[0]});
        });

        window.electronAPI.getGroups().then(groups => {
            groups = groups.map(item => {
                return (
                    <option key={item.id} value={item.groupName}>{item.groupName}</option>
                );
            });

            this.setState({groups: groups});
        });

    }

    orderChangeSelect(e){
        this.setState({values: {orderValue: e.target.value}});
    }

    genderChangeSelect(e){
        this.setState({values: {genderValue: e.target.value}});
    }

    groupChangeSelect(e){
        this.setState({values: {groupValue: e.target.value}});
    }

    render(){
        return(
            <main className='lang-words-view'>
                <section>
                <div className="container">
                    <Row>
                        <h1>{this.state.lang.langName}</h1>

                        <DataControl>
                            <DCSection>
                                <PrimaryButton style='w-50'>Add Word</PrimaryButton>
                                <SecondaryButton style=' w-50 hover-danger'>Delete Language</SecondaryButton>
                            </DCSection>
                        </DataControl>

                        <DataControl>
                            <DCSection>
                                <span>
                                    <label>Order:</label>
                                    <select value={this.state.values.orderValue} onChange={(e) => this.orderChangeSelect(e)} className="form-select" aria-label="order select">
                                        <option value='none'>None</option>
                                        <option value="1">A-Z</option>
                                        <option value="2">Z-A</option>
                                    </select>
                                </span>
                                <span>
                                    <label>Gramatical Gender:</label>
                                    <select value={this.state.values.genderValue} onChange={(e) => this.genderChangeSelect(e)} className="form-select" aria-label="Gender select">
                                        <option value="all">All</option>
                                        <option value="masculine">masculine</option>
                                        <option value="feminine">feminine</option>
                                        <option value="neuter">neuter</option>
                                        <option value="animate">animate</option>
                                        <option value="inanimate">inanimate</option>
                                        <option value="common">common</option>
                                    </select>
                                </span>
                                <span>
                                    <label>Groups:</label>
                                    <select value={this.state.values.groupValue} onChange={(e) => this.groupChangeSelect(e)} className="form-select" aria-label="Group select">
                                        <option value='all'>All Words</option>
                                        {this.state.groups}
                                    </select>
                                </span>
                            </DCSection>
                        </DataControl>
                    </Row>

                    <Row>
                        <Table head={this.tableHead}/>
                    </Row>
                </div>
                </section>
                
            </main>
        );
    }

}

export default WordsLangGlobalView;