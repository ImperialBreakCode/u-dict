const { contextBridge, ipcRenderer } = require('electron');


const getLangTableData = () => {
	const data = ipcRenderer.invoke('get-langs', 10);
	return data;
};

const getWordsData = () => {
	const data = ipcRenderer.invoke('get-words', 10);
	return data;
}

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

const deleteLang = (id) => {
	ipcRenderer.send('delete-lang', id);
}

const deleteWord = (id) => {
	ipcRenderer.send('delete-word', id);
}

const getItem = (id) => {
	const item = ipcRenderer.invoke('get-item', id);
	return item;
}

const updateWord = (wrd, id) => {
	ipcRenderer.send('updateWrd', wrd, id)
}

const updateMeaningWrd = (mn, id) => {
	ipcRenderer.send('update-meanings-wrd', mn, id)
}

contextBridge.exposeInMainWorld('electronAPI', {
	getLangData: getLangTableData,
	getWordsData: getWordsData,
	addLang: addLang,
	getLangById: getLangById,
	getWordsAndPhrases: getWordsAndPhrases,
	addNewWord: addNewWord,
	deleteLang: deleteLang,
	deleteWord: deleteWord,
	getItem: getItem,
	updateWord: updateWord,
	updateMeaningWrd: updateMeaningWrd
});