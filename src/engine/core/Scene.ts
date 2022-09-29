import Camera from "./Camera";
import Mesh from "../components/Mesh";
import Object from "./Object";
import { ProgramInfo } from "./shaders";
import Transform from "../components/Transform";

export default class Scene {
	children: Object[];
	shaderInfo: ProgramInfo | undefined;
	camera: Camera;

	constructor() {
		this.children = [];
		this.camera = new Camera();
	}

	update() {
		this.children.forEach((object) => object.update());

		this.render();
	}

	render() {
		if (!this.shaderInfo) return;

		const gl = globalThis.engine.gl;

		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clearDepth(1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		this.children.forEach((object) => {
			gl.useProgram(this.shaderInfo!.program);

			const mesh = object.getComponent<Mesh>(Mesh);
			const transform = object.getComponent<Transform>(Transform);
			if (!mesh) return;
			if (!transform) return;

			{
				const numComponents = 3;
				const type = gl.FLOAT;
				const normalize = false;
				const stride = 0;
				const offset = 0;
				gl.bindBuffer(gl.ARRAY_BUFFER, mesh.positionBuffer);
				gl.vertexAttribPointer(this.shaderInfo!.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
				gl.enableVertexAttribArray(this.shaderInfo!.attribLocations.vertexPosition);
			}

			{
				const numComponents = 3;
				const type = gl.FLOAT;
				const normalize = false;
				const stride = 0;
				const offset = 0;
				gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
				gl.vertexAttribPointer(this.shaderInfo!.attribLocations.vertexNormal, numComponents, type, normalize, stride, offset);
				gl.enableVertexAttribArray(this.shaderInfo!.attribLocations.vertexNormal);
			}

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);

			gl.uniformMatrix4fv(this.shaderInfo!.uniformLocations.projectionMatrix, false, this.camera.projectionMatrix);
			gl.uniformMatrix4fv(this.shaderInfo!.uniformLocations.modelViewMatrix, false, this.camera.modelViewMatrix);
			gl.uniformMatrix4fv(this.shaderInfo!.uniformLocations.positionMatrix, false, transform.matrix);
			gl.uniformMatrix4fv(this.shaderInfo!.uniformLocations.normalMatrix, false, mesh.normalMatrix);

			const vertexCount = mesh.indices.length;
			const type = gl.UNSIGNED_SHORT;
			const offset = 0;
			gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
		});
	}

	add(object: Object) {
		this.children.push(object);
	}
}
