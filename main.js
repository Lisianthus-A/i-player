const {
    app,
    dialog,
    ipcMain,
    BrowserWindow,
    Menu,
    Tray,
    MenuItem,
} = require("electron");

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
    return;
}

const process = require("process");
const path = require("path");

const isDev = process.env.NODE_ENV === "development";
const iconPath = path.join(__dirname, "/public/favicon.ico");

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 480,
        minHeight: 360,
        frame: false,
        // transparent: true,
        icon: path.join(__dirname, "/public/favicon.ico"),
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    if (isDev) {
        win.loadURL("http://localhost:4000");
    } else {
        win.loadFile("./webContent/index.html");
    }

    // 设置托盘
    const appTray = new Tray(iconPath);
    const trayMenu = new Menu();
    trayMenu.append(
        new MenuItem({
            type: "normal",
            label: "退出",
            click: app.quit,
        })
    );
    appTray.setContextMenu(trayMenu);
    appTray.setToolTip("I Player");
    appTray.on("double-click", () => {
        win.show();
    });

    win.on("maximize", () => {
        win.webContents.send("win-maximize");
    });
    win.on("unmaximize", () => {
        win.webContents.send("win-unmaximize");
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
                        // "mid",
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

    // 窗口最大化 / 恢复
    ipcMain.on("toggle-maximize", () => {
        if (win.isMaximized()) {
            win.unmaximize();
        } else {
            win.maximize();
        }
    });

    // 窗口最小化
    ipcMain.on("minimize", () => {
        win.minimize();
    });

    // 隐藏窗口
    ipcMain.on("hide", () => {
        win.hide();
    });

    return win;
}

app.whenReady().then(() => {
    let myWin = createWindow();

    app.on("activate", () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            myWin = createWindow();
        }
    });

    app.on("second-instance", () => {
        if (myWin) {
            myWin.show();
            myWin.focus();
        }
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });
});
