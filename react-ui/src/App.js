import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './styles/style.css';
import Navigation from "./components/navigation";
import HomeView from './views/home';
import LangView from './views/languages';
import WordsView from './views/words';
import ExercView from './views/exercise';
import { ViewNames } from './constants';

function App() {

  const [state, setState] = useState(<HomeView/>);

  function changeView(toView) {

    switch (toView) {
      case ViewNames.home:
        setState(<HomeView/>);
        break;

      case ViewNames.lang:
        setState(<LangView/>);
        break;

      case ViewNames.words:
        setState(<WordsView/>);
        break;

      case ViewNames.exercises:
        setState(<ExercView/>);
        break;
    }

  }


  return (
    <>
      <Navigation changeView={changeView}/>
      {state}
    </>
  );

}

export default App;
