const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");

let openFilesResolve;
const onFilesSelected = (evt) => {
    typeof openFilesResolve === "function" && openFilesResolve(evt.detail || []);
};
window.addEventListener('files-selected', onFilesSelected);

ipcRenderer.on("open-files-callback", (evt, paths) => {
    const customEvt = new CustomEvent("files-selected", {
        detail: paths
    });
    window.dispatchEvent(customEvt);
});

ipcRenderer.on("win-maximize", () => {
    document.body.classList.add("maximize");
});

ipcRenderer.on("win-unmaximize", () => {
    document.body.classList.remove("maximize");
});

contextBridge.exposeInMainWorld("electronAPI", {
    exit: () => ipcRenderer.send("exit"),
    openFiles: () => {
        ipcRenderer.send("open-files");
        return new Promise((resolve) => {
            openFilesResolve = resolve;
        });
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
    minimize: () => {
        ipcRenderer.send("minimize");
    },
    toggleMaximize: () => {
        ipcRenderer.send("toggle-maximize");
    },
});
