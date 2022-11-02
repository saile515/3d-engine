import Camera from "../objects/Camera";
import Mesh from "../components/Mesh";
import Object from "./Object";
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
		uSampler: WebGLUniformLocation | null;
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
		const gl = globalThis.gl;

		// Get shader code from public folder
		const vertCode = await readFile("/shaders/vertex/shader.vert");
		const fragCode = await readFile("/shaders/fragment/shader.frag");

		// Create a vertex shader
		const vertShader = gl.createShader(gl.VERTEX_SHADER)!;
		gl.shaderSource(vertShader, vertCode);
		gl.compileShader(vertShader);

		// Create fragment shader
		const fragShader = gl.createShader(gl.FRAGMENT_SHADER)!;
		gl.shaderSource(fragShader, fragCode);
		gl.compileShader(fragShader);

		// Create a shader program
		const shaderProgram = gl.createProgram()!;
		gl.attachShader(shaderProgram, vertShader);
		gl.attachShader(shaderProgram, fragShader);
		gl.linkProgram(shaderProgram);

		// Get memory locations for GPU communication
		this.programInfo = {
			program: shaderProgram,
			attributes: {
				vertexPosition: gl.getAttribLocation(shaderProgram, "vertexPosition"),
				vertexNormal: gl.getAttribLocation(shaderProgram, "vertexNormal"),
				texturePosition: gl.getAttribLocation(shaderProgram, "texturePosition"),
			},
			uniforms: {
				projectionMatrix: gl.getUniformLocation(shaderProgram, "projectionMatrix"),
				viewMatrix: gl.getUniformLocation(shaderProgram, "viewMatrix"),
				modelMatrix: gl.getUniformLocation(shaderProgram, "modelMatrix"),
				normalMatrix: gl.getUniformLocation(shaderProgram, "normalMatrix"),
				uSampler: gl.getUniformLocation(shaderProgram, "uSampler"),
			},
		};
	}

	update() {
		this.children.forEach((object) => object.update());

		this.render();
	}

	render() {
		if (!this.programInfo) return;
		const gl = globalThis.gl;

		// Prepare canvas for render
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		// Use the shader program
		gl.useProgram(this.programInfo!.program);

		// Render each mesh
		this.children.forEach((object) => {
			const mesh = object.getComponent<Mesh>(Mesh);
			if (!mesh) return;
			mesh.render(this.programInfo!, this.camera);
		});
	}

	add(object: Object) {
		this.children.push(object);
	}
}
