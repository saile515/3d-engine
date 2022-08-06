import Camera from "./Camera";
import Mesh from "../components/Mesh";
import Object from "./Object";
import { ProgramInfo } from "./shaders";
import { mat4 } from "gl-matrix";

export default class Scene {
	children: Object[];
	shaderInfo: ProgramInfo | undefined;
	camera: Camera;

	constructor() {
		this.children = [];
		this.camera = new Camera();
	}

	render() {
		if (!this.shaderInfo) return;

		const gl = globalThis.engine.gl;

		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clearDepth(1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		let vertexCount = 0;
		this.children.forEach((object) => {
			gl.useProgram(this.shaderInfo!.program);

			{
				const numComponents = 3;
				const type = gl.FLOAT;
				const normalize = false;
				const stride = 0;
				const offset = 0;
				gl.vertexAttribPointer(this.shaderInfo!.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
				gl.enableVertexAttribArray(this.shaderInfo!.attribLocations.vertexPosition);
			}

			gl.uniformMatrix4fv(this.shaderInfo!.uniformLocations.projectionMatrix, false, this.camera.projectionMatrix);
			gl.uniformMatrix4fv(this.shaderInfo!.uniformLocations.modelViewMatrix, false, this.camera.modelViewMatrix);
			gl.uniformMatrix4fv(this.shaderInfo!.uniformLocations.positionMatrix, false, object.position.matrix);

			const mesh = object.getComponent<Mesh>(Mesh);
			if (!mesh) return;

			vertexCount += mesh.vertices.length;
			gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
		});
	}

	add(object: Object) {
		this.children.push(object);
	}
}
