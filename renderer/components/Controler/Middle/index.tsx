import styles from "./index.module.scss";
import ProgressBar from "./ProgressBar";
import Time from "./Time";
import { useAppSelector } from "Utils/hooks";

function Middle() {
    const title = useAppSelector(
        (state) => state.music.playingItem?.name || "Title"
    );

    return (
        <div className={styles.middle}>
            <div className="title" title={title}>
                {title}
            </div>
            <ProgressBar />
            <Time />
        </div>
    );
}

export default Middle;
