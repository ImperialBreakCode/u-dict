import $ from 'jquery';
import { useEffect } from "react";
import { useState } from "react";
import PrimaryButton, { SecondaryButton } from "../../../components/buttons";
import { DataControl, DCSection } from "../../../components/dataControlPanel";
import { Table } from "../../../components/table";
import { GlobalViewNames, ViewNames } from "../../../constants";


export const WordMeaningTest = (props) => {

    //const articleUsage = props.testData.articleUsage;

    function finishSetUp(data) {
        console.log(data);
    }

    const [ currentView, setCurrentView ] = useState(<TestSetUp changeGlobalView={props.changeGlobalView} testData={props.testData} finishSetUp={finishSetUp}/>)

    return(
        <main className="test-view">
            {currentView}
        </main>
    );
}


const TestSetUp = (props) => {

    let tableHeads;
    const [tableData, setTableData] = useState(null);
    const wordMeanDict = {};

    if (props.testData.articleUsage && props.testData.type == 'wrd') {
        tableHeads = ['Article', 'Word', 'Meaning'];
    }
    else{
        tableHeads = ['Word', 'Meaning'];
    }

    useEffect(() => {

        window.electronAPI.getWordsAndPhrases(props.testData.langId).then(data => {

            if (props.testData.type === 'wrd') {
                const reactData = data[0].map(word => {
                    return(
                        <tr onClick={(e) => tableRowClick(e)} key={word.id}>
                            {props.testData.articleUsage ? <td className='data-article'>{word.article}</td>: null}
                            <td className='data-key'>{word.word}</td>
                            <td className='data-value'>{word.meanings[0]}</td>
                        </tr>
                    );
                });

                setTableData(reactData);
            } else {
                const reactData = data[1].map(phrase => {
                    return(
                        <tr onClick={(e) => tableRowClick(e)} key={phrase.id}>
                            <td className='data-key'>{phrase.phrase}</td>
                            <td className='data-value'>{phrase.meanings[0]}</td>
                        </tr>
                    );
                });

                setTableData(reactData);
            }
        });

    }, [])

    function search(e) {
        let val = e.target.value.trim().toLowerCase();
        let indexTd = 0;

        if (props.testData.articleUsage && props.testData.type == 'wrd') {
            indexTd = 1;
        }

        if (val == '') {
            $('tr').removeClass('d-none-search');
        }
        else{
            
            const trList = $('tbody').children('tr');
            for (let i = 0; i < trList.length; i++) {
                const tr = trList[i];
                let text = tr.childNodes[indexTd].childNodes[0].wholeText.toLowerCase();

                trList[i].classList.add('d-none-search');

                if (text.includes(val)) {
                    trList[i].classList.remove('d-none-search');
                }

                text = tr.childNodes[indexTd + 1].childNodes[0].wholeText.toLowerCase();

                if (text.includes(val)) {
                    trList[i].classList.remove('d-none-search');
                }
            }

        }
    }

    function tableRowClick(e) {

        const row = e.target.closest('tr');
        const jrow = $(row);
        let key = jrow.children('.data-key').html();
        const value = jrow.children('.data-value').html();
        
        if (jrow.children('.data-article').html()) {
            key = `${jrow.children('.data-article').html()} ${key}`;
        }

        if (row.classList.contains('selected-for-test')) {

            row.classList.remove('selected-for-test');
            delete wordMeanDict[key];

        } else {

            row.classList.add('selected-for-test');
            wordMeanDict[key] = value;

        }
        
    }

    function finish() {

        const keys = Object.keys(wordMeanDict);
        const values = Object.values(wordMeanDict);
        const len = Object.keys(wordMeanDict).length;

        console.log(keys);
        
        for (let i = 0; i < len - 1; i++) {

            for (let e = i + 1; e < len; e++) {
                console.log(keys[i] + ' ' + keys[e])
                if (keys[i] != keys[e] && values[i] != values[e]) {
                    console.log('success');
                    props.finishSetUp(wordMeanDict);
                    return;
                }
            }
        }

        console.log('failure');

    }

    return(
        <div className="w-75">

            <h2>Choose words</h2>
            <p>You must choose at least two syntactically diffrent words with diffrent meanings</p>

            <DataControl>
                <DCSection>
                    <input placeholder="Search..." onChange={(e) => search(e)} className='form-control text-input' type='text'></input>
                </DCSection>
            </DataControl>
            
            <div className="table-wrapper">
                <Table overStyle='global-table' head={tableHeads} data={tableData}/>
            </div>

            <DataControl>
                <DCSection>
                    <SecondaryButton style='w-50' onClick={() => props.changeGlobalView(GlobalViewNames.viewController, ViewNames.exercises)}>Cancel</SecondaryButton>
                    <PrimaryButton style='w-50' onClick={() => finish()}>Start the test</PrimaryButton>
                </DCSection>
            </DataControl>
        </div>
    );       
}