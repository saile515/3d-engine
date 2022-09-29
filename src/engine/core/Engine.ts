import Scene from "./Scene";
import loadShaders from "./shaders";

export default class Engine {
	gl: WebGL2RenderingContext;
	scene: Scene;
	private perfBuffer: number[];
	fps: number;

	constructor(gl: WebGL2RenderingContext) {
		this.gl = gl;
		this.scene = new Scene();
		this.perfBuffer = [];
		this.fps = 0;

		this.init();
	}

	private async init() {
		this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		const programInfo = loadShaders(this.gl);

		if (!programInfo) {
			throw new Error("Shaders failed to init");
		}

		this.scene.shaderInfo = await programInfo;
	}

	update() {
		this.scene.update();

		const perf = performance.now();
		this.perfBuffer.push(perf);
		if (this.perfBuffer.length > 60) this.perfBuffer.shift();
		this.fps = Math.floor(1000 / ((this.perfBuffer[this.perfBuffer.length - 1] - this.perfBuffer[0]) / 60));
	}
}
