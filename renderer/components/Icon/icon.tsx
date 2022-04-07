import { memo } from "react";
import type { MouseEventHandler } from "react";

interface Props {
    type: string;
    onClick?: MouseEventHandler<SVGSVGElement>;
    className?: string;
}

function Icon({ type, onClick, className }: Props) {
    return (
        <svg className={className} onClick={onClick}>
            <use xlinkHref={`#${type}`} />
        </svg>
    );
}

export default memo(Icon);
