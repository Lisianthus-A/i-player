import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Icon, Tooltip, ProgressBar } from "Components/index";
import { useAppSelector, useAppDispatch } from "Utils/hooks";
import { changeMode, togglePlaylistVisible } from "Store/musicSlice";
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
    const playlistVisible = useAppSelector(
        (state) => state.music.playlistVisible
    );
    const dispatch = useAppDispatch();
    const { text, icon } = modeMap[mode];
    const [isMute, setIsMute] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(100);

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
            <Tooltip
                text="播放列表"
                wrapClassName={playlistVisible ? "icon active" : "icon"}
                onClick={() => dispatch(togglePlaylistVisible())}
            >
                <Icon type="icon-list" />
            </Tooltip>
            <Tooltip
                text="音量"
                wrapClassName={isMute ? "icon f28" : "icon"}
                onClick={() => setIsMute(!isMute)}
            >
                <Icon type={isMute ? "icon-mute" : "icon-voice"} />
            </Tooltip>
            <ProgressBar
                className="volumn-bar"
                value={isMute ? 0 : volume}
                tipFormatter={(value) => String(value >> 0)}
                onChange={(value) => {
                    setVolume(value);
                    setIsMute(false);
                }}
            />
        </div>
    );
}

export default Right;
