import Scene from "./Scene";

export default class Engine {
	gl: WebGL2RenderingContext;
	scene: Scene;

	constructor(gl: WebGL2RenderingContext) {
		this.gl = gl;
		this.scene = new Scene();
	}

	update() {
		this.scene.render();
	}
}
