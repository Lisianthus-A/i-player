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

export const timeConvert = (time: number) => {
    const minNum = (time / 60) >> 0;
    const secNum = (time - minNum * 60) >> 0;
    const min = String(minNum).padStart(2, "0");
    const sec = String(secNum).padStart(2, "0");
    return `${min}:${sec}`;
};

export const getDuration = async (path: string) => {
    const buffer = await window.electronAPI.readFile(path);
    if (!buffer) {
        return "00:00";
    }
    const blob = new Blob([buffer], { type: "audio/wav" });
    const src = window.URL.createObjectURL(blob);
    const result = await new Promise<string>((resolve) => {
        const audio = new Audio();
        audio.onloadedmetadata = () => {
            const { duration } = audio;
            if (isNaN(duration)) {
                resolve("00:00");
            } else {
                resolve(timeConvert(duration));
            }
        };
        audio.onerror = () => {
            resolve("00:00");
        };
        audio.src = src;
    });

    window.URL.revokeObjectURL(src);
    return result;
};
