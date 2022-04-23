// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path');

const { appDatabase } = require('./database/js/database.js');
const { Language } = require('./database/js/models');
const { tableNames } = require('./database/js/tableNames.js');

const db = new appDatabase('./database/storage');

// create main window
const createWindow = () => {

	const mainWindow = new BrowserWindow({
		width: 800,
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
ipcMain.handle('get-langs', async (e, args) => {
	let langs = db.Languages;
	return langs;
})

ipcMain.on('new-lang', () => {
	let lang = new Language('english');
	db.save(lang, tableNames.Language);
})