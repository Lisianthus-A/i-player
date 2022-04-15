import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useInterval } from "Utils/hooks";
import music from "Utils/music";
import { timeConvert } from "Utils/index";
import type { MouseEvent } from "react";

interface Props {
    duration: string;
    onSetPlaying: () => void;
}

function ProgressBar({ duration, onSetPlaying }: Props) {
    const barRef = useRef<HTMLDivElement | null>(null);
    const tipRef = useRef<HTMLDivElement | null>(null);
    const durationNum = useMemo(() => {
        const [min, sec] = duration.split(":");
        return parseInt(min) * 60 + parseInt(sec);
    }, [duration]);

    const [progress, setProgress] = useState<number>(0);
    const [tipVisible, setTipVisible] = useState<boolean>(false);

    const handleMouseDown = (evt: MouseEvent) => {
        if (evt.button !== 0 || durationNum === 0) {
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

        tip.textContent = timeConvert(percent * durationNum);
        setProgress(percent * 100);
    };

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
        tip.textContent = timeConvert(percent * durationNum);
        setProgress(percent * 100);
    };

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

        setProgress(percent * 100);
        music.play(undefined, percent * durationNum);
        onSetPlaying();
    };

    useInterval(
        () => {
            if (durationNum === 0) {
                return;
            }
            const currentTime = music.getCurrentTime();
            const currentProgress = (currentTime / durationNum) * 100;
            setProgress(currentProgress);
        },
        tipVisible ? null : 400
    );

    useEffect(() => {
        const bar = barRef.current;
        if (!bar) {
            return;
        }

        bar.style.setProperty("--rail-width", `${progress}%`);
        bar.style.setProperty("--track-width", `${100 - progress}%`);
    }, [progress]);

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
