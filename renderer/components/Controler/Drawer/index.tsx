import styles from "./index.module.scss";
import { Portal, Icon } from "@/components";
import Playing from "./playing";
import { timeConvert } from "@/utils";
import { useAppDispatch, useAppSelector } from "@/utils/hooks";
import { play, removeItem, selectFiles } from '@/store/musicSlice';
import music from "@/utils/music";

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
                            <Icon
                                type="icon-delete"
                                className="item-delete"
                                onClick={(evt) => {
                                    evt.stopPropagation();
                                    dispatch(removeItem(index));
                                }}
                            />
                            <div title={item.name}>{item.name}</div>
                            <div>{timeConvert(item.duration)}</div>
                        </div>
                    ))}
                </div>
                <div className="table-footer">
                    <div className="item-add" onClick={() => dispatch(selectFiles(playlist.length !== 0))}>
                        <Icon type="icon-add" /> 添加歌曲
                    </div>
                </div>
            </div>
        </Portal>
    );
}

export default Drawer;
