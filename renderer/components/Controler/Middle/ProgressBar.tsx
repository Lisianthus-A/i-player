import { memo, useEffect, useRef, useState } from "react";
import { timeConvert } from "Utils/index";
import { useAppSelector, useAppDispatch } from "Utils/hooks";
import { play } from "Store/musicSlice";
import type { MouseEvent } from "react";
import Tooltip from "Components/Tooltip";

function ProgressBar() {
    const barRef = useRef<HTMLDivElement | null>(null);
    const dispatch = useAppDispatch();
    const currentTime = useAppSelector((state) => state.music.currentTime);
    const duration = useAppSelector(
        (state) => state.music.playingItem?.duration || 0
    );
    const playingItem = useAppSelector((state) => state.music.playingItem);

    const [draging, setDraging] = useState<boolean>(false);
    const [tooltipText, setTooltipText] = useState<string>("00:00");

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

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        const width = window.innerWidth - 400;
        const percent = (evt.clientX - 160) / width;

        setDraging(true);
        setTooltipText(timeConvert(percent * duration));
        updateElementWidth(percent * 100);
    };

    // 鼠标移动
    const handleMouseMove = (evt: globalThis.MouseEvent) => {
        const width = window.innerWidth - 400;
        let percent = (evt.clientX - 160) / width;
        // 越界处理
        if (percent > 1) {
            percent = 1;
        } else if (percent < 0) {
            percent = 0;
        }

        setTooltipText(timeConvert(percent * duration));
        updateElementWidth(percent * 100);
    };

    // 鼠标抬起
    const handleMouseUp = (evt: globalThis.MouseEvent) => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);

        const width = window.innerWidth - 400;
        let percent = (evt.clientX - 160) / width;
        // 越界处理
        if (percent > 1) {
            percent = 1;
        } else if (percent < 0) {
            percent = 0;
        }

        setDraging(false);
        updateElementWidth(percent * 100);
        if (playingItem) {
            dispatch(play({ item: playingItem, offset: percent * duration }));
        }
    };

    useEffect(() => {
        if (draging || duration === 0) {
            return;
        }

        const percent = (currentTime / duration) * 100;
        updateElementWidth(percent);
    }, [currentTime]);

    return (
        <div
            className="progress-bar"
            ref={barRef}
            onMouseDown={handleMouseDown}
        >
            <div className="rail">
                <Tooltip text={tooltipText} visible={draging}>
                    <div className="handle" />
                </Tooltip>
            </div>
            <div className="track" />
        </div>
    );
}

export default memo(ProgressBar);
