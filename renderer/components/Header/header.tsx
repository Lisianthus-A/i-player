import styles from "./header.module.scss";
import { Icon } from "../index";
import { useAppSelector } from "Utils/hooks";

function Header() {
    const playingItem = useAppSelector((state) => state.music.playingItem);
    const title = playingItem ? playingItem.name : "Title";

    return (
        <header className={styles.header}>
            <img className="favicon" src="./favicon.ico" />
            <div className="title">{title}</div>
            <Icon
                type="icon-minimize"
                className="icon"
                onClick={window.electronAPI.minimize}
            />
            <Icon
                type="icon-maximize"
                className="icon icon-maximize"
                onClick={() => {
                    window.electronAPI.toggleMaximize();
                }}
            />
            <Icon
                type="icon-return-size"
                className="icon icon-unmaximize"
                onClick={() => {
                    window.electronAPI.toggleMaximize();
                }}
            />
            <Icon
                type="icon-close"
                className="icon icon-close"
                onClick={window.electronAPI.hide}
            />
        </header>
    );
}

export default Header;
