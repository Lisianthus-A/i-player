import styles from "./controler.module.scss";
import Left from "./Left";
import Middle from "./Middle";
import Right from "./Right";
import Drawer from "./Drawer";
import music from "@/utils/music";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/utils/hooks";
import { changeSong, updateCurrentTime, play, pause } from "@/store/musicSlice";

function Controler() {
    const dispatch = useAppDispatch();

    const playingItem = useAppSelector((state) => state.music.playingItem);

    // 设置回调
    useEffect(() => {
        const onEnded = () => {
            dispatch(changeSong("next"))
        };

        const onTimeUpdate = (evt: any) => {
            const { currentTime } = evt;
            dispatch(updateCurrentTime(currentTime));
        };

        music.tag.on("ended", onEnded);
        music.tag.on("timeUpdate", onTimeUpdate);
        return () => {
            music.tag.off("ended", onEnded);
            music.tag.off("timeUpdate", onTimeUpdate);
        };
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
