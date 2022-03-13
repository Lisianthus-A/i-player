const { app, BrowserWindow } = require('electron');
const process = require('process');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    });

    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    console.log('electron window all close');
    if (process.platform !== 'darwin') {
        app.quit();
    }
});