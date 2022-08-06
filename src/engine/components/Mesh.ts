import Component from "../core/Component";
import Vector3 from "../core/Rendering/Vector3";

export default class Mesh extends Component {
	vertices: Vector3[];

	constructor(vertices: Vector3[]) {
		super();
		this.vertices = vertices;

		const gl = globalThis.engine.gl;

		const positionBuffer = gl.createBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, this.asFloat32Array(), gl.STATIC_DRAW);
	}

	asFloat32Array() {
		let positions: number[] = [];
		this.vertices.forEach((vertex) => (positions = [...positions, ...vertex.asArray()]));
		return new Float32Array(positions);
	}
}
