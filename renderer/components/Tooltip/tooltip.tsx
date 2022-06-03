import { useCallback, useEffect, useRef, useState } from "react";
import { Portal } from "Components/index";
import styles from "./tooltip.module.scss";
import type { ReactElement } from "react";

interface Props {
    wrapClassName?: string;
    visible?: boolean;
    text: string;
    children: ReactElement;
    onClick?: () => void;
}

function Tooltip({
    wrapClassName,
    visible: propsVisible,
    text,
    children,
    onClick,
}: Props) {
    const elemRef = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState<boolean>(false);
    const [position, setPosition] = useState<{ left: number; top: number }>({
        left: 0,
        top: 0,
    });

    const updatePosition = useCallback(() => {
        const elem = elemRef.current;
        if (!elem) {
            return;
        }

        setTimeout(() => {
            const { x, y, width } = elem.children[0].getBoundingClientRect();
            setPosition({
                left: x + width / 2,
                top: y - 40,
            });
        });
    }, []);

    const handleMouseEnter = () => {
        setVisible(true);
    };

    const handleMouseLeave = () => {
        setVisible(false);
    };

    const isVisible = propsVisible === undefined ? visible : propsVisible;
    useEffect(() => {
        updatePosition();

        if (isVisible) {
            window.addEventListener("mousemove", updatePosition);
            window.addEventListener("mousedown", updatePosition);

            return () => {
                window.removeEventListener("mousemove", updatePosition);
                window.removeEventListener("mousedown", updatePosition);
            };
        }
    }, [isVisible]);

    const { left, top } = position;

    return (
        <div
            className={wrapClassName}
            ref={elemRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
        >
            {children}

            {isVisible && (
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
