import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getDuration, getFileName } from "@/utils";
import music from "@/utils/music";

type PA<T> = PayloadAction<T>;

interface SongItem {
    path: string;
    name: string;
    duration: number;
}

type ModeType = "cycle" | "random" | "single-cycle";
interface State {
    playingItem: SongItem | null;
    playlist: SongItem[];
    playlistVisible: boolean;
    status: "playing" | "pause";
    mode: ModeType;
    currentTime: number;
    initialized: boolean;
}

const initialState: State = {
    playingItem: null,
    playlist: [],
    playlistVisible: false,
    status: "pause",
    mode: "cycle",
    currentTime: 0,
    initialized: false,
};

const pathSet = new Set<string>();

// 选择文件
export const selectFiles = createAsyncThunk("music/selectFiles", async (isAppendNewList?: boolean) => {
    const paths: string[] = await window.electronAPI.openFiles();

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
    return {
        list,
        isAppendNewList: isAppendNewList === true
    };
});

const audio: HTMLAudioElement = document.getElementById("audio") as HTMLAudioElement;

const musicSlice = createSlice({
    name: "music",
    initialState,
    reducers: {
        // 播放
        play: (state, action: PA<{ item: SongItem; offset?: number }>) => {
            const { item, offset } = action.payload;
            navigator.mediaSession.playbackState = "playing";
            state.status = "playing";
            state.playingItem = item;
            if (typeof offset === "number") {
                state.currentTime = offset;
            }
            audio.play();
            music.play(item.path, offset);
        },
        // 暂停
        pause: (state) => {
            navigator.mediaSession.playbackState = "paused";
            state.status = "pause";
            audio.pause();
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
                nextIndex = nextIndex === currentIndex ? (currentIndex + 1) % len : nextIndex;
            }

            const nextSong = playlist[nextIndex];
            state.playingItem = nextSong;

            state.status = 'playing';

            music.play(nextSong.path);
            music.setRandomPreset(0);
        },
        // 删除某一首歌曲
        removeItem: (state, action: PA<number>) => {
            const index = action.payload;
            if (index < 0 || index >= state.playlist.length || state.playlist.length === 1) {
                return;
            }

            const newList = state.playlist.slice();
            const removedItem = newList.splice(action.payload, 1)[0];
            // 正在播放的歌曲
            if (removedItem.path === state.playingItem?.path) {
                const nextSongIndex = (index + 1) % state.playlist.length;
                const nextSong = state.playlist[nextSongIndex];
                state.playingItem = nextSong;
                state.status = "playing";
                music.play(nextSong.path);
                music.setRandomPreset(0);
            }

            state.playlist = newList;
            pathSet.delete(removedItem.path);
        },
        // 更新当前时间
        updateCurrentTime: (state) => {
            state.currentTime = music.getCurrentTime();
        },
        // 改变播放模式
        changeMode: (state, action: PA<ModeType>) => {
            state.mode = action.payload;
        },
        // 显示 / 隐藏播放列表
        togglePlaylistVisible: (state) => {
            state.playlistVisible = !state.playlistVisible;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(selectFiles.fulfilled, (state, action) => {
            const { list, isAppendNewList } = action.payload;
            if (list.length === 0) {
                return;
            }
            if (isAppendNewList) {
                const newList = state.playlist.slice();
                list.forEach((item) => {
                    if (pathSet.has(item.path)) {
                        return;
                    }

                    newList.push(item);
                    pathSet.add(item.path);
                });
                state.playlist = newList;
            } else {
                state.playlist = list;
                state.playingItem = list[0];
                list.forEach((item) => {
                    pathSet.add(item.path);
                });
                audio.play();
                navigator.mediaSession.playbackState = "playing";
                state.status = "playing";
                state.initialized = true;
                music.play(list[0].path);
            }
        });
    },
});

export const {
    play,
    pause,
    changeSong,
    updateCurrentTime,
    changeMode,
    togglePlaylistVisible,
    removeItem,
} = musicSlice.actions;

export default musicSlice;
