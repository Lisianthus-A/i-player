interface Window {
    electronAPI: {
        exit: () => void;
        readFile: (path: string) => Promise<ArrayBuffer | null>;
        openFiles: (callback: (files: string[]) => void) => void;
        ignoreEvents: (ignore: boolean) => void;
    };
}
