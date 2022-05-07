const { contextBridge, ipcRenderer } = require('electron')


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

const getGroups = () => {
	const groups = ipcRenderer.invoke('get-grops');
	return groups;
}

contextBridge.exposeInMainWorld('electronAPI', {
	getLangData: getLangTableData,
	addLang: addLang,
	getLangById: getLangById,
	getGroups: getGroups
});