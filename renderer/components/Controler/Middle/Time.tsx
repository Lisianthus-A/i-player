import { useState } from "react";
import { timeConvert } from "Utils/index";
import { useInterval } from "Utils/hooks";
import music from "Utils/music";

interface Props {
    duration: string;
}

function Time({ duration }: Props) {
    const [currentTime, setCurrentTime] = useState<string>("00:00");

    useInterval(() => {
        const time = music.getCurrentTime();
        setCurrentTime(timeConvert(time));
    }, 300);

    return (
        <div className="time">
            <span>{currentTime}</span>
            <span>{duration}</span>
        </div>
    );
}

export default Time;
