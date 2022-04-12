import { memo } from "react";
import type { MouseEventHandler } from "react";

interface Props {
    type: string;
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
