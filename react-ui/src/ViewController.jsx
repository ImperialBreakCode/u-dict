import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './styles/style.css';
import Navigation from "./components/navigation";
import HomeView from './views/home';
import LangView from './views/languages';
import WordsView from './views/words';
import ExercView from './views/exercise';
import { ViewNames } from './constants';

function ViewController() {

	const [view, setView] = useState(<HomeView />);

	function changeView(toView) {

		switch (toView) {
			case ViewNames.home:
				setView(<HomeView />);
				break;

			case ViewNames.lang:
				setView(<LangView />);
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