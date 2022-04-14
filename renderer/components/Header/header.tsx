import styles from "./header.module.scss";
import { Icon } from "../index";

function Header() {
    return (
        <header className={styles.header}>
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
                onClick={window.electronAPI.exit}
            />
        </header>
    );
}

export default Header;
