import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './styles/style.css';
import Navigation from "./components/navigation";
import HomeView from './views/home';

function App() {

  const [state, setState] = useState(0);

  function changeView(toView){
    console.log(toView);
  }

  return (
    <>
      <Navigation changeView={changeView}/>
      <HomeView></HomeView>
    </>
  );

}

export default App;
