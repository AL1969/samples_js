
'use strict';

const electron = require('electron');
const path = require('path');
var eCogMenuModule = require('./electron-globals');
var eCogMenuModule = require('./electron-menu');
var eCogLoginModule = require('./electron-TC');

// Module to control application life.
const {app} = electron;
// Protocol to control paths.
const {protocol} = electron;
// Module to create native browser window.
const {BrowserWindow} = electron;
// Module to control Menu
const {Menu} = electron;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
	// Create the browser window.
	win = new BrowserWindow({width: 1200, height: 1024, title: "TEST"});
	win.webContents.session.clearCache(function(){
		//some callback.
	});
	win.webContents.clearHistory();
	var s = app.getPath('userData') + '/Cache';

	// // parse application name from command-line parameters
	// var appKey = '--app-name=';
	// var appName = 'treecanopy';
	// process.argv.forEach( (arg) => {
		// if (arg.substr(0,appKey.length)==appKey) {
			// appName = arg.substr(appKey.length);
		// } 
	// })

	const menu = Menu.buildFromTemplate(eCogMenuModule.electronMenu);
	Menu.setApplicationMenu(menu);

	// Emitted when the window is closed.
	win.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		win = null;
	}); 

	// show Trimble Connect login screen and then start application
	eCogLoginModule.login('http://localhost:8888/auth_trimbleid/oauth_after.html', win);

	// Open the DevTools.
	win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
	createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null) {
		createWindow();
	}
});
