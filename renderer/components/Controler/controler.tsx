import styles from "./controler.module.scss";
import { useSetState } from "Utils/hooks";
import Left from "./Left";
import Middle from "./Middle";
import Right from "./Right";
import Drawer from "./Drawer";
import music from "Utils/music";
import { getDuration, getFileName } from "Utils/index";
import { useCallback, useEffect } from "react";

export interface SongItem {
    path: string;
    name: string;
    duration: string;
}

export interface State {
    playingItem: SongItem | null;
    playlist: SongItem[];
    status: "playing" | "pause";
    mode: string;
}

const initState: State = {
    playingItem: null,
    playlist: [],
    status: "pause",
    mode: "cycle",
};

function Controler() {
    const [state, setState] = useSetState<State>(
        JSON.parse(JSON.stringify(initState))
    );

    const { status, mode, playlist, playingItem } = state;

    // 选择文件
    const handleSelectFiles = useCallback(async (paths: string[]) => {
        if (paths.length === 0) {
            return;
        }

        const list: SongItem[] = [];
        for (let i = 0; i < paths.length; ++i) {
            const path = paths[i];
            const duration = await getDuration(path);
            list.push({
                path,
                name: getFileName(path),
                duration,
            });
        }
        music.play(paths[0]);
        setState({
            playingItem: list[0],
            playlist: list,
            status: "playing",
        });
    }, []);

    // 播放
    const handlePlay = useCallback(
        async (item?: SongItem, offset?: number) => {
            if (item === undefined) {
                return window.electronAPI.openFiles(handleSelectFiles);
            }

            setState({
                status: "playing",
                playingItem: item,
            });

            music.play(item.path, offset);
        },
        [handleSelectFiles]
    );

    // 暂停
    const handlePause = useCallback(() => {
        music.pause();
        setState({ status: "pause" });
    }, []);

    // 上一首 / 下一首
    const handlePrevOrNext = useCallback(
        (type: "prev" | "next") => {
            if (playingItem === null) {
                return;
            }

            const currentIndex = playlist.findIndex(
                (item) => item.path === playingItem.path
            );
            const len = playlist.length;

            let nextIndex: number = currentIndex;
            if (mode === "cycle") {
                nextIndex =
                    type === "next"
                        ? (currentIndex + 1) % len
                        : (len + currentIndex - 1) % len;
            } else if (mode === "random") {
                nextIndex = (Math.random() * len) >> 0;
            }

            handlePlay(playlist[nextIndex]);
            music.setRandomPreset(0);
        },
        [mode, playingItem, playlist, handlePlay]
    );

    // 设置播放结束后的回调
    useEffect(() => {
        music.setOnEnded(() => handlePrevOrNext("next"));
    }, [handlePrevOrNext]);

    return (
        <footer className={styles.controler}>
            <Left
                status={status}
                playingItem={playingItem}
                onPlay={handlePlay}
                onPause={handlePause}
                onPrevOrNext={handlePrevOrNext}
            />
            <Middle playingItem={playingItem} />
            <Right />
            {false && <Drawer />}
        </footer>
    );
}

export default Controler;
