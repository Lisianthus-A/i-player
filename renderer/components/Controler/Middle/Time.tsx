import { timeConvert } from "@/utils";
import { useAppSelector } from "@/utils/hooks";

function Time() {
    const currentTime = useAppSelector((state) =>
        timeConvert(state.music.currentTime)
    );
    const duration = useAppSelector((state) =>
        timeConvert(state.music.playingItem?.duration || 0)
    );

    return (
        <div className="time">
            <span>{currentTime}</span>
            <span>{duration}</span>
        </div>
    );
}

export default Time;
