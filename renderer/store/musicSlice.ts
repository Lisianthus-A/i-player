import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getDuration, getFileName } from "Utils/index";
import music from "Utils/music";

type PA<T> = PayloadAction<T>;

interface SongItem {
    path: string;
    name: string;
    duration: number;
}

interface State {
    playingItem: SongItem | null;
    playlist: SongItem[];
    status: "playing" | "pause";
    mode: string;
    currentTime: number;
}

const initialState: State = {
    playingItem: null,
    playlist: [],
    status: "pause",
    mode: "cycle",
    currentTime: 0,
};

// 选择文件
export const selectFiles = createAsyncThunk("music/selectFiles", async () => {
    const paths = await new Promise<string[]>((resolve) => {
        window.electronAPI.openFiles((paths) => resolve(paths));
    });

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
    return list;
});

const musicSlice = createSlice({
    name: "music",
    initialState,
    reducers: {
        // 播放
        play: (state, action: PA<{ item: SongItem; offset?: number }>) => {
            const { item, offset } = action.payload;
            state.status = "playing";
            state.playingItem = item;
            if (typeof offset === "number") {
                state.currentTime = offset;
            }
            music.play(item.path, offset);
        },
        // 暂停
        pause: (state) => {
            state.status = "pause";
            music.pause();
        },
        // 上一首 / 下一首
        changeSong: (state, action: PA<"prev" | "next">) => {
            const { playingItem, playlist, mode } = state;
            if (playingItem === null) {
                return;
            }
            const { payload } = action;
            const currentIndex = playlist.findIndex(
                (item) => item.path === playingItem.path
            );
            const len = playlist.length;

            let nextIndex: number = currentIndex;
            if (mode === "cycle") {
                nextIndex =
                    payload === "next"
                        ? (currentIndex + 1) % len
                        : (len + currentIndex - 1) % len;
            } else if (mode === "random") {
                nextIndex = (Math.random() * len) >> 0;
            }

            const nextSong = playlist[nextIndex];
            state.playingItem = nextSong;

            music.play(nextSong.path);
            music.setRandomPreset(0);
        },
        updateCurrentTime: (state) => {
            state.currentTime = music.getCurrentTime();
        },
    },
    extraReducers: (builder) => {
        builder.addCase(selectFiles.fulfilled, (state, action) => {
            const list = action.payload;
            if (list.length === 0) {
                return;
            }
            state.playlist = list;
            state.playingItem = list[0];
            state.status = "playing";
            music.play(list[0].path);
        });
    },
});

export const { play, pause, changeSong, updateCurrentTime } =
    musicSlice.actions;

export default musicSlice;
