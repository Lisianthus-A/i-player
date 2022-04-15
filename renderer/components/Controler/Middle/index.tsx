import styles from "./index.module.scss";
import ProgressBar from "./ProgressBar";
import Time from "./Time";
import type { SongItem } from "../controler";
import { memo } from "react";

interface Props {
    playingItem: null | SongItem;
    onSetPlaying: () => void;
}

function Middle({ playingItem, onSetPlaying }: Props) {
    const title = playingItem ? playingItem.name : "Title";
    const duration = playingItem ? playingItem.duration : "00:00";

    return (
        <div className={styles.middle}>
            <div className="title" title={title}>
                {title}
            </div>
            <ProgressBar duration={duration} onSetPlaying={onSetPlaying} />
            <Time duration={duration} />
        </div>
    );
}

export default memo(Middle);
