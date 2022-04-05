const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const process = require("process");
const path = require("path");

const isDev = process.env.NODE_ENV === "development";

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        // transparent: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    if (isDev) {
        win.loadURL("http://localhost:4000");
    }

    // win.loadFile('./dist/index.html');

    ipcMain.on("ignore-events", (evt, ignore) => {
        if (ignore) {
            win.setIgnoreMouseEvents(true, { forward: true });
        } else {
            win.setIgnoreMouseEvents(false);
        }
    });

    // 打开文件浏览器
    ipcMain.on("open-files", async (evt) => {
        const { filePaths } = await dialog.showOpenDialog(win, {
            properties: ["openFile", "multiSelections"],
            filters: [
                {
                    name: "Audio Files",
                    extensions: [
                        "ipus",
                        "flac",
                        "webm",
                        "weba",
                        "wav",
                        "ogg",
                        "m4a",
                        "oga",
                        "mid",
                        "mp3",
                        "aiff",
                        "wma",
                        "au",
                    ],
                },
            ],
        });
        evt.sender.send("open-files-callback", filePaths);
    });

    // 退出应用
    ipcMain.on("exit", async () => {
        const { response } = await dialog.showMessageBox({
            type: "info",
            title: "退出",
            message: "是否确认要退出？",
            buttons: ["是", "否"],
        });
        if (response === 0) {
            app.quit();
        }
    });
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

    app.on("window-all-closed", () => {
        console.log("electron window all close");
        if (process.platform !== "darwin") {
            app.quit();
        }
    });
});
