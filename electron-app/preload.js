const { contextBridge, ipcRenderer } = require('electron');
const { isExpressionWithTypeArguments } = require('typescript');


const getLangTableData = () => {
	const data = ipcRenderer.invoke('get-langs', 10);
	return data;
};

const addLang = (langName) => {
	const newLang = ipcRenderer.invoke('new-lang', langName);
	return newLang;
};

const getLangById = (id) => {
	const lang = ipcRenderer.invoke('get-lang-by-id', id);
	return lang;
};

const getWordsAndPhrases = (id) => {
	const data = ipcRenderer.invoke('get-words-phrases', id);
	return data;
};

const addNewWord = (word) => {
	const newWrd = ipcRenderer.invoke('add-new-word', word);
	return newWrd;
}

contextBridge.exposeInMainWorld('electronAPI', {
	getLangData: getLangTableData,
	addLang: addLang,
	getLangById: getLangById,
	getWordsAndPhrases: getWordsAndPhrases,
	addNewWord: addNewWord
});