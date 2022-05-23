import React, { useState } from 'react';
import WordsLangGlobalView from './globalViews/wordLangTableView';
import ViewController from './ViewController';
import {GlobalViewNames} from './constants';

function App() {

	const initialViewController = (<ViewController LangSelectLangView={LangSelectLangView}/>);
	const [ view, setView ] = useState(initialViewController);

	function LangSelectLangView(e) {
		const tr = e.target.closest('tr');
		setView(<WordsLangGlobalView changeGlobalView={ChangeGlobalView} langId={tr.getAttribute('lang-id')}/>);
		console.log(tr.getAttribute('lang-id'));
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
