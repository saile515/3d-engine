import { mat4 } from "gl-matrix";

export default class Camera {
	fieldOfView: number;
	aspect: number;
	zNear: number;
	zFar: number;

	constructor() {
		this.fieldOfView = (90 * Math.PI) / 180;
		this.aspect = window.innerWidth / window.innerHeight;
		this.zNear = 0.1;
		this.zFar = 100.0;
	}
}
