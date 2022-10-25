import styles from "./controler.module.scss";
import Left from "./Left";
import Middle from "./Middle";
import Right from "./Right";
import Drawer from "./Drawer";
import music from "Utils/music";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector, useInterval } from "Utils/hooks";
import { changeSong, updateCurrentTime, play, pause } from "Store/musicSlice";

function Controler() {
    const dispatch = useAppDispatch();

    const playingItem = useAppSelector((state) => state.music.playingItem);

    // 获取播放时间
    useInterval(() => {
        dispatch(updateCurrentTime());
    }, 300);

    // 设置播放结束后的回调
    useEffect(() => {
        music.setOnEnded(() => dispatch(changeSong("next")));
    }, [dispatch]);

    // mediaSession MediaMetadata & ActionHandler
    useEffect(() => {
        if (!playingItem) {
            return;
        }

        navigator.mediaSession.metadata = new MediaMetadata({
            title: playingItem.name,
        });

        // 播放
        navigator.mediaSession.setActionHandler('play', () => {
            dispatch(play({ item: playingItem }));
        });
        // 暂停
        navigator.mediaSession.setActionHandler('pause', () => {
            dispatch(pause());
        });
        // 上一首
        navigator.mediaSession.setActionHandler('previoustrack', () => {
            dispatch(changeSong("prev"));
        });
        // 下一首
        navigator.mediaSession.setActionHandler('nexttrack', () => {
            dispatch(changeSong("next"));
        });
    }, [playingItem, dispatch]);

    return (
        <footer className={styles.controler}>
            <Left />
            <Middle />
            <Right />
            <Drawer />
        </footer>
    );
}

export default Controler;
