import InputHandler from "../input/InputHandler";
import Scene from "./Scene";
import Vector2 from "./Vector2";

export default class Engine {
	scene: Scene;
	inputHandler: InputHandler;
	private perfBuffer: number[];
	deltaTime: number;
	fps: number;

	constructor() {
		this.scene = new Scene();
		this.inputHandler = new InputHandler();
		this.perfBuffer = [];
		this.fps = 0;
	}

	update() {
		this.scene.update();

		// Calculate fps and delta time
		const perf = performance.now();

		this.deltaTime = (perf - this.perfBuffer[this.perfBuffer.length - 1]) / 1000;

		// Stores the last 60 frames in array and calculate average difference
		this.perfBuffer.push(perf);
		if (this.perfBuffer.length > 60) this.perfBuffer.shift();
		this.fps = Math.floor(
			1000 / ((this.perfBuffer[this.perfBuffer.length - 1] - this.perfBuffer[0]) / 60)
		);
	}

	clean() {
		// Reset mouse delta
		this.inputHandler.mouseDelta = new Vector2(0, 0);
	}
}
