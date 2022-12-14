import Camera from "../objects/Camera";
import Component from "../core/Component";
import Material from "./Material";
import { ProgramInfo } from "./Shader";
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
		this.modelMatrix = mat4.create();
		this.normalMatrix = mat4.create();
	}

	render(programInfo: ProgramInfo, camera: Camera) {
		// Update model matrix
		const transform = this.parent.getComponent<Transform>(Transform);
		this.modelMatrix = transform.matrix;

		// Update normal matrix
		mat4.multiply(this.normalMatrix, this.modelMatrix, engine.scene.camera.viewMatrix);
		mat4.invert(this.normalMatrix, this.normalMatrix);
		mat4.transpose(this.normalMatrix, this.normalMatrix);

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

		const texture = this.parent.getComponent<Texture>(Texture);

		if (texture) {
			// Create texture buffer
			const textureBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textures), gl.STATIC_DRAW);
			gl.vertexAttribPointer(programInfo.attributes.texturePosition, 2, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(programInfo.attributes.texturePosition);

			// Bind texture
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture.texture);
			gl.uniform1i(programInfo.uniforms.sampler, 0);
		}

		const material = this.parent.getComponent<Material>(Material);

		if (!texture && material) {
			// Generate color array
			const colorArray = [];
			for (let i = 0; i < this.indices.length; i++) {
				colorArray.push(material.color.asArray());
			}

			// Create material buffer
			const materialBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, materialBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorArray.flat()), gl.STATIC_DRAW);
			gl.vertexAttribPointer(programInfo.attributes.vertexColor, 3, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(programInfo.attributes.vertexColor);
		}

		gl.uniformMatrix4fv(programInfo.uniforms.projectionMatrix, false, camera.projectionMatrix);
		gl.uniformMatrix4fv(programInfo.uniforms.viewMatrix, false, camera.viewMatrix);
		gl.uniformMatrix4fv(programInfo.uniforms.modelMatrix, false, this.modelMatrix);
		gl.uniformMatrix4fv(programInfo.uniforms.normalMatrix, false, this.normalMatrix);

		// Draw the mesh
		gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
	}
}
