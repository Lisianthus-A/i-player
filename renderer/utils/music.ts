export interface MusicItem {
    path: string;
    buffer: AudioBuffer | null;
}

class Music {
    // 播放结束的回调
    private onEnded: (() => void) | null;
    // 开始时间，用于计算当前播放时长
    private startTime: number | false;
    // 当前播放的歌曲
    private playingItem: MusicItem;

    private audioContext: AudioContext;
    private gainNode: GainNode;
    private currentSource: AudioBufferSourceNode | null;

    constructor() {
        this.audioContext = new AudioContext();
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
        this.currentSource = null;
        this.onEnded = null;
        this.startTime = false;
        this.playingItem = { path: "", buffer: null };
    }

    /**
     * 获取指定 path 歌曲的 AudioBuffer
     */
    private async getMusic(path: string): Promise<AudioBuffer | null> {
        const { audioContext, playingItem } = this;
        // path 为当前播放的歌曲
        if (playingItem.path === path && playingItem.buffer) {
            return playingItem.buffer;
        }

        const arrayBuffer = await window.electronAPI.readFile(path);
        if (!arrayBuffer) {
            return null;
        }

        const audioBuffer = await audioContext.decodeAudioData(
            arrayBuffer.slice(0)
        );
        if (playingItem.path === path) {
            playingItem.buffer = audioBuffer;
            return audioBuffer;
        }

        return null;
    }

    /**
     * 恢复播放
     */
    private async restart(): Promise<boolean> {
        await this.audioContext.resume();
        return true;
    }

    /* ============= 暴露方法 =============  */
    /**
     * 播放歌曲
     *
     * @param path 歌曲路径
     * @param offset 播放初始位置，默认为 0
     */
    async play(path: string, offset?: number): Promise<boolean> {
        const { currentSource, audioContext, gainNode, playingItem } = this;
        // 当前状态为暂停
        // 恢复 Context 为播放状态
        if (audioContext.state === "suspended") {
            this.restart();
            // 需要播放的歌曲与当前歌曲相同
            if (playingItem.path === path && offset === undefined) {
                return true;
            }
        }

        playingItem.path = path;
        playingItem.buffer = null;

        // 停止当前音频
        this.startTime = false;
        if (currentSource) {
            currentSource.onended = null;
            currentSource.stop(0);
            currentSource.disconnect();
        }

        // 获取歌曲的 AudioBuffer
        const musicBuffer = await this.getMusic(path);
        if (!musicBuffer) {
            return false;
        }

        // 创建 Source
        const source = audioContext.createBufferSource();
        source.buffer = musicBuffer;
        source.connect(gainNode);
        this.currentSource = source;

        // 播放
        this.startTime = audioContext.currentTime - (offset || 0);
        source.start(audioContext.currentTime, offset || 0);

        // 设置播放结束的回调
        source.onended = () => {
            this.startTime = false;
            this.onEnded && this.onEnded();
        };

        return true;
    }

    /**
     * 暂停播放
     */
    async pause(): Promise<boolean> {
        await this.audioContext.suspend();
        return true;
    }

    /**
     * 设置音量
     * @param value 音量 0 ~ 1 的数字
     */
    setVolume(value: number): void {
        this.gainNode.gain.value = value;
    }

    /**
     * 设置播放结束时的回调函数
     * @param callback 回调函数
     */
    setOnEnded(callback: () => void) {
        this.onEnded = callback;
    }

    /**
     * 获取当前播放时长
     */
    getCurrentTime(): number {
        const { audioContext, startTime } = this;
        return startTime !== false ? audioContext.currentTime - startTime : 0;
    }
}

export default new Music();
