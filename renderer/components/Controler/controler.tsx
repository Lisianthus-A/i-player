import styles from "./controler.module.scss";
import Left from "./Left";
import Middle from "./Middle";
import Right from "./Right";
import Drawer from "./Drawer";
import music from "Utils/music";
import { useEffect } from "react";
import { useAppDispatch, useInterval } from "Utils/hooks";
import { changeSong, updateCurrentTime } from "Store/musicSlice";

function Controler() {
    const dispatch = useAppDispatch();

    // 获取播放时间
    useInterval(() => {
        dispatch(updateCurrentTime());
    }, 300);

    // 设置播放结束后的回调
    useEffect(() => {
        music.setOnEnded(() => dispatch(changeSong("next")));
    }, [dispatch]);

    return (
        <footer className={styles.controler}>
            <Left />
            <Middle />
            <Right />
            {false && <Drawer />}
        </footer>
    );
}

export default Controler;
