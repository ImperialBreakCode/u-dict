const { contextBridge, ipcRenderer } = require('electron');


const getLangTableData = () => {
	const data = ipcRenderer.invoke('get-langs', 10);
	return data;
};

const getWordsData = () => {
	const data = ipcRenderer.invoke('get-words', 10);
	return data;
}

const getPhrasesData = () => {
	const data = ipcRenderer.invoke('get-phrases', 10);
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

const addNewPhrase = (phrase) => {
	const newPhr = ipcRenderer.invoke('add-new-phrase', phrase);
	return newPhr;
}

const deleteLang = (id) => {
	ipcRenderer.send('delete-lang', id);
}

const deleteWord = (id) => {
	ipcRenderer.send('delete-word', id);
}

const deletePhrase = (id) => {
	ipcRenderer.send('delete-phrase', id);
}

const getItem = (id) => {
	const item = ipcRenderer.invoke('get-item', id);
	return item;
}

const updateWord = (wrd, id) => {
	ipcRenderer.send('updateWrd', wrd, id);
}

const updatePhrase = (phr, id) => {
	ipcRenderer.send('updatePhr', phr, id);
}

const updateMeaningWrd = (mn, id) => {
	ipcRenderer.send('update-meanings-wrd', mn, id)
}

const updateMeaningPhr = (mn, id) => {
	ipcRenderer.send('update-meanings-phr', mn, id)
}

const getGroups = () => {
	const groups = ipcRenderer.invoke('get-groups')
	return groups;
}

const addEditGroup = (type, data) => {
	ipcRenderer.send('add-edit-group', type, data)
}

const manageGroupConnections = (action, groupId, targetId) => {
	ipcRenderer.send('manage-group-connections', action, groupId, targetId);
}

const getConnected = (type) => {
	return ipcRenderer.invoke('get-connected', type);
}

const manageConnectedItems = (action, type, data) => {
	ipcRenderer.send('manage-connected-items', action, type, data);
}

contextBridge.exposeInMainWorld('electronAPI', {
	getLangData: getLangTableData,
	getWordsData: getWordsData,
	getPhrasesData: getPhrasesData,
	addLang: addLang,
	getLangById: getLangById,
	getWordsAndPhrases: getWordsAndPhrases,
	addNewWord: addNewWord,
	addNewPhrase: addNewPhrase,
	deleteLang: deleteLang,
	deleteWord: deleteWord,
	deletePhrase: deletePhrase,
	getItem: getItem,
	updateWord: updateWord,
	updatePhrase: updatePhrase,
	updateMeaningWrd: updateMeaningWrd,
	updateMeaningPhr: updateMeaningPhr,
	getGroups: getGroups,
	addEditGroup: addEditGroup,
	manageGroupConnections: manageGroupConnections,
	getConnected: getConnected,
	manageConnectedItems: manageConnectedItems,
});