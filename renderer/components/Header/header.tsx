import styles from "./header.module.scss";
import { Icon } from "../index";
import { useState } from "react";

function Header() {
    const [isMax, setIsMax] = useState<boolean>(false);

    return (
        <div className={styles.header}>
            <Icon
                type="icon-minimize"
                className="icon"
                onClick={window.electronAPI.minimize}
            />
            <Icon
                type={isMax ? "icon-return-size" : "icon-maximize"}
                className="icon icon-maximize"
                onClick={() => {
                    setIsMax(!isMax);
                    window.electronAPI.toggleMaximize();
                }}
            />
            <Icon
                type="icon-close"
                className="icon icon-close"
                onClick={window.electronAPI.exit}
            />
        </div>
    );
}

export default Header;
