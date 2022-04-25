import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Icon, Tooltip } from "Components/index";
import { useAppSelector, useAppDispatch } from "Utils/hooks";
import { changeMode } from "Store/musicSlice";
import music from "Utils/music";

const modeMap = {
    cycle: {
        text: "列表循环",
        icon: "icon-cycle",
    },
    random: {
        text: "随机",
        icon: "icon-random",
    },
    "single-cycle": {
        text: "单曲循环",
        icon: "icon-single-cycle",
    },
};

function Right() {
    const mode = useAppSelector((state) => state.music.mode);
    const dispatch = useAppDispatch();
    const { text, icon } = modeMap[mode];
    const [isMute, setIsMute] = useState<boolean>(false);
    const [volume, setVolume] = useState<string>("100");

    // 改变播放模式
    const handleChangeMode = () => {
        if (mode === "cycle") {
            dispatch(changeMode("random"));
        } else if (mode === "random") {
            dispatch(changeMode("single-cycle"));
        } else {
            dispatch(changeMode("cycle"));
        }
    };

    useEffect(() => {
        if (isMute) {
            music.setVolume(0);
            return;
        }

        music.setVolume(Number(volume) / 100);
    }, [volume, isMute]);

    return (
        <div className={styles.right}>
            <Tooltip
                text={text}
                wrapClassName="icon"
                onClick={handleChangeMode}
            >
                <Icon type={icon} />
            </Tooltip>
            <Tooltip text="播放列表" wrapClassName="icon">
                <Icon type="icon-list" />
            </Tooltip>
            <Tooltip
                text="音量"
                wrapClassName="icon"
                onClick={() => setIsMute(!isMute)}
            >
                <Icon type="icon-voice" />
            </Tooltip>
            <input
                value={isMute ? "0" : volume}
                type="range"
                onChange={(evt) => {
                    const value = evt.target.value;
                    setVolume(value);
                    setIsMute(false);
                }}
            />
        </div>
    );
}

export default Right;
