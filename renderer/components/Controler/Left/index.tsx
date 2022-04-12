import styles from "./index.module.scss";
import { Icon } from "Components/index";

function Left() {
    return (
        <div className={styles.left}>
            <Icon type="icon-prev" className="button-prev" />
            <Icon type="icon-play" className="button-play" />
            <Icon type="icon-prev" className="button-next" />
        </div>
    );
}

export default Left;
