import $ from 'jquery';
import { useEffect } from "react";
import { useState } from "react";
import PrimaryButton, { SecondaryButton } from "../../../components/buttons";
import { DataControl, DCSection } from "../../../components/dataControlPanel";
import { Table } from "../../../components/table";
import { GlobalViewNames, ViewNames } from "../../../constants";


export const WordMeaningTest = (props) => {

    const [currentView, setCurrentView] = useState(<TestSetUp changeGlobalView={props.changeGlobalView} testData={props.testData} finishSetUp={finishSetUp} />)

    function finishTest(qstDone, qstDoneCorrect) {
        setCurrentView(<Finish qstDone={qstDone} qstDoneCorrect={qstDoneCorrect} changeGlobalView={props.changeGlobalView} />);
    }

    function finishSetUp(data) {
        setCurrentView(<Questions qstCount={props.testData.questionCount} questionsData={data} finishTest={finishTest} />);
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
    const [canContinue, setCanContinue] = useState(true);

    const [groupValue, setGroupValue] = useState('all');

    if (props.testData.articleUsage && props.testData.type == 'wrd') {
        tableHeads = ['Article', 'Word', 'Meaning'];
    }
    else {
        tableHeads = ['Word', 'Meaning'];
    }

    useEffect(() => {

        window.electronAPI.getWordsAndPhrases(props.testData.langId).then(data => {

            if (props.testData.type === 'wrd') {

                if (data[0].length == 0) {
                    setErrorMessage('There are no words in the selected language.');
                    setCanContinue(false);
                }

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

                if (data[1].length == 0) {
                    setErrorMessage('There are no phrases in the selected language.');
                    setCanContinue(false);
                }

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

        if (!canContinue) {
            return;
        }

        const wordMeanDictCopy = wordMeanDict;

        if (wordMeanDictCopy.length <= 0) {

            let keys = $('.data-key');
            const values = $('.data-value');
            let articles = $('.data-article');

            for (let i = 0; i < keys.length; i++) {

                let article = null;

                if (articles.length > 0) {
                    article = articles[i].innerHTML != '' ? articles[i].innerHTML : null;
                }

                wordMeanDictCopy.push({ key: keys[i].innerHTML, value: values[i].innerHTML, article: article });
            }
        }

        for (let i = 0; i < wordMeanDictCopy.length - 1; i++) {

            for (let e = i + 1; e < wordMeanDictCopy.length; e++) {

                const data1 = wordMeanDictCopy[i];
                const data2 = wordMeanDictCopy[e];

                if (data1.key != data2.key && data1.value != data2.value) {
                    props.finishSetUp(wordMeanDictCopy);
                    return;
                }
            }
        }

        setErrorMessage('You should select at least two syntactically diffrent words with diffrent meanings')
    }

    function groupChangeSelect(e) {
        const val = e.target.value;
        setGroupValue(val);
    }

    return (
        <div className="w-75">

            <h2>Choose words</h2>
            <p className='mb-5'>You must choose at least two syntactically diffrent words with diffrent meanings</p>

            <DataControl>
                <DCSection>
                    <span className='w-75'>
                    <label>Search words:</label>
                        <input placeholder="Search..." onChange={(e) => search(e)} className='form-control text-input' type='text'></input>
                    </span>

                    <span className='w-25'>
                        <label>Group Gender:</label>
                        <select value={groupValue} onChange={(e) => groupChangeSelect(e)} className="form-select" aria-label="Group select">
                            <option value="all">All</option>
                            
                        </select>
                    </span>
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
    const [allDataArr, setAllDataArr] = useState(props.questionsData);

    const [displayAnswers, setDisplayAnswers] = useState(null);
    const [displayQuestion, setDisplayQuestion] = useState(null);
    const [flash, setFlash] = useState('');


    useEffect(() => {
        MakeQuestion();
    }, []);

    function MakeQuestion() {

        // checking if the questions set are finite (!=0 ...) and then if the questions done exceeds the limit (qstCount <= ...)  
        if (props.qstCount != 0 && props.qstCount != '') {
            if (props.qstCount <= questionsDone) {
                // change to result view
                props.finishTest(questionsDone, questionsPassed);
            }
        }

        let questArrCopy = questArr;

        // checks if there is unused questions left in the array; if there are no questions left, then fill up the array again
        if (questArr.length == 0) {
            setQuestArr([...allDataArr]);
            questArrCopy = allDataArr;
        }

        // shuffling and getting the question and the true answer and removing them from the array (because the are used)
        questArrCopy = shuffle(questArrCopy);
        const questionData = questArrCopy.splice(0, 1)[0];
        let possibleAnswers = [questionData];

        // updateting the array
        setQuestArr(questArrCopy);

        // shuffling all the answers
        const allAnswers = shuffle(allDataArr);
        setAllDataArr(allAnswers);

        // filling the other posiible answers taken from allData array
        for (let i = 0; i < allAnswers.length; i++) {
            const answerData = allAnswers[i];

            if (answerData.key != questionData.key && answerData.value != questionData.value) {
                possibleAnswers.push(answerData);
            }

            if (possibleAnswers.length == 4) {
                break;
            }
        }

        possibleAnswers = possibleAnswers.map((answer, ind) => {
            return (
                <div onClick={(e) => checkIfTrue(e)} key={Math.random()} is-true={(ind == 0).toString()} className='answer'>
                    {answer.value}
                </div>
            );
        });

        possibleAnswers = shuffle(possibleAnswers);

        setDisplayAnswers(possibleAnswers);
        setDisplayQuestion(`${questionData.article ?? ''} ${questionData.key}`);
        setQuestionsDone(questionsDone + 1);

    }

    function checkIfTrue(e) {

        if ($('#next-qt').hasClass('d-none')) {
            const selectedAns = e.target;

            if (selectedAns.getAttribute('is-true') == 'true') {

                selectedAns.classList.add('ans-true');
                setQuestionsPassed(questionsPassed + 1);
                setFlash(<b style={{ color: '#00ff00' }}>Corrent Answer!</b>);

            } else {

                selectedAns.classList.add('ans-false');
                $('.answer[is-true=true]').addClass('ans-true');
                setFlash(<b style={{ color: 'red' }}>Wrong Answer!</b>);

            }

            $('#next-qt').removeClass('d-none');
        }
    }

    function nextQuestion() {
        setFlash('');
        MakeQuestion();

        $('#next-qt').addClass('d-none');
    }

    return (
        <div className='w-50'>
            <h1 className='question'>
                #{questionsDone} {props.qstCount != 0 && props.qstCount != '' ? ` of ${props.qstCount} ` : ''}<br />
                The meaning of:<br />
                <span className='qst-data-wrap'>{displayQuestion}</span>
            </h1>
            <div className='answer-wrapper'>
                {displayAnswers}
            </div>

            <p>{flash}</p>

            <DataControl>
                <DCSection>
                    <SecondaryButton onClick={() => props.finishTest(questionsDone, questionsPassed)} style='mt-4 w-50'>Finish the test</SecondaryButton>
                    <PrimaryButton elemId={'next-qt'} onClick={() => nextQuestion()} style='mt-4 w-50 d-none'>Next Question</PrimaryButton>
                </DCSection>
            </DataControl>
        </div>
    );
}

const Finish = (props) => {
    return (
        <div className='w-50'>
            <div className='score-box'>
                <h4>Your Score:</h4>
                <p>{props.qstDoneCorrect}/{props.qstDone}</p>
            </div>
            <PrimaryButton style='w-100' onClick={() => props.changeGlobalView(GlobalViewNames.viewController, ViewNames.exercises)}>Close the test</PrimaryButton>
        </div>
    );
}

// help functions
function shuffle(array) {

    const newArray = [...array];

    for (let i = newArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    return newArray;
}