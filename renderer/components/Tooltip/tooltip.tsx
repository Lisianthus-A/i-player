import { useEffect, useRef, useState } from "react";
import { Portal } from "Components/index";
import styles from "./tooltip.module.scss";
import type { ReactElement } from "react";

interface Props {
    wrapClassName?: string;
    text: string;
    children: ReactElement;
    onClick?: () => void;
}

function Tooltip({ wrapClassName, text, children, onClick }: Props) {
    const elemRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState<boolean>(false);
    const [position, setPosition] = useState<{ left: number; top: number }>({
        left: 0,
        top: 0,
    });

    useEffect(() => {
        const elem = elemRef.current;
        if (!elem) {
            return;
        }

        const { x, y, width } = elem.getBoundingClientRect();
        setPosition({
            left: x + width / 2,
            top: y - 40,
        });
    }, []);

    const { left, top } = position;

    return (
        <div
            className={wrapClassName}
            ref={elemRef}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            onClick={onClick}
        >
            {children}

            {visible && (
                <Portal>
                    <div className={styles.tips} style={{ left, top }}>
                        {text}
                    </div>
                </Portal>
            )}
        </div>
    );
}

export default Tooltip;
