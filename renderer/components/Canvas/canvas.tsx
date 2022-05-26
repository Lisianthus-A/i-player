import { useEffect, useRef, useState } from "react";
import { useInterval } from "Utils/hooks";
import music from "Utils/music";
import styles from "./canvas.module.scss";

function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [delay, setDelay] = useState<number | null>(15000);

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

    return (
        <main className={styles.canvas}>
            <canvas ref={canvasRef} />
        </main>
    );
}

export default Canvas;
