import Object from "../core/Object";
import Transform from "../components/Transform";
import { mat4 } from "gl-matrix";

export default class Camera extends Object {
	fieldOfView: number;
	aspect: number;
	zNear: number;
	zFar: number;
	projectionMatrix: mat4;
	viewMatrix: mat4;

	constructor() {
		super();
		this.fieldOfView = (90 * Math.PI) / 180;
		this.aspect = window.innerWidth / window.innerHeight;
		this.zNear = 0.1;
		this.zFar = 100.0;
		this.projectionMatrix = mat4.create();
		this.viewMatrix = mat4.create();

		this.init();
	}

	init() {
		const gl = globalThis.gl;

		mat4.perspective(this.projectionMatrix, 45 * (Math.PI / 180), gl.canvas.width / gl.canvas.height, this.zNear, this.zFar);
	}

	update() {
		super.update();
		// Invert view matrix
		const transform = this.getComponent<Transform>(Transform);
		mat4.invert(this.viewMatrix, transform.matrix);
	}
}
