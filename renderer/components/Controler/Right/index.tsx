import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Icon, Tooltip, ProgressBar } from "@/components";
import { useAppSelector, useAppDispatch } from "@/utils/hooks";
import { changeMode, togglePlaylistVisible } from "@/store/musicSlice";
import classNames from "classnames";
import music from "@/utils/music";

const modeMap: Record<string, any> = {
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
        music.tag.muted = isMute;
        music.tag.volume = Number(volume) / 100;
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
                wrapClassName={classNames("icon", {
                    active: playlistVisible,
                })}
                onClick={() => dispatch(togglePlaylistVisible())}
            >
                <Icon type="icon-list" />
            </Tooltip>
            <Tooltip
                text="音量"
                wrapClassName={classNames("icon", {
                    f28: isMute,
                })}
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
