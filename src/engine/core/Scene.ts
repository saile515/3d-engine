import Camera from "../objects/Camera";
import Mesh from "../components/Mesh";
import Object from "./Object";
import Shader from "../components/Shader";
import Skybox from "../objects/Skybox";
import readFile from "../utils/readFile";

export interface ProgramInfo {
	program: WebGLProgram | null;
	attributes: {
		vertexPosition: number;
		vertexNormal: number;
		texturePosition: number;
	};
	uniforms: {
		projectionMatrix: WebGLUniformLocation | null;
		viewMatrix: WebGLUniformLocation | null;
		modelMatrix: WebGLUniformLocation | null;
		normalMatrix: WebGLUniformLocation | null;
		sampler: WebGLUniformLocation | null;
	};
}

export default class Scene {
	children: Object[];
	camera: Camera;
	programInfo: ProgramInfo | undefined;

	constructor() {
		this.children = [];
		this.camera = new Camera();
		this.add(this.camera);
		this.init();
	}

	async init() {
		// Flip textures
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

		// Add skybox to scene
		const skybox = new Skybox();
		const vertCode = await readFile("/shaders/vertex/shader.vert");
		const fragCode = await readFile("/shaders/fragment/skyboxShader.frag");
		const shader = new Shader(vertCode, fragCode);
		skybox.addComponent(shader);
		this.add(skybox);
	}

	update() {
		this.children.forEach((object) => object.update());

		this.render();
	}

	render() {
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
