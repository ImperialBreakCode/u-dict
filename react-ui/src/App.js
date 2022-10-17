import React, { useState } from 'react';
import WordsLangGlobalView from './globalViews/wordLangTableView';
import ViewController from './ViewController';
import {GlobalViewNames} from './constants';
import WordInfo from './globalViews/wordInfo';
import WordsGlobalView from './globalViews/wordTableView';
import PhrasesLangGlobalView from './globalViews/phraseLangTableView';
import PhraseInfo from './globalViews/phraseInfo';
import PhrasesGlobalView from './globalViews/phraseTableView';
import { PrepareExerciseView } from './globalViews/exercises/prepExercise';
import { WordPhraseMeaningTest } from './globalViews/exercises/testsClosedAnswers/wordPhraseMeanTest';
import { MeaningWordPhraseTest } from './globalViews/exercises/testsClosedAnswers/meanWordPhraseTest';
import { GramGenderTest } from './globalViews/exercises/testsClosedAnswers/gramGenderTest';
import { WordPhraseSpelling } from './globalViews/exercises/openEndedAnswers/wordPhraseSpelling';

function App() {

	const initialViewController = (<ViewController changeGlobalView={ChangeGlobalView} LangSelectLangView={LangSelectLangView}/>);
	const [ view, setView ] = useState(initialViewController);

	function wordSelect(id, fromView) {
		setView(<WordInfo wordId={id} changeGlobalView={ChangeGlobalView} fromView={fromView}/>);
	}

	function phraseSelect(id, fromView) {
		setView(<PhraseInfo phraseId={id} changeGlobalView={ChangeGlobalView} fromView={fromView}/>);
	}

	function LangSelectLangView(e, type) {
		const tr = e.target.closest('tr');

		if (type == 'wrd') {
			setView(<WordsLangGlobalView selectElement={wordSelect} changeGlobalView={ChangeGlobalView} langId={tr.getAttribute('lang-id')}/>);
		}
		else if(type == 'phr') {
			setView(<PhrasesLangGlobalView selectElement={phraseSelect} changeGlobalView={ChangeGlobalView} langId={tr.getAttribute('lang-id')}></PhrasesLangGlobalView>)
		}
	}

	function SetTestView(view, data) {
		switch (view) {
			case GlobalViewNames.wordPhraseMeaningTest:
				setView(<WordPhraseMeaningTest changeGlobalView={ChangeGlobalView} testData={data}/>)
				break;
	
			case GlobalViewNames.meaningWordPhrase:
				setView(<MeaningWordPhraseTest changeGlobalView={ChangeGlobalView} testData={data}/>)
				break;
				
			case GlobalViewNames.gramGenderTest:
				setView(<GramGenderTest changeGlobalView={ChangeGlobalView} testData={data}/>)
				break;
			
			case GlobalViewNames.wordPhraseSpellingExercise:
				setView(<WordPhraseSpelling changeGlobalView={ChangeGlobalView} testData={data}/>)
				break;

			default:
				break;
		}
	}

	function ChangeGlobalView(globalView, moreInfo) {

		switch (globalView) {
			
			case GlobalViewNames.viewController:
				setView(<ViewController changeGlobalView={ChangeGlobalView} subView={moreInfo} LangSelectLangView={LangSelectLangView}/>);
				break;
			
			case GlobalViewNames.langWord:
				const lanId = moreInfo["Languages"][0].id;
				setView(<WordsLangGlobalView selectElement={wordSelect} changeGlobalView={ChangeGlobalView} langId={lanId}/>)
				break;
			
			case GlobalViewNames.langPhrase:
				const lanId2 = moreInfo["Languages"][0].id;
				setView(<PhrasesLangGlobalView selectElement={phraseSelect} changeGlobalView={ChangeGlobalView} langId={lanId2}/>)
				break;
			
			case GlobalViewNames.words:
				setView(<WordsGlobalView selectElement={wordSelect} changeGlobalView={ChangeGlobalView}></WordsGlobalView>)
				break;
			
			case GlobalViewNames.phrases:
				setView(<PhrasesGlobalView selectElement={phraseSelect} changeGlobalView={ChangeGlobalView}></PhrasesGlobalView>)
				break;

			case GlobalViewNames.prepExercise:
				setView(<PrepareExerciseView changeGlobalView={ChangeGlobalView} forTest={moreInfo} setTest={SetTestView}/>)
				break;
			
			default:
				break;
		}
	}

	return (
		<>
			{view}
		</>
	);

}

export default App;
