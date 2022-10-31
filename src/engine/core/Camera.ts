import { mat4 } from "gl-matrix";

export default class Camera {
	fieldOfView: number;
	aspect: number;
	zNear: number;
	zFar: number;
	projectionMatrix: mat4;
	viewMatrix: mat4;

	constructor() {
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

		mat4.translate(this.viewMatrix, this.viewMatrix, [5.0, 0.0, -10.0]);
		//mat4.invert(this.viewMatrix, this.viewMatrix);
	}
}
