import styles from "./index.module.scss";
import ProgressBar from "./ProgressBar";
import Time from "./Time";

function Middle() {
    return (
        <div className={styles.middle}>
            <div className="title">Title</div>
            <ProgressBar />
            <Time />
        </div>
    );
}

export default Middle;
