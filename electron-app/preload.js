const { contextBridge, ipcRenderer } = require('electron')


const getLangTableData = () => {
	const data = ipcRenderer.invoke('get-langs', 10);
	return data;
};

const addLang = () => {
	const newLang = ipcRenderer.invoke('new-lang');
	return newLang;
};

contextBridge.exposeInMainWorld('electronAPI', {
	getLangData: () => getLangTableData(),
	addLang: () => addLang()
});