import { mat4 } from "gl-matrix";

export default class Vector3 {
	x: number;
	y: number;
	z: number;
	matrix: mat4;

	constructor(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.matrix = mat4.create();
	}

	asArray() {
		return [this.x, this.y, this.z] as const;
	}

	set(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;

		mat4.fromTranslation(this.matrix, this.asArray());
	}

	setX(x: number) {
		this.x = x;

		mat4.fromTranslation(this.matrix, this.asArray());
	}

	setY(y: number) {
		this.y = y;

		mat4.fromTranslation(this.matrix, this.asArray());
	}

	setZ(z: number) {
		this.z = z;

		mat4.fromTranslation(this.matrix, this.asArray());
	}
}
