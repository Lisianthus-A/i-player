import styles from "./index.module.scss";
import { ProgressBar } from "@/components";
import Time from "./Time";
import { play } from "@/store/musicSlice";
import { useAppSelector, useAppDispatch } from "@/utils/hooks";
import { timeConvert } from "@/utils";

function Middle() {
    const dispatch = useAppDispatch();
    const playingItem = useAppSelector((state) => state.music.playingItem);
    const currentTime = useAppSelector((state) => state.music.currentTime);
    const title = playingItem?.name || 'Title';

    return (
        <div className={styles.middle}>
            <div className="title" title={title}>
                {title}
            </div>
            <ProgressBar
                min={0}
                max={playingItem?.duration || 0}
                value={currentTime}
                tipFormatter={timeConvert}
                onChangeEnd={(value) => {
                    dispatch(play({ item: playingItem!, offset: value }));
                }}
            />
            <Time />
        </div>
    );
}

export default Middle;
