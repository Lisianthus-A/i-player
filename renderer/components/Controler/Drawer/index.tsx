import styles from "./index.module.scss";
import { Portal } from "Components/index";
import Playing from "./playing";
import { timeConvert } from "Utils/index";
import { useAppDispatch, useAppSelector } from "Utils/hooks";
import { play } from 'Store/musicSlice';
import music from "Utils/music";

function Drawer() {
    const dispatch = useAppDispatch();
    const playlistVisible = useAppSelector(
        (state) => state.music.playlistVisible
    );
    const playlist = useAppSelector((state) => state.music.playlist);
    const playingItem = useAppSelector((state) => state.music.playingItem);

    if (!playlistVisible) {
        return null;
    }

    return (
        <Portal>
            <div className={styles.drawer}>
                <div className="table-header">
                    <div>#</div>
                    <div>歌曲标题</div>
                    <div>时长</div>
                </div>
                <div className="table-body">
                    {playlist.map((item, index) => (
                        <div
                            className="item"
                            key={index}
                            onClick={() => {
                                dispatch(play({ item }));
                                music.setRandomPreset(0);
                            }}
                        >
                            {item === playingItem
                                ? <Playing />
                                : <div>{index + 1}</div>
                            }
                            <div title={item.name}>{item.name}</div>
                            <div>{timeConvert(item.duration)}</div>
                        </div>
                    ))}
                </div>
                <div className="table-footer"></div>
            </div>
        </Portal>
    );
}

export default Drawer;
