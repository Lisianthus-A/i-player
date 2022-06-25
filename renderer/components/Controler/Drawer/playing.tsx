import styles from './playing.module.scss';

function Playing() {

    return (
        <div className={styles.playing}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
        </div>
    );
}

export default Playing;