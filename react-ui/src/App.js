import React, { useState } from 'react';
import WordsLangGlobalView from './globalViews/wordLangTableView';
import ViewController from './ViewController';
import {GlobalViewNames} from './constants';
import WordInfo from './globalViews/wordInfo';

function App() {

	const initialViewController = (<ViewController LangSelectLangView={LangSelectLangView}/>);
	const [ view, setView ] = useState(initialViewController);

	function wordSelect(id) {
		setView(<WordInfo wordId={id}/>);
	}

	function LangSelectLangView(e, type) {
		const tr = e.target.closest('tr');

		if (type == 'wrd') {
			setView(<WordsLangGlobalView selectElement={wordSelect} changeGlobalView={ChangeGlobalView} langId={tr.getAttribute('lang-id')}/>);
		}
	}

	function ChangeGlobalView(globalView, subView) {
		switch (globalView) {
			case GlobalViewNames.viewController:
				setView(<ViewController subView={subView} LangSelectLangView={LangSelectLangView}/>);
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
