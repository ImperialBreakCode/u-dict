import $ from 'jquery';
import { useEffect } from "react";
import { useState } from "react";
import PrimaryButton, { SecondaryButton } from "../../../components/buttons";
import { DataControl, DCSection } from "../../../components/dataControlPanel";
import { Table } from "../../../components/table";
import { GlobalViewNames, ViewNames } from "../../../constants";


export const WordMeaningTest = (props) => {

    //const articleUsage = props.testData.articleUsage;

    function finishSetUp() {
        
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
                        <tr key={word.id}>
                            {props.testData.articleUsage ? <td>{word.article}</td>: null}
                            <td>{word.word}</td>
                            <td>{word.meanings[0]}</td>
                        </tr>
                    );
                });

                setTableData(reactData);
            } else {
                const reactData = data[1].map(phrase => {
                    return(
                        <tr key={phrase.id}>
                            <td>{phrase.phrase}</td>
                            <td>{phrase.meanings[0]}</td>
                        </tr>
                    );
                });

                setTableData(reactData);
            }
        });

    }, [])

    function search(e) {
        let val = e.target.value.trim().toLowerCase();
        
        if (val == '') {
            $('tr').removeClass('d-none-search');
        }
        else{
            
            const trList = $('tbody').children('tr');
            for (let i = 0; i < trList.length; i++) {
                const tr = trList[i];
                let text = tr.childNodes[0].childNodes[0].wholeText.toLowerCase();

                trList[i].classList.add('d-none-search');

                if (text.includes(val)) {
                    trList[i].classList.remove('d-none-search');
                }

                const listMeanings = tr.childNodes[1].childNodes;

                for (let е = 0; е < listMeanings.length; е++) {
                    text = listMeanings[е].childNodes[0].wholeText.toLowerCase();
                    
                    if (text.includes(val)) {
                        trList[i].classList.remove('d-none-search');
                    }
                }
            }

        }
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
                    <PrimaryButton style='w-50'>Start the test</PrimaryButton>
                </DCSection>
            </DataControl>
        </div>
    );       
}