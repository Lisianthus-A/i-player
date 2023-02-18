import styles from "./index.module.scss";
import { Icon, Tooltip } from "@/components";
import { play, pause, changeSong, selectFiles } from "@/store/musicSlice";
import { useAppDispatch, useAppSelector } from "@/utils/hooks";

function Left() {
    const dispatch = useAppDispatch();
    const status = useAppSelector((state) => state.music.status);
    const playingItem = useAppSelector((state) => state.music.playingItem);

    const handlePlay = () => {
        if (playingItem === null) {
            dispatch(selectFiles());
        } else {
            dispatch(play({ item: playingItem }));
        }
    };

    return (
        <div className={styles.left}>
            <Tooltip text="上一首">
                <Icon
                    type="icon-prev"
                    className="button-prev"
                    onClick={() => dispatch(changeSong("prev"))}
                />
            </Tooltip>
            {status === "pause" && (
                <Tooltip text="播放">
                    <Icon
                        type="icon-play"
                        className="button-play"
                        onClick={handlePlay}
                    />
                </Tooltip>
            )}
            {status === "playing" && (
                <Tooltip text="暂停">
                    <Icon
                        type="icon-pause"
                        className="button-play"
                        onClick={() => dispatch(pause())}
                    />
                </Tooltip>
            )}
            <Tooltip text="下一首">
                <Icon
                    type="icon-prev"
                    className="button-next"
                    onClick={() => dispatch(changeSong("next"))}
                />
            </Tooltip>
        </div>
    );
}

export default Left;
