import Shader from "../components/Shader";
import Vector3 from "../core/Vector3";
import readFile from "./readFile";

export default class LineRenderer {
	vertices: Vector3[];
	shader: Shader;

	constructor(vertices: Vector3[]) {
		this.vertices = vertices;
		this.init();
	}

	async init() {
		const vertCode = await readFile("/shaders/vertex/line.vert");
		const fragCode = await readFile("/shaders/fragment/line.frag");
		this.shader = new Shader(vertCode, fragCode);
	}

	render() {
		if (!this.shader) return;

		gl.useProgram(this.shader.program);

		const programInfo = this.shader.programInfo;
		const camera = engine.scene.camera;

		// Create vertex buffer
		const vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices.flatMap((vertex) => vertex.asArray())), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.vertexAttribPointer(programInfo.attributes.vertexPosition, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(programInfo.attributes.vertexPosition);

		gl.uniformMatrix4fv(programInfo.uniforms.projectionMatrix, false, camera.projectionMatrix);
		gl.uniformMatrix4fv(programInfo.uniforms.viewMatrix, false, camera.viewMatrix);

		gl.lineWidth(1);

		gl.drawArrays(gl.LINE_STRIP, 0, this.vertices.length);
	}
}
