import { getFileName } from "./utils/index";
import music from "./utils/music";

function App() {
    const handleSelectFiles = (paths: string[]) => {
        if (paths.length === 0) {
            return;
        }

        console.log("paths", paths);
        console.log(getFileName(paths[0]));
        music.play(paths[0]);
        // console.log('read', window.electronAPI.readFile(paths[0]));
    };

    return (
        <div>
            <div>App</div>
            <button
                onClick={() => {
                    window.electronAPI.openFiles(handleSelectFiles);
                }}
            >
                play
            </button>
            <button onClick={window.electronAPI.exit}>close</button>
        </div>
    );
}

export default App;
