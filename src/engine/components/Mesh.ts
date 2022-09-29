import * as VecMath from "../utils/VecMath";

import Component from "../core/Component";
import Vector3 from "../core/Vector3";
import VectorToArray from "../utils/VectorToArray";
import { mat4 } from "gl-matrix";

export default class Mesh extends Component {
	vertices: Vector3[];
	indices: number[];
	normals: Vector3[];
	positionBuffer: WebGLBuffer | null;
	indexBuffer: WebGLBuffer | null;
	normalBuffer: WebGLBuffer | null;
	normalMatrix: mat4;

	constructor(vertices: Vector3[], indices: number[], normals: Vector3[]) {
		super();
		this.vertices = vertices;
		this.indices = indices;
		this.normals = normals;
		this.positionBuffer = globalThis.engine.gl.createBuffer();
		this.indexBuffer = globalThis.engine.gl.createBuffer();
		this.normalBuffer = globalThis.engine.gl.createBuffer();
		this.normalMatrix = mat4.create();

		this.init();
	}

	init() {
		const gl = globalThis.engine.gl;

		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, VectorToArray(this.vertices), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, VectorToArray(this.normals), gl.STATIC_DRAW);

		//this.calculateNormals();

		mat4.invert(this.normalMatrix, globalThis.engine.scene.camera.modelViewMatrix);
		mat4.transpose(this.normalMatrix, this.normalMatrix);
	}

	calculateNormals() {
		this.normals = [];
		for (let i = 0; i < this.vertices.length / 3; i++) {
			const crossProduct = VecMath.cross(VecMath.subtract(this.vertices[i + 1], this.vertices[i]), VecMath.subtract(this.vertices[i + 2], this.vertices[i]));
			const mag = VecMath.magnitude(crossProduct);
			const normal = VecMath.divide(crossProduct, mag);
			this.normals.push(normal);
			this.normals.push(normal);
			this.normals.push(normal);
		}

		const gl = globalThis.engine.gl;

		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, VectorToArray(this.normals), gl.STATIC_DRAW);
	}
}
