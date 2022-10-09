import $ from 'jquery';
import { useEffect } from "react";
import { useState } from "react";
import PrimaryButton, { SecondaryButton } from "../../../components/buttons";
import { DataControl, DCSection } from "../../../components/dataControlPanel";
import { Table } from "../../../components/table";
import { GlobalViewNames, ViewNames } from "../../../constants";


export const WordMeaningTest = (props) => {

    const [currentView, setCurrentView] = useState(<TestSetUp changeGlobalView={props.changeGlobalView} testData={props.testData} finishSetUp={finishSetUp} />)

    function finishSetUp(data) {
        setCurrentView(<Questions qstCount={props.testData.questionCount} questionsData={data} />);
    }

    return (
        <main className="test-view">
            {currentView}
        </main>
    );
}


const TestSetUp = (props) => {

    let tableHeads;
    const [tableData, setTableData] = useState(null);
    const [wordMeanDict, setWordMeanDict] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);

    if (props.testData.articleUsage && props.testData.type == 'wrd') {
        tableHeads = ['Article', 'Word', 'Meaning'];
    }
    else {
        tableHeads = ['Word', 'Meaning'];
    }

    useEffect(() => {

        window.electronAPI.getWordsAndPhrases(props.testData.langId).then(data => {

            if (props.testData.type === 'wrd') {
                const reactData = data[0].map(word => {
                    return (
                        <tr onClick={(e) => tableRowClick(e)} key={word.id}>
                            {props.testData.articleUsage ? <td className='data-article'>{word.article}</td> : null}
                            <td className='data-key'>{word.word}</td>
                            <td className='data-value'>{word.meanings[0]}</td>
                        </tr>
                    );
                });

                setTableData(reactData);
            } else {
                const reactData = data[1].map(phrase => {
                    return (
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
        else {

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

        const wordMeanDictCopy = wordMeanDict;

        const row = e.target.closest('tr');
        const jrow = $(row);

        let key = jrow.children('.data-key').html();
        const value = jrow.children('.data-value').html();
        let article = null;

        if (jrow.children('.data-article').html()) {
            article = jrow.children('.data-article').html();
        }

        if (row.classList.contains('selected-for-test')) {

            row.classList.remove('selected-for-test');

            for (let i = 0; i < wordMeanDictCopy.length; i++) {

                if (wordMeanDictCopy[i].key == key) {
                    wordMeanDictCopy.splice(i, 1);
                    break;
                }

            }

        } else {

            row.classList.add('selected-for-test');
            wordMeanDictCopy.push({ key: key, value: value, article: article });
        }

        setErrorMessage(null)
        setWordMeanDict(wordMeanDictCopy);
    }

    function finish() {

        if (wordMeanDict.length <= 0) {

            let keys = $('.data-key');
            const values = $('.data-value');
            let articles = $('.data-article');

            const wordMeanDictCopy = wordMeanDict;

            for (let i = 0; i < keys.length; i++) {

                let article = null;

                if (articles.length > 0) {
                    article = articles[i].innerHTML != '' ? articles[i].innerHTML: null;
                }

                wordMeanDictCopy.push({ key: keys[i].innerHTML, value: values[i].innerHTML, article: article });
            }

            props.finishSetUp(wordMeanDictCopy);
            
            return;
        }

        for (let i = 0; i < wordMeanDict.length - 1; i++) {

            for (let e = i + 1; e < wordMeanDict.length; e++) {

                const data1 = wordMeanDict[i];
                const data2 = wordMeanDict[e];

                if (data1.key != data2.key && data1.value != data2.value) {
                    props.finishSetUp(wordMeanDict);
                    return;
                }
            }
        }

        setErrorMessage('You should select at least two syntactically diffrent words with diffrent meanings')
    }

    return (
        <div className="w-75">

            <h2>Choose words</h2>
            <p>You must choose at least two syntactically diffrent words with diffrent meanings</p>

            <DataControl>
                <DCSection>
                    <input placeholder="Search..." onChange={(e) => search(e)} className='form-control text-input' type='text'></input>
                </DCSection>
            </DataControl>

            <div className="table-wrapper">
                <Table overStyle='global-table' head={tableHeads} data={tableData} />
            </div>

            <p><b style={{ color: 'red' }}>{errorMessage}</b></p>

            <DataControl>
                <DCSection>
                    <SecondaryButton style='w-50' onClick={() => props.changeGlobalView(GlobalViewNames.viewController, ViewNames.exercises)}>Cancel</SecondaryButton>
                    <PrimaryButton style='w-50' onClick={() => finish()}>Start the test</PrimaryButton>
                </DCSection>
            </DataControl>
        </div>
    );
}

const Questions = (props) => {

    const [questionsDone, setQuestionsDone] = useState(0);
    const [questionsPassed, setQuestionsPassed] = useState(0);

    const [questArr, setQuestArr] = useState(props.questionsData);
    const [qstDoneArr, setQstDoneArr] = useState([]);


    useEffect(() => {
        MakeQuestion();
    }, []);

    function MakeQuestion() {
        
        if (props.qstCount != 0 || props.qstCount !='') {
            if (props.qstCount <= questionsDone) {
                // change to result
            }
        }

        setQuestArr(shuffle(questArr));

        let questArrCopy = questArr;
        const questionData = questArrCopy.splice(0, 1)[0];
        const possibleAnswers = [questionData];

        for (let i = 0; i < questArr.length; i++) {
            const answerData = questArrCopy[i];
            
            if (answerData.key != questionData.key && answerData.value != questionData.value) {
                possibleAnswers.push(answerData);
            }

            if (possibleAnswers.length == 5) {
                break;
            }
        }

        // question count update 
    }

    return (
        <div className='w-50'>
            <h1 className='question'>Question 1</h1>
            <div className='answer-wrapper'>
                <div className='answer ans-false'>
                    ssdfsdfsdf
                </div>

                <div className='answer ans-true'>
                    ssdfsdfsdf
                </div>

                <div className='answer'>
                    ssdfsdfsdf
                </div>

                <div className='answer'>
                    ssdfsdfsdf
                </div>
            </div>

            <DataControl>
                <DCSection>
                    <SecondaryButton style='mt-4 w-50'>Stop the test</SecondaryButton>
                    <SecondaryButton style='mt-4 w-50'>Next Question</SecondaryButton>
                </DCSection>
            </DataControl>
        </div>
    );
}

// help functions
function shuffle(array) {
    const newArray = [...array]
    const length = newArray.length

    for (let start = 0; start < length; start++) {
        const randomPosition = Math.floor((newArray.length - start) * Math.random())
        const randomItem = newArray.splice(randomPosition, 1)

        newArray.push(...randomItem)
    }

    return newArray
}