import styles from "./index.module.scss";
import { Icon } from "Components/index";
import { play, pause, changeSong, selectFiles } from "Store/musicSlice";
import { useAppDispatch, useAppSelector } from "Utils/hooks";

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
            <Icon
                type="icon-prev"
                className="button-prev"
                onClick={() => dispatch(changeSong("prev"))}
            />
            {status === "pause" && (
                <Icon
                    type="icon-play"
                    className="button-play"
                    onClick={handlePlay}
                />
            )}
            {status === "playing" && (
                <Icon
                    type="icon-pause"
                    className="button-play"
                    onClick={() => dispatch(pause())}
                />
            )}
            <Icon
                type="icon-prev"
                className="button-next"
                onClick={() => dispatch(changeSong("next"))}
            />
        </div>
    );
}

export default Left;
