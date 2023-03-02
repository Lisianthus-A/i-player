// @ts-ignore
import butterchurn from "butterchurn";
// @ts-ignore
import butterchurnPresets from "butterchurn-presets";
import WebAudioTag from "webaudiotag.js";

class Music {
    tag: WebAudioTag;

    private source: AudioBufferSourceNode | null;
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
        this.tag = new WebAudioTag({
            fetchBuffer: window.electronAPI.readFile,
        });
        this.visualizer = null;
        this.presets = butterchurnPresets.getPresets();
        this.presetKeys = Object.keys(this.presets).filter(
            (key) => !this.shouldRemovedPresetKeys.hasOwnProperty(key)
        );
        this.renderId = 0;
        this.source = null;

        this.draw = this.draw.bind(this);
    }

    /* ============= 暴露方法 =============  */
    /**
     * 播放歌曲
     *
     * @param path 歌曲路径
     * @param offset 播放初始位置，默认为 0
     */
    async play(path: string, offset?: number): Promise<boolean> {
        const { visualizer } = this;

        this.stopDarw();
        if (this.source) {
            visualizer.disconnectAudio(this.source);
            this.source = null;
        }

        this.tag.src = path;
        const res = await this.tag.play(offset);

        if (visualizer && res) {
            this.source = this.tag.sourceNode;
            visualizer.connectAudio(this.source);
            this.draw();
        }

        return res;
    }

    /**
     * 暂停播放
     */
    pause() {
        this.stopDarw();
        return this.tag.pause();
    }

    /**
     * 设置可视化 canvas 容器
     */
    setCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
        const visualizer = butterchurn.createVisualizer(
            this.tag.ctx,
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
        // console.log("presetKey", key);
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
