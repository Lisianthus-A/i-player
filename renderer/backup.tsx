import { useState } from "react";
import { getFileName } from "./utils/index";
import music from "./utils/music";

function Test() {
    const [list, setList] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [playing, setPlaying] = useState<boolean>(false);

    const handleSelectFiles = (paths: string[]) => {
        if (paths.length === 0) {
            return;
        }

        music.play(paths[0]);
        setCurrentIndex(0);
        setList(paths);
        setPlaying(true);
    };

    const handleOnEnded = () => {
        const nextIndex = (currentIndex + 1) % list.length;
        music.play(list[nextIndex]);
        setCurrentIndex(nextIndex);
    };

    music.setOnEnded(handleOnEnded);

    return (
        <div>
            <div>{getFileName(list[currentIndex])}</div>
            <div
                style={{ border: "1px solid #000", height: 100 }}
                onMouseOver={() => {
                    window.electronAPI.ignoreEvents(true);
                }}
                onMouseLeave={() => {
                    window.electronAPI.ignoreEvents(false);
                }}
            ></div>
            <button
                onClick={() => {
                    window.electronAPI.openFiles(handleSelectFiles);
                }}
            >
                play
            </button>
            <button
                onClick={() => {
                    playing && music.pause();
                    !playing && music.play(list[currentIndex]);
                    setPlaying(!playing);
                }}
            >
                {playing ? "pause" : "resume"}
            </button>
            <button onClick={handleOnEnded}>next</button>
            <button onClick={window.electronAPI.exit}>close</button>
        </div>
    );
}

export default Test;
