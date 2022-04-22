// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const { appDatabase } = require('./database/js/database.js');

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

	//mainWindow.loadURL('http://localhost:3000')
	mainWindow.loadFile('views/index.html')

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
	// get languages and return them
})

ipcMain.on('new-lang', () => {
	// add language
})