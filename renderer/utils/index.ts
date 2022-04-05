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
