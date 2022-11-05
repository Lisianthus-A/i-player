interface Window {
    electronAPI: {
        hide: () => void;
        readFile: (path: string) => Promise<ArrayBuffer | null>;
        openFiles: () => Promise<string[]>;
        minimize: () => void;
        toggleMaximize: () => void;
    };
}

declare module "*.module.css" {
    const styles: Record<string, string>;
    export default styles;
}

declare module "*.module.scss" {
    const styles: Record<string, string>;
    export default styles;
}
