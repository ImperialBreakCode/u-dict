// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { AppDatabse } = require('./database/database.js');


const appDb = new AppDatabse('./database.sqlite');


// create main window
const createWindow = () => {

	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true
		}
	})

	mainWindow.loadURL('http://localhost:3000')
	//mainWindow.loadFile('views/index.html')

	mainWindow.webContents.openDevTools()
	mainWindow.removeMenu()
}


// startup
app.whenReady().then(() => {
	appDb.createTables('./database/createTables.sql');
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
	const rows = await appDb.db.all('SELECT * FROM Languages');
	return rows;
})

ipcMain.on('new-lang', () => {
	appDb.db.exec('INSERT INTO Languages (language, wordCount) VALUES ("english", 100)')
})