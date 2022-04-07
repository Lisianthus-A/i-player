const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");

let openFilesCallback;

ipcRenderer.on("open-files-callback", (evt, paths) => {
    typeof openFilesCallback === "function" && openFilesCallback(paths);
});

contextBridge.exposeInMainWorld("electronAPI", {
    exit: () => ipcRenderer.send("exit"),
    openFiles: (callback) => {
        ipcRenderer.send("open-files");
        openFilesCallback = callback;
    },
    readFile: (path) =>
        new Promise((resolve) => {
            fs.access(path, (err) => {
                if (err) {
                    console.log(err);
                    return resolve(null);
                }

                resolve(fs.readFileSync(path).buffer);
            });
        }),
    ignoreEvents: (ignore) => {
        ipcRenderer.send("ignore-events", ignore);
    },
    minimize: () => {
        ipcRenderer.send('minimize');
    },
    toggleMaximize: () => {
        ipcRenderer.send('toggle-maximize');
    },
});
