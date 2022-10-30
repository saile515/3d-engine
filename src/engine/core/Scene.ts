import Camera from "./Camera";
import Object from "./Object";

export default class Scene {
	children: Object[];
	camera: Camera;

	constructor() {
		this.children = [];
		this.camera = new Camera();
	}

	update() {
		this.children.forEach((object) => object.update());

		this.render();
	}

	render() {
		const gl = globalThis.engine.gl;

		// Clear the canvas
		gl.clearColor(0.5, 0.5, 0.5, 0.9);

		// Enable the depth test
		gl.enable(gl.DEPTH_TEST);

		// Clear the color buffer bit
		gl.clear(gl.COLOR_BUFFER_BIT);

		// Set the view port
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	}

	add(object: Object) {
		this.children.push(object);
	}
}
