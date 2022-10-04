import { Button } from "bootstrap";
import { DataControl, DCSection } from "../../components/dataControlPanel";


export const PrepareExerciseView = (props) => {
    return (
        <main className="prepare-exerc-view">
            <h1>Test Setup</h1>
            <div className="container d-flex justify-content-center">
                <div className="row">
                    <div className="col">
                        <DataControl>

                            <h5>Select Language</h5>
                            <DCSection>
                                <select className="form-select prep-opt" aria-label="Default select example">
                                    <option selected>Open this select menu</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </DCSection>

                            <h5>Select type</h5>
                            <DCSection>
                                <select className="form-select prep-opt" aria-label="Default select example">
                                    <option selected>Open this select menu</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </DCSection>

                            <h5>Number of questions (for unlimited leave it blank or type 0)</h5>
                            <DCSection>
                                <input type="text" className="form-control nm-questions" id="inputPassword"></input>
                            </DCSection>

                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"></input>
                                <label class="form-check-label" htmlFor="flexCheckDefault">
                                    Use words with articles 
                                </label>
                            </div>  
                        </DataControl>

                    </div>
                </div>
            </div>
        </main>
    );
};