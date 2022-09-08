// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path');

const { appDatabase } = require('./database/js/database.js');
const { Language, Word } = require('./database/js/models');
const { tableNames } = require('./database/js/tableNames.js');

const db = new appDatabase(`${__dirname}/database/storage`);

// create main window
const createWindow = () => {

	const mainWindow = new BrowserWindow({
		width: 1250,
		minWidth: 900,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			//nodeIntegration: true
		}
	})

	mainWindow.loadURL('http://localhost:3000')
	//mainWindow.loadFile('views/index.html')

	mainWindow.webContents.openDevTools()
	mainWindow.removeMenu()
}


// startup
app.whenReady().then(() => {
	createWindow()

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

// events
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit()
})


// renderer communication
ipcMain.handle('get-langs', () => {
	let langs = db.Languages;
	langs.forEach(lang => {
		const lenWords = db.getChildren(lang, lang.relWords).length;
		const lenPhrases = db.getChildren(lang, lang.relPhrases).length;

		lang.lenWords = lenWords;
		lang.lenPhrases = lenPhrases;
	});

	return langs;
})

ipcMain.handle('new-lang', (e, langName) => {
	let lang = new Language(langName);
	db.save(lang);

	return lang;
})

ipcMain.handle('get-lang-by-id', (e, id) => {
	let lang = db.Languages.filter(elem => elem.id == id);
	return lang;
})

ipcMain.handle('get-words-phrases', (e, id) => {

	const lang = db.Languages.filter(elem => elem.id == id)[0];
	const words = db.getChildren(lang, lang.relWords);
	const phrases = db.getChildren(lang, lang.relPhrases);

	return [words, phrases];
})

ipcMain.handle('add-new-word', (e, wrd) => {

	if (wrd.gender == 'none') {
		wrd.gender = null;
	}

	const word = new Word(wrd.word, [wrd.meaning], wrd.article, null, null, wrd.gender);
	db.appendAndSaveChild(wrd.langId, tableNames.Language, word);
	
	return word;
})

ipcMain.handle('get-item', (e, id)=>{
	if (id.startsWith('wrd')) {
		const word = db.Words.filter(elem => elem.id == id)[0];
		return word;
	}
	else if(id.startsWith('phr')){
		const phrase = db.Phrases.filter(elem => elem.id == id)[0];
		return phrase;
	}
})

ipcMain.on('delete-lang', (e, id) =>{
	const lang = db.Languages.filter(elem => elem.id == id)[0];
	db.delete(id, tableNames.Language, true, [lang.relWords, lang.relPhrases]);
})

ipcMain.on('delete-word', (e, id) => {
	db.delete(id, tableNames.Word);
})

ipcMain.on('updateWrd', (e, wrd, id) => {
	let word = db.Words.filter(elem => elem.id == id)[0];

	word.article = wrd.article;
	word.plural = wrd.plural;
	word.info = wrd.info;
	word.word = wrd.word;
	word.gramGender = wrd.gramGender;

	db.delete(id, tableNames.Word, false);
	db.save(word);
})