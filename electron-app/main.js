// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path');

const { appDatabase } = require('./database/js/database.js');
const { Language, Word, Phrase, Group, ConnectedWords, ConnectedPhrases } = require('./database/js/models');
const { tableNames } = require('./database/js/tableNames.js');

const db = new appDatabase(`storage`);

// create main window
const createWindow = () => {

	const mainWindow = new BrowserWindow({
		width: 1250,
		minWidth: 1000,
		height: 700,
		minHeight: 700,
		//titleBarStyle: 'hidden',
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			//nodeIntegration: true
		}
	})

	mainWindow.loadURL('http://localhost:3000')
	//mainWindow.loadFile('views/index.html')

	mainWindow.webContents.openDevTools()
	mainWindow.removeMenu()

	// event listeners
	mainWindow.on('maximize', ()=> {
		mainWindow.webContents.send('window-maximized');
	})

	mainWindow.on('unmaximize', ()=> {
		mainWindow.webContents.send('window-unmaximized');
	})
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
ipcMain.on('app-quit', () => {
	app.quit();
})

ipcMain.on('window-full-screen', () => {
	let window = BrowserWindow.getFocusedWindow();
	window.maximize();
})

ipcMain.on('window-exit-full-screen', () => {
	let window = BrowserWindow.getFocusedWindow();
	window.unmaximize();
})

ipcMain.on('window-minimize', () => {
	let window = BrowserWindow.getFocusedWindow();
	window.minimize();
})

ipcMain.handle('get-stats', () => {

	const data = {};
	data.langCount = db.Languages.length;
	data.wordCount = db.Words.length;
	data.phraseCount = db.Phrases.length;

	return data;

})

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

ipcMain.handle('get-words', () => {
	let words = db.Words;
	words.forEach(word => {
		const lang = db.getParent(word.foreignKeys[tableNames.Language][0]);
		word.language = lang.langName;
	});

	return words;
})

ipcMain.handle('get-phrases', () => {
	let phrases = db.Phrases;
	phrases.forEach(phrase => {
		const lang = db.getParent(phrase.foreignKeys[tableNames.Language][0]);
		phrase.language = lang.langName;
	});

	return phrases;
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

ipcMain.handle('add-new-phrase', (e, phr) => {
	if (phr.gender == 'none') {
		phr.gender = null;
	}

	const phrase = new Phrase(phr.phrase, [phr.meaning], null, phr.gender);
	db.appendAndSaveChild(phr.langId, tableNames.Language, phrase);

	return phrase;
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
	else if(id.startsWith('cntwrds')){
		const item = db.ConnectedWords.filter(elem => elem.id == id)[0];

		const children = db.getChildren(item, item.relWords);
		children.forEach(child => {
			child.language = db.getParent(child.foreignKeys[tableNames.Language][0]).langName;
		});

		item.children = children;
		return item;
	}
	else if(id.startsWith('cntphrs')){
		const item = db.ConnectedPhrases.filter(elem => elem.id == id)[0];

		const children = db.getChildren(item, item.relPhrases);
		children.forEach(child => {
			child.language = db.getParent(child.foreignKeys[tableNames.Language][0]).langName;
		});

		item.children = children;
		return item;
	}
})

ipcMain.on('delete-lang', (e, id) =>{
	const lang = db.Languages.filter(elem => elem.id == id)[0];
	db.delete(id, tableNames.Language, true, [lang.relWords, lang.relPhrases]);
})

ipcMain.on('delete-word', (e, id) => {
	db.delete(id, tableNames.Word);
})

ipcMain.on('delete-phrase', (e, id) =>{
	db.delete(id, tableNames.Phrase);
})

ipcMain.on('updateWrd', (e, wrd, id) => {
	let word = db.Words.filter(elem => elem.id == id)[0];

	word.article = wrd.article;
	word.plural = wrd.plural;
	word.info = wrd.info;
	word.word = wrd.word;
	word.gramGender = wrd.gramGender;

	db.update(word);
})

ipcMain.on('updatePhr', (e, phr, id) => {
	let phrase = db.Phrases.filter(elem => elem.id == id)[0];

	phrase.info = phr.info;
	phrase.phrase = phr.phrase;
	phrase.gramGender = phr.gramGender;

	db.update(phrase);
})

ipcMain.on('update-meanings-wrd', (e, mn, id) => {
	let word = db.Words.filter(elem => elem.id == id)[0];
	word.meanings = [...mn];

	db.update(word);
})

ipcMain.on('update-meanings-phr', (e, mn, id) => {
	let phrase = db.Phrases.filter(elem => elem.id == id)[0];
	phrase.meanings = [...mn];

	db.update(phrase);
})

ipcMain.handle('get-groups', (e) => {
	return db.Groups;
})

ipcMain.on('add-edit-group', (e, type, data) => {
	if (type == 'add') {
		const group = new Group(data);
		db.save(group);
	}
	else if(type == 'edit'){
		const group = db.Groups.filter(elem => elem.id == data.id)[0];
		group.groupName = data.name;

		db.update(group);
	}
	else if(type == 'delete'){
		
		db.removeChildren(data, tableNames.Group, tableNames.Word);
		db.delete(data, tableNames.Group, false);
	}
})

ipcMain.on('manage-group-connections', (e, action, groupId, targetId) => {

	let group = db.Groups.filter(elem => elem.id == groupId)[0];

	if (action == 'connect') {
		db.connectExisting(group, group.relWords, targetId);
	}
	else if (action == 'disconnect') {
		db.disconnectExisting(group, group.relWords, targetId);
	}

})

ipcMain.handle('get-connected', (e, type) => {

	if (type == 'wrd') {
		return db.ConnectedWords;
	} 
	else if (type == 'phr') {
		return db.ConnectedPhrases;
	}

})

ipcMain.on('manage-connected-items', (e, action, type, data) => {
	if (type === 'wrd') {
		
		if (action == 'create') {
			const [name, ids] = data;

			const connectedWord = new ConnectedWords(name);
			db.save(connectedWord);

			for (let i = 0; i < ids.length; i++) {
				db.connectExisting(connectedWord, connectedWord.relWords, ids[i]);
			}
		}
		else if (action == 'delete') {
			db.removeChildren(data, tableNames.ConnectedWords, tableNames.Word);
			db.delete(data, tableNames.ConnectedWords, false);
		}
		else if (action == 'update') {

			const item = db.ConnectedWords.filter(elem => elem.id == data.id)[0];
			item.commonMeaning = data.name;

			db.removeChildren(item.id, item.tableName, tableNames.Word);

			for (let i = 0; i < data.children.length; i++) {
				db.connectExisting(item, item.relWords, data.children[i]);
			}

			db.update(item);
		}
	}
	else if (type === 'phr') {
		
		if (action == 'create') {
			const [name, ids] = data;

			const connectedPhrase = new ConnectedPhrases(name);
			db.save(connectedPhrase);

			for (let i = 0; i < ids.length; i++) {
				db.connectExisting(connectedPhrase, connectedPhrase.relPhrases, ids[i]);
			}
		}
		else if (action == 'delete') {
			db.removeChildren(data, tableNames.ConnectedPhrases, tableNames.Phrase);
			db.delete(data, tableNames.ConnectedPhrases, false);
		}
		else if (action == 'update') {
			const item = db.ConnectedPhrases.filter(elem => elem.id == data.id)[0];
			item.commonMeaning = data.name;

			db.removeChildren(item.id, item.tableName, tableNames.Phrase);

			for (let i = 0; i < data.children.length; i++) {
				db.connectExisting(item, item.relPhrases, data.children[i]);
			}

			db.update(item);
		}
	}
})