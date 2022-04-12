import styles from "./controler.module.scss";
import { useSetState } from "Utils/hooks";
import Left from "./Left";
import Middle from "./Middle";
import Right from "./Right";
import Drawer from "./Drawer";

export interface SongItem {
    path: string;
    name: string;
    duration: string;
}

export interface State {
    playingIndex: number;
    playlist: SongItem[];
    state: "playing" | "pause";
}

const initState: State = {
    playingIndex: 0,
    playlist: [],
    state: "pause",
};

function Controler() {
    const [state, setState] = useSetState<State>(
        JSON.parse(JSON.stringify(initState))
    );

    return (
        <footer className={styles.controler}>
            <Left />
            <Middle />
            <Right />
            {false && <Drawer />}
        </footer>
    );
}

export default Controler;
