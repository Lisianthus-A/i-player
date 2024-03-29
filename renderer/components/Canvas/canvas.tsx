import { useEffect, useRef, useState } from "react";
import { useInterval } from "@/utils/hooks";
import { Icon } from "@/components";
import classNames from 'classnames';
import music from "@/utils/music";
import styles from "./canvas.module.scss";
import Mask from './mask';

function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const mainRef = useRef<HTMLDivElement | null>(null);
    const [delay, setDelay] = useState<number | null>(15000);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

    useInterval(() => {
        music.setRandomPreset();
        document.hidden && setDelay(null);
    }, delay);

    useEffect(() => {
        const elem = canvasRef.current;
        if (!elem) {
            return;
        }

        const { clientWidth, clientHeight } = elem;
        elem.width = clientWidth;
        elem.height = clientHeight;
        music.setCanvas(elem, clientWidth, clientHeight);
    }, []);

    useEffect(() => {
        const callback = () => {
            const elem = canvasRef.current;
            if (!elem) {
                return;
            }

            const { clientWidth, clientHeight } = elem;
            elem.width = clientWidth;
            elem.height = clientHeight;
            music.setWH(clientWidth, clientHeight);
        };

        window.addEventListener("resize", callback);
        return () => {
            window.removeEventListener("resize", callback);
        };
    }, []);

    useEffect(() => {
        const callback = () => {
            !document.hidden && setDelay(15000);
        };

        document.addEventListener("visibilitychange", callback);

        return () => {
            document.removeEventListener("visibilitychange", callback);
        };
    }, []);

    // fullscreen
    useEffect(() => {
        const elem = mainRef.current;
        if (!elem) {
            return;
        }

        const callback = () => setIsFullscreen((value) => !value);

        elem.addEventListener("fullscreenchange", callback);

        return () => {
            elem.removeEventListener("fullscreenchange", callback);
        }
    }, []);

    return (
        <main className={classNames(styles.canvas, {
            [styles.hide]: isFullscreen
        })} ref={mainRef}>
            <Mask />
            <Icon
                type="icon-fullscreen"
                className="fullscreen"
                onClick={() => {
                    const elem = mainRef.current;
                    if (!elem) {
                        return;
                    }
                    elem.requestFullscreen();
                }}
            />
            <canvas ref={canvasRef} />
        </main>
    );
}

export default Canvas;
