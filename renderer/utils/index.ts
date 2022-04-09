export const getFileName = (path: string) => {
    if (!path) {
        return "";
    }
    const pos = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
    if (pos < 0) {
        return path;
    } else {
        const tempPath = path.slice(pos + 1);
        return tempPath.slice(0, tempPath.lastIndexOf("."));
    }
};

export const getDuration = async (path: string) => {
    const buffer = await window.electronAPI.readFile(path);
    if (!buffer) {
        return 0;
    }
    const blob = new Blob([buffer], { type: "audio/wav" });
    const src = window.URL.createObjectURL(blob);
    const result = await new Promise<number>((resolve) => {
        const audio = new Audio();
        audio.onloadedmetadata = () => {
            resolve(audio.duration);
        };
        audio.onerror = () => {
            resolve(0);
        };
        audio.src = src;
    });

    window.URL.revokeObjectURL(src);
    return result;
}