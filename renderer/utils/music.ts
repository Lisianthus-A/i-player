// @ts-ignore
import butterchurn from "butterchurn";
// @ts-ignore
import butterchurnPresets from "butterchurn-presets";
// import WebAudioTag from "./webaudiotag.js";

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
    private visualizer: any;
    private presets: Record<string, any>;
    private presetKeys: string[];
    private renderId: number;
    private shouldRemovedPresetKeys: Record<string, number> = {
        "Geiss - Spiral Artifact": 0,
        "Geiss + Flexi + Martin - disconnected": 0,
        "Geiss - Thumb Drum": 0,
        "Geiss, Flexi + Stahlregen - Thumbdrum Tokamak [crossfiring aftermath jelly mashup]": 0,
        "Geiss - Cauldron - painterly 2 (saturation remix)": 0,
        "Flexi, fishbrain, Geiss + Martin - tokamak witchery": 0,
        "Flexi - truly soft piece of software - this is generic texturing (Jelly) ": 0,
        "Flexi - infused with the spiral": 0,
        "Flexi - mindblob mix": 0,
        "Flexi - smashing fractals [acid etching mix]": 0,
        "Flexi + amandio c - piercing 05 - Kopie (2) - Kopie": 0,
        "Flexi - predator-prey-spirals": 0,
        "flexi - swing out on the spiral": 0,
        "flexi - mom, why the sky looks different today": 0,
        "Cope - The Neverending Explosion of Red Liquid Fire": 0,
        "cope + martin - mother-of-pearl": 0,
        "TonyMilkdrop - Leonardo Da Vinci's Balloon [Flexi - merry-go-round + techstyle]": 0,
        "Idiot - Star Of Annon": 0,
        "Zylot - Paint Spill (Music Reactive Paint Mix)": 0,
        "Rovastar - Oozing Resistance": 0,
        "suksma - uninitialized variabowl (hydroponic chronic)": 0,
        "Unchained & Rovastar - Wormhole Pillars (Hall of Shadows mix)": 0,
    };

    constructor() {
        this.audioContext = new AudioContext();
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
        this.currentSource = null;
        this.visualizer = null;
        this.presets = butterchurnPresets.getPresets();
        this.presetKeys = Object.keys(this.presets).filter((key) => !this.shouldRemovedPresetKeys.hasOwnProperty(key));
        this.onEnded = null;
        this.startTime = false;
        this.playingItem = { path: "", buffer: null };
        this.renderId = 0;

        this.draw = this.draw.bind(this);
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
        const {
            currentSource,
            audioContext,
            gainNode,
            playingItem,
            visualizer,
        } = this;
        // 当前状态为暂停
        // 恢复 Context 为播放状态
        if (audioContext.state === "suspended") {
            this.draw();
            this.restart();
            // 需要播放的歌曲与当前歌曲相同
            if (playingItem.path === path && offset === undefined) {
                return true;
            }
        }

        if (path !== playingItem.path) {
            playingItem.path = path;
            playingItem.buffer = null;
        }

        // 停止当前音频
        this.startTime = false;
        if (currentSource) {
            currentSource.onended = null;
            currentSource.stop(0);
            currentSource.disconnect();
        }
        this.stopDarw();

        // 获取歌曲的 AudioBuffer
        const musicBuffer = await this.getMusic(playingItem.path);
        if (!musicBuffer) {
            return false;
        }

        // 创建 Source
        const source = audioContext.createBufferSource();
        source.buffer = musicBuffer;
        source.connect(gainNode);
        this.currentSource = source;
        if (visualizer) {
            visualizer.connectAudio(source);
            audioContext.state !== "suspended" && this.draw();
        }

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
        this.stopDarw();
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

    /**
     * 设置可视化 canvas 容器
     */
    setCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
        const visualizer = butterchurn.createVisualizer(
            this.audioContext,
            canvas,
            {
                width,
                height,
                pixelRatio: window.devicePixelRatio || 1,
                textureRatio: 1,
            }
        );
        this.visualizer = visualizer;
        this.setRandomPreset(0);
    }

    /**
     * 设置随机 preset
     */
    setRandomPreset(blendTime = 5.7) {
        const { visualizer, presetKeys, presets } = this;
        const randomIndex = (Math.random() * presetKeys.length) >> 0;
        const key = presetKeys[randomIndex];
        console.log('presetKey', key);
        visualizer.loadPreset(presets[key], blendTime);
    }

    /**
     * 设置可视化宽高
     */
    setWH(width: number, height: number) {
        const { visualizer } = this;
        visualizer.setRendererSize(width, height);
    }

    /**
     * 开始绘制 canvas
     */
    draw() {
        const { visualizer } = this;
        visualizer.render();
        this.renderId = requestAnimationFrame(this.draw);
    }

    /**
     * 停止绘制 canvas
     */
    stopDarw() {
        cancelAnimationFrame(this.renderId);
    }
}

export default new Music();
