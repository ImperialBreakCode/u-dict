import React, { useState } from 'react';
import WordsLangGlobalView from './globalViews/wordLangTableView';
import ViewController from './ViewController';

function App() {

	const initialViewController = (<ViewController LangSelectLangView={LangSelectLangView}/>);
	const [ view, setView ] = useState(initialViewController);

	function LangSelectLangView(e) {
		const tr = e.target.closest('tr');
		setView(<WordsLangGlobalView langId={tr.getAttribute('lang-id')}/>)
		console.log(tr.getAttribute('lang-id'));
	}

	function ChangeGlobalView(globalView) {
		
	}

	return (
		<>
			{view}
		</>
	);

}

export default App;
