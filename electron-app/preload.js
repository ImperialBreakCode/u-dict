const { contextBridge, ipcRenderer } = require('electron')


const getLangTableData = async () => {
	const data = await ipcRenderer.invoke('get-langs', 10);
	return data;
};

const addLang = () => {
	ipcRenderer.send('new-lang');
};

contextBridge.exposeInMainWorld('electronAPI', {
	getLangData: () => getLangTableData(),
	addLang: () => addLang()
});