import styles from "./index.module.scss";
import { Portal } from "Components/index";
import { useAppSelector } from "Utils/hooks";

function Drawer() {
    const playlistVisible = useAppSelector(
        (state) => state.music.playlistVisible
    );
    const playlist = useAppSelector((state) => state.music.playlist);
    console.log("playlist", playlist);

    if (!playlistVisible) {
        return null;
    }

    return (
        <Portal>
            <div className={styles.drawer}>playlist</div>
        </Portal>
    );
}

export default Drawer;
