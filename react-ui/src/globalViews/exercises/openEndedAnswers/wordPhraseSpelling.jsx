import $ from 'jquery';
import { useEffect } from "react";
import { useState } from "react";
import PrimaryButton, { SecondaryButton } from "../../../components/buttons";
import { DataControl, DCSection } from "../../../components/dataControlPanel";
import { Table } from "../../../components/table";
import { GlobalViewNames, ViewNames } from "../../../constants";


export const WordPhraseSpelling = (props) => {

    const [currentView, setCurrentView] = useState(<TestSetUp changeGlobalView={props.changeGlobalView} testData={props.testData} finishSetUp={finishSetUp} />)

    function finishTest(qstDone, qstDoneCorrect) {
        setCurrentView(<Finish qstDone={qstDone} qstDoneCorrect={qstDoneCorrect} changeGlobalView={props.changeGlobalView} />);
    }

    function finishSetUp(data) {
        setCurrentView(<Questions qstCount={props.testData.questionCount} questionsData={data} finishTest={finishTest} articleUsage={props.testData.articleUsage}/>);
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
    const [groupOptions, setGroupOptions] = useState([]);

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

                    const groupIds = word.foreignKeys['Groups'].map(key => {
                        return key.id;
                    });

                    return (
                        <tr className='for-test' data-groups={groupIds} onClick={(e) => tableRowClick(e)} key={word.id}>
                            {props.testData.articleUsage ? <td className='data-article'>{word.article}</td> : null}
                            <td className='data-value'>{word.word}</td>
                            <td className='data-key'>{word.meanings[0]}</td>
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
                        <tr className='for-test' onClick={(e) => tableRowClick(e)} key={phrase.id}>
                            <td className='data-value'>{phrase.phrase}</td>
                            <td className='data-key'>{phrase.meanings[0]}</td>
                        </tr>
                    );
                });

                setTableData(reactData);
            }
        });

        window.electronAPI.getGroups().then(groups => {
            const groupOp = groups.map(group => {
                return (
                    <option key={group.id} value={group.id}>{group.groupName}</option>
                );
            });

            setGroupOptions(groupOp);
        })

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

                if (wordMeanDictCopy[i].key == key && wordMeanDictCopy[i].value == value) {
                    wordMeanDictCopy.splice(i, 1);
                    break;
                }

            }

        } else {

            row.classList.add('selected-for-test');
            wordMeanDictCopy.push({ key: key, value: value, article: article });
        }

        setWordMeanDict(wordMeanDictCopy);
    }

    function finish() {

        if (!canContinue) {
            return;
        }

        const wordMeanDictCopy = wordMeanDict;

        if (wordMeanDictCopy.length <= 0) {

            const rows = $('.for-test');
            let keys = rows.children('.data-key');
            const values = rows.children('.data-value');
            let articles = rows.children('.data-article');

            for (let i = 0; i < keys.length; i++) {

                let article = null;

                if (articles.length > 0) {
                    article = articles[i].innerHTML != '' ? articles[i].innerHTML : null;
                }

                wordMeanDictCopy.push({ key: keys[i].innerHTML, value: values[i].innerHTML, article: article });
            }
        }

        props.finishSetUp(wordMeanDictCopy);
    }

    function groupChangeSelect(e) {

        setWordMeanDict([]);

        const val = e.target.value;
        setGroupValue(val);

        const rows = document.querySelectorAll('tr');

        if (val != 'all') {

            $(rows).removeClass('selected-for-test');
            setWordMeanDict([]);

            for (let i = 1; i < rows.length; i++) {
                let ids = rows[i].getAttribute('data-groups');
                ids = ids.split(',');
                if (ids.includes(val)) {
                    rows[i].classList.remove('d-none');
                    rows[i].classList.add('for-test');
                } else {
                    rows[i].classList.add('d-none');
                    rows[i].classList.remove('for-test');
                }
            }
        } else {
            $(rows).removeClass('d-none');
            $(rows).addClass('for-test');
        }
    }

    return (
        <div className="w-75">

            <h2>Choose {props.testData.type == 'wrd' ? 'words' : 'phrases'}</h2>

            <DataControl>
                <DCSection>
                    <span className={props.testData.type == 'wrd' ? 'w-75' : 'w-100'}>
                        <label>Search:</label>
                        <input placeholder="Search..." onChange={(e) => search(e)} className='form-control text-input' type='text'></input>
                    </span>

                    {props.testData.type == 'wrd' ? (
                        <span className='w-25'>
                            <label>Group:</label>
                            <select value={groupValue} onChange={(e) => groupChangeSelect(e)} className="form-select" aria-label="Group select">
                                <option value="all">All</option>
                                {groupOptions}
                            </select>
                        </span>
                    ) : <></>}

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
            setQuestArr([...props.questionsData]);
            questArrCopy = [...props.questionsData];
        }

        // shuffling and getting the question and the true answer and removing them from the array (because the are used)
        questArrCopy = shuffle(questArrCopy);
        const questionData = questArrCopy.splice(0, 1)[0];
        $('.question').data(questionData);

        if (questionData.article) {
            $('#article-input').removeClass('d-none');
        } else {
            $('#article-input').addClass('d-none');
        }

        // updateting the array
        setQuestArr(questArrCopy);

        setDisplayQuestion(questionData.key);
        setQuestionsDone(questionsDone + 1);

    }

    function checkIfTrue(e) {

        let ans = $('#word-phrase-input').val();
        let artAns = $('#article-input').val();
        ans = ans.replace(/\s+/g,' ').trim();

        if (artAns || artAns == '') {
            artAns = artAns.replace(/\s+/g,' ').trim();
        }

        let correctAns = $('.question').data();

        const isSpellingCorrect = ans === correctAns.value;
        let isArticleCorrect = true;
        
        if ((artAns || artAns == '') && !$('#article-input').hasClass('d-none')) {
            isArticleCorrect = artAns === correctAns.article;
        }
        
        $('#word-phrase-input').css('border-color', '#00ff00');
        $('#article-input').css('border-color', '#00ff00');

        if (isSpellingCorrect && isArticleCorrect) {
            setFlash(<b style={{ color: '#00ff00' }}>Corrent Answer!</b>);
            setQuestionsPassed(questionsPassed + 1);
        }
        else{
            setFlash(
                <b style={{ color: 'red' }}>
                    Wrong Answer!<br/> 
                    {!isArticleCorrect ? <>Correct article: {correctAns.article}<br/></>: ''}
                    {!isSpellingCorrect ? <>Correct word spelling: {correctAns.value}</>: ''}
                </b>
            );

            if (!isArticleCorrect) {
                $('#article-input').css('border-color', '#ff0000');
            }

            if (!isSpellingCorrect) {
                $('#word-phrase-input').css('border-color', '#ff0000');
            }
            
        }

        $('#next-qt').removeClass('d-none');
        $('#confirm-ans').addClass('d-none');
    }

    function nextQuestion() {
        setFlash('');

        $('#word-phrase-input').css('border-color', '');
        $('#article-input').css('border-color', '');

        $('#word-phrase-input').val('');
        $('#article-input').val('');

        MakeQuestion();

        $('#next-qt').addClass('d-none');
        $('#confirm-ans').removeClass('d-none');
    }

    return (
        <div className='w-50'>
            <h1 className='question'>
                #{questionsDone} {props.qstCount != 0 && props.qstCount != '' ? ` of ${props.qstCount} ` : ''}<br />
                Write the word with the meaning of:<br />
                <span className='qst-data-wrap'>{displayQuestion}</span>
            </h1>
            <div className='input-answer-box'>
                {props.articleUsage ? 
                    <input id='article-input' placeholder='article...' className='form-control text-input w-25' type='text'></input>
                    : ''}

                <input id='word-phrase-input' placeholder='word...' className='form-control text-input' type='text'></input>
            </div>

            <p className='mt-3'>{flash}</p>

            <DataControl>
                <DCSection>
                    <SecondaryButton onClick={() => props.finishTest(questionsDone, questionsPassed)} style='mt-4 w-50'>Finish the test</SecondaryButton>
                    <PrimaryButton elemId='confirm-ans' onClick={() => checkIfTrue()} style='mt-4 w-50'>Confirm Answer</PrimaryButton>
                    <PrimaryButton elemId='next-qt' onClick={() => nextQuestion()} style='mt-4 w-50 d-none'>Next Question</PrimaryButton>
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