import { mat4 } from "gl-matrix";

export default class Camera {
	fieldOfView: number;
	aspect: number;
	zNear: number;
	zFar: number;
	projectionMatrix: mat4;
	modelViewMatrix: mat4;

	constructor() {
		this.fieldOfView = (90 * Math.PI) / 180;
		this.aspect = window.innerWidth / window.innerHeight;
		this.zNear = 0.1;
		this.zFar = 100.0;
		this.projectionMatrix = mat4.create();
		this.modelViewMatrix = mat4.create();

		mat4.perspective(this.projectionMatrix, this.fieldOfView, this.aspect, this.zNear, this.zFar);
		mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0.0, 0.0, -6.0]);
	}
}
