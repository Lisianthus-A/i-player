import styles from "./index.module.scss";
import { Icon } from "Components/index";
import type { SongItem } from "../controler";
import { memo } from "react";

interface Props {
    status: "pause" | "playing";
    playingItem: SongItem | null;
    onPlay: (item?: SongItem) => void;
    onPause: () => void;
    onPrevOrNext: (type: "prev" | "next") => void;
}

function Left({ status, playingItem, onPlay, onPause, onPrevOrNext }: Props) {
    return (
        <div className={styles.left}>
            <Icon
                type="icon-prev"
                className="button-prev"
                onClick={() => onPrevOrNext("prev")}
            />
            {status === "pause" && (
                <Icon
                    type="icon-play"
                    className="button-play"
                    onClick={() => {
                        onPlay(playingItem || undefined);
                    }}
                />
            )}
            {status === "playing" && (
                <Icon
                    type="icon-pause"
                    className="button-play"
                    onClick={onPause}
                />
            )}
            <Icon
                type="icon-prev"
                className="button-next"
                onClick={() => onPrevOrNext("next")}
            />
        </div>
    );
}

export default memo(Left);
