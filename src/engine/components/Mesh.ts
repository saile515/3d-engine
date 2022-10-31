import Camera from "../core/Camera";
import Component from "../core/Component";
import { ProgramInfo } from "../core/Scene";
import { mat4 } from "gl-matrix";

export default class Mesh extends Component {
	vertices: number[];
	indices: number[];
	normals: number[];

	constructor(vertices: number[], indices: number[], normals: number[]) {
		super();
		this.vertices = vertices;
		this.indices = indices;
		this.normals = normals;
	}

	render(programInfo: ProgramInfo, camera: Camera) {
		const gl = globalThis.gl;

		// Create vertex buffer
		const vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.vertexAttribPointer(programInfo.attributes.vertexPosition, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(programInfo.attributes.vertexPosition);

		// Create index buffer
		const indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

		// Create normal buffer
		const normalBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
		gl.vertexAttribPointer(programInfo.attributes.vertexNormal, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(programInfo.attributes.vertexNormal);

		// Create matrices
		const modelMatrix = mat4.create();
		mat4.rotateY(modelMatrix, modelMatrix, (Math.PI / 180) * performance.now() * 0.1);
		//mat4.rotateX(modelMatrix, modelMatrix, (Math.PI / 180) * performance.now() * 0.1);

		const normalMatrix = mat4.create();
		mat4.multiply(normalMatrix, modelMatrix, camera.viewMatrix);
		mat4.invert(normalMatrix, normalMatrix);
		mat4.transpose(normalMatrix, normalMatrix);

		gl.uniformMatrix4fv(programInfo.uniforms.projectionMatrix, false, camera.projectionMatrix);
		gl.uniformMatrix4fv(programInfo.uniforms.viewMatrix, false, camera.viewMatrix);
		gl.uniformMatrix4fv(programInfo.uniforms.modelMatrix, false, modelMatrix);
		gl.uniformMatrix4fv(programInfo.uniforms.normalMatrix, false, normalMatrix);

		// Draw the mesh
		gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
	}
}
