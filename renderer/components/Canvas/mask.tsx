import styles from './mask.module.scss';
import { Icon } from "Components/index";
import { selectFiles } from "Store/musicSlice";
import { useAppDispatch, useAppSelector } from "Utils/hooks";

function Mask() {
    const dispatch = useAppDispatch();
    const initialized = useAppSelector(state => state.music.initialized);

    if (initialized) {
        return null;
    }

    return (
        <div className={styles.mask}>
            <div className="note-1">&#9835; &#9833;</div>
            <div className="note-2">&#9833;</div>
            <div className="note-3">&#9839; &#9834;</div>
            <div className="note-4">&#9834;</div>
            <Icon
                type="icon-play"
                className="mask-icon"
                onClick={() => dispatch(selectFiles())}
            />
        </div>
    );
}

export default Mask;