const { app, BrowserWindow, ipcMain } = require("electron");
const process = require("process");
const path = require("path");

const isDev = process.env.NODE_ENV === "development";

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        // frame: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    if (isDev) {
        win.loadURL("http://localhost:4000");
    }

    // win.loadFile('./dist/index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    console.log("electron window all close");
    if (process.platform !== "darwin") {
        app.quit();
    }
});

ipcMain.on("exit", () => {
    app.quit();
});
