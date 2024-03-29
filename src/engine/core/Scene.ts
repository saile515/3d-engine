import Camera from "../objects/Camera";
import { CollisionHandler } from "./CollisionHandler";
import Mesh from "../components/Mesh";
import Object from "./Object";
import Shader from "../components/Shader";
import Skybox from "../objects/Skybox";
import readFile from "../utils/readFile";

export default class Scene {
	children: Object[];
	camera: Camera;
	collisionHandler: CollisionHandler;

	constructor() {
		this.children = [];
		this.camera = new Camera();
		this.collisionHandler = new CollisionHandler();
		this.add(this.camera);
		this.init();
	}

	private async init() {
		// Flip textures
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

		// Add skybox to scene
		const skybox = new Skybox();
		this.add(skybox);
	}

	update() {
		this.children.forEach((object) => object.update());

		this.collisionHandler.update(this.children);

		this.render();
	}

	private render() {
		// Prepare canvas for render
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		// Render each mesh
		this.children.forEach((object) => {
			// Use the shader program
			const shader = object.getComponent<Shader>(Shader);
			if (!shader || !shader.programInfo) return;
			gl.useProgram(shader.programInfo.program);

			const mesh = object.getComponent<Mesh>(Mesh);
			if (!mesh) return;
			mesh.render(shader.programInfo, this.camera);
		});
	}

	add(object: Object) {
		this.children.push(object);
	}
}
