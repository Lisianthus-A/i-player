import { memo } from "react";
import type { MouseEventHandler } from "react";

type IconType =
    | "icon-add"
    | "icon-delete"
    | "icon-fullscreen"
    | "icon-return-size"
    | "icon-mute"
    | "icon-cycle"
    | "icon-random"
    | "icon-single-cycle"
    | "icon-pause"
    | "icon-prev"
    | "icon-list"
    | "icon-play"
    | "icon-voice"
    | "icon-maximize"
    | "icon-minimize"
    | "icon-close";
interface Props {
    type: IconType;
    onClick?: MouseEventHandler<SVGSVGElement>;
    className?: string;
}

function Icon({ type, onClick, className }: Props) {
    return (
        <svg
            className={className}
            onClick={onClick}
            width="1em"
            height="1em"
            fill="currentColor"
        >
            <use xlinkHref={`#${type}`} />
        </svg>
    );
}

export default memo(Icon);
