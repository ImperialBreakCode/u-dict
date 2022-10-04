import { useEffect } from 'react';
import { useState } from 'react';
import PrimaryButton, { SecondaryButton } from '../../components/buttons';
import { DataControl, DCSection } from "../../components/dataControlPanel";
import { GlobalViewNames, ViewNames } from '../../constants';


export const PrepareExerciseView = (props) => {

    const [ valType, setValType ] = useState('wrd');
    const [ opLangs, setOpLangs ] = useState(null);
    const [ valLang, setValLang ] = useState(null);

    useEffect(() => {
        window.electronAPI.getLangData().then(langs => {
            const optionsLangs = langs.map((lang, ind) => {
    
                if (ind === 0) {
                    setValLang(lang.id);
                }
    
                return(
                    <option key={lang.id} value={lang.id}>{lang.langName}</option>
                );
            });
    
            setOpLangs(optionsLangs);
        });
    
    }, []);

    const onChangeType = (e) => {
        setValType(e.target.value);
    }

    const onChangeLang = (e) => {
        setValLang(e.target.value);
    }

    const continueToTest = () => {
        const numberQestions = document.querySelector('#input-num-questions').value.trim();
        const articleUsage = document.querySelector('#use-articles').checked;

        const result = {
            questionCount: numberQestions,
            articleUsage: articleUsage,
            langId: valLang,
            type: valType
        };

        console.log(result);
    }

    return (
        <main className="prepare-exerc-view">
            <h1>Test Setup</h1>
            <div className="container d-flex justify-content-center">
                <div className="row">
                    <div className="col">
                        <DataControl>

                            <h5>Select Language</h5>
                            <DCSection>
                                <select value={valLang} onChange={(e) => onChangeLang(e)} className="form-select prep-opt">
                                    {opLangs}
                                </select>
                            </DCSection>

                            <h5>Select type</h5>
                            <DCSection>
                                <select value={valType} onChange={(e) => onChangeType(e)} className="form-select prep-opt">
                                    <option value="wrd">Words</option>
                                    <option value="phr">Phrases</option>
                                </select>
                            </DCSection>

                            <h5>Number of questions (for unlimited leave it blank or type 0)</h5>
                            <DCSection>
                                <input type="text" className="form-control nm-questions" id="input-num-questions"></input>
                            </DCSection>

                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="use-articles"></input>
                                <label className="form-check-label" htmlFor="use-articles">
                                    Use words with articles 
                                </label>
                            </div>

                            <DCSection>
                                <SecondaryButton onClick={(e) => props.changeGlobalView(GlobalViewNames.viewController, ViewNames.exercises)} style='w-50 mt-5 ms-0'>Cancel</SecondaryButton>
                                <PrimaryButton onClick={() => continueToTest()} style='w-50 mt-5 me-0'>Continue</PrimaryButton>
                            </DCSection>
                            
                        </DataControl>

                    </div>
                </div>
            </div>
        </main>
    );
};