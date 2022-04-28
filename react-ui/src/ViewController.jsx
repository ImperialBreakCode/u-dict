import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './styles/style.css';
import Navigation from "./components/navigation";
import HomeView from './views/home';
import LangView from './views/languages';
import WordsView from './views/words';
import ExercView from './views/exercise';
import { ViewNames } from './constants';

function ViewController(props) {

	const [view, setView] = useState(<HomeView />);

	function changeView(toView) {

		const langView = (<LangView onLangSelect={props.LangSelectLangView}/>);

		switch (toView) {
			case ViewNames.home:
				setView(<HomeView />);
				break;

			case ViewNames.lang:
				setView(langView);
				break;

			case ViewNames.words:
				setView(<WordsView />);
				break;

			case ViewNames.exercises:
				setView(<ExercView />);
				break;
		}
	}


	return (
		<>
			<Navigation changeView={changeView} />
			<main>
				{view}
			</main>

		</>
	);

}

export default ViewController;