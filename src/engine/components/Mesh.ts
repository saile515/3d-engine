import Camera from "../objects/Camera";
import Component from "../core/Component";
import { ProgramInfo } from "../core/Scene";
import Texture from "./Texture";
import Transform from "./Transform";
import { mat4 } from "gl-matrix";

export default class Mesh extends Component {
	vertices: number[];
	indices: number[];
	normals: number[];
	textures: number[];
	private modelMatrix: mat4;
	private normalMatrix: mat4;

	constructor(vertices: number[], indices: number[], normals: number[], textures: number[]) {
		super();
		this.vertices = vertices;
		this.indices = indices;
		this.normals = normals;
		this.textures = textures;

		this.initMatrices();
	}

	initMatrices() {
		this.modelMatrix = mat4.create();
		this.normalMatrix = mat4.create();
	}

	render(programInfo: ProgramInfo, camera: Camera) {
		// Update model matrix
		const transform = this.parent.getComponent<Transform>(Transform);
		this.modelMatrix = transform.matrix;

		// Update normal matrix
		mat4.multiply(this.normalMatrix, this.modelMatrix, globalThis.engine.scene.camera.viewMatrix);
		mat4.invert(this.normalMatrix, this.normalMatrix);
		mat4.transpose(this.normalMatrix, this.normalMatrix);

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

		// Create texture buffer
		const textureBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textures), gl.STATIC_DRAW);
		gl.vertexAttribPointer(programInfo.attributes.texturePosition, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(programInfo.attributes.texturePosition);

		// Bind texture
		const texture = this.parent.getComponent<Texture>(Texture);
		if (texture) {
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture.texture);
			gl.uniform1i(programInfo.uniforms.uSampler, 0);
		}

		gl.uniformMatrix4fv(programInfo.uniforms.projectionMatrix, false, camera.projectionMatrix);
		gl.uniformMatrix4fv(programInfo.uniforms.viewMatrix, false, camera.viewMatrix);
		gl.uniformMatrix4fv(programInfo.uniforms.modelMatrix, false, this.modelMatrix);
		gl.uniformMatrix4fv(programInfo.uniforms.normalMatrix, false, this.normalMatrix);

		// Draw the mesh
		gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
	}
}
