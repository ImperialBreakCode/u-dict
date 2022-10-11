import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './styles/style.css';
import Navigation from "./components/navigation";
import HomeView from './views/home';
import LangView from './views/languages';
import WordsView from './views/words';
import ExercView from './views/exercise';
import { ViewNames } from './constants';
import GroupView from './views/groups';

function ViewController(props) {

	let initialView = <HomeView/>;
	let viewName = ViewNames.home;

	if (props.subView) {
		switch (props.subView) {
			case ViewNames.lang:
				initialView = <LangView onLangSelect={props.LangSelectLangView}/>
				break;
			case ViewNames.words:
				initialView = <WordsView changeGlobalView={props.changeGlobalView}/>
				break;
			case ViewNames.exercises:
				initialView = <ExercView changeGlobalView={props.changeGlobalView}/>
				break;
			default:
				break;
		}
		
		viewName = props.subView;
	}

	const [view, setView] = useState(initialView);

	function changeView(toView) {

		const langView = (<LangView onLangSelect={props.LangSelectLangView}/>);
		viewName = toView;

		switch (toView) {
			case ViewNames.home:
				setView(<HomeView />);
				break;

			case ViewNames.lang:
				setView(langView);
				break;

			case ViewNames.words:
				setView(<WordsView changeGlobalView={props.changeGlobalView}/>);
				break;

			case ViewNames.groups:
				setView(<GroupView/>);
				break;

			case ViewNames.exercises:
				setView(<ExercView changeGlobalView={props.changeGlobalView}/>);
				break;
		}
	}

	return (
		<>
			<Navigation currentView={viewName} changeView={changeView} />
			<main>
				{view}
			</main>

		</>
	);

}

export default ViewController;