interface Window {
    electronAPI: {
        exit: () => void;
        readFile: (path: string) => Promise<ArrayBuffer | null>;
        openFiles: (callback: (files: string[]) => void) => void;
        ignoreEvents: (ignore: boolean) => void;
        minimize: () => void;
        toggleMaximize: () => void;
    };
}

declare module '*.module.css' {
    const styles: Record<string, string>;
    export default styles;
}

declare module '*.module.scss' {
    const styles: Record<string, string>;
    export default styles;
}