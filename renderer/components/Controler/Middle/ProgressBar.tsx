import { memo, useEffect, useRef, useState } from "react";
import { timeConvert } from "Utils/index";
import { useAppSelector, useAppDispatch } from "Utils/hooks";
import { play } from "Store/musicSlice";
import type { MouseEvent } from "react";

function ProgressBar() {
    const barRef = useRef<HTMLDivElement | null>(null);
    const tipRef = useRef<HTMLDivElement | null>(null);
    const dispatch = useAppDispatch();
    const currentTime = useAppSelector((state) => state.music.currentTime);
    const duration = useAppSelector(
        (state) => state.music.playingItem?.duration || 0
    );
    const playingItem = useAppSelector((state) => state.music.playingItem);

    const [tipVisible, setTipVisible] = useState<boolean>(false);

    // 更新进度条元素宽度
    const updateElementWidth = (percent: number) => {
        const bar = barRef.current;
        if (!bar) {
            return;
        }

        bar.style.setProperty("--rail-width", `${percent}%`);
        bar.style.setProperty("--track-width", `${100 - percent}%`);
    };

    // 鼠标按下
    const handleMouseDown = (evt: MouseEvent) => {
        if (evt.button !== 0 || duration === 0) {
            return;
        }

        const tip = tipRef.current;
        if (!tip) {
            return;
        }

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        setTipVisible(true);

        const width = window.innerWidth - 320;
        const percent = (evt.clientX - 160) / width;

        tip.textContent = timeConvert(percent * duration);
        updateElementWidth(percent * 100);
    };

    // 鼠标移动
    const handleMouseMove = (evt: globalThis.MouseEvent) => {
        const tip = tipRef.current;
        if (!tip) {
            return;
        }

        const width = window.innerWidth - 320;
        let percent = (evt.clientX - 160) / width;
        // 越界处理
        if (percent > 1) {
            percent = 1;
        } else if (percent < 0) {
            percent = 0;
        }
        tip.textContent = timeConvert(percent * duration);
        updateElementWidth(percent * 100);
    };

    // 鼠标抬起
    const handleMouseUp = (evt: globalThis.MouseEvent) => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);

        setTipVisible(false);

        const width = window.innerWidth - 320;
        let percent = (evt.clientX - 160) / width;
        // 越界处理
        if (percent > 1) {
            percent = 1;
        } else if (percent < 0) {
            percent = 0;
        }

        updateElementWidth(percent * 100);
        if (playingItem) {
            dispatch(play({ item: playingItem, offset: percent * duration }));
        }
    };

    useEffect(() => {
        if (tipVisible || duration === 0) {
            return;
        }

        const percent = (currentTime / duration) * 100;
        updateElementWidth(percent);
    }, [tipVisible, currentTime]);

    return (
        <div
            className="progress-bar"
            ref={barRef}
            onMouseDown={handleMouseDown}
        >
            <div className="rail">
                <div className="handle" />
                <div
                    className="tooltip"
                    ref={tipRef}
                    style={{ visibility: tipVisible ? "visible" : "hidden" }}
                />
            </div>
            <div className="track" />
        </div>
    );
}

export default memo(ProgressBar);
