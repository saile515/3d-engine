import { Dispatch, SetStateAction } from "react";

import Engine from "./core/Engine";
import Mesh from "./components/Mesh";
import MeshFromOBJ from "./utils/MeshFromOBJ";
import Object from "./core/Object";
import { UIState } from "../App";
import { mat4 } from "gl-matrix";
import readFile from "./utils/readFile";

function resizeCanvas(canvas: HTMLCanvasElement) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

declare global {
	var engine: Engine;
}

export default async function Init(setUiState?: Dispatch<SetStateAction<UIState>>) {
	const canvas = document.querySelector("#glCanvas") as HTMLCanvasElement;
	resizeCanvas(canvas);
	window.onresize = () => resizeCanvas(canvas);

	// Initialize the GL context
	const gl = canvas.getContext("webgl2")!;

	if (!gl) throw new Error("Could not initialize WebGL!");

	// Only continue if WebGL is available and working
	if (gl === null) {
		alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		return;
	}

	globalThis.engine = new Engine(gl);

	const obj = new Object();
	const mesh = await MeshFromOBJ("/models/cube.obj");
	obj.addComponent(mesh);

	const vertCode = await readFile("/shaders/vertex/shader.vert");
	const fragCode = await readFile("/shaders/fragment/shader.frag");

	const vertex_buffer = gl.createBuffer();

	// Bind appropriate array buffer to it
	gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

	// Pass the vertex data to the buffer
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices.flatMap((vertex) => vertex.asArray())), gl.STATIC_DRAW);

	// Unbind the buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	// Create an empty buffer object to store Index buffer
	const index_Buffer = gl.createBuffer();

	// Bind appropriate array buffer to it
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_Buffer);

	// Pass the vertex data to the buffer
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);

	// Unbind the buffer
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

	/*================ Shaders ====================*/

	// Create a vertex shader object
	const vertShader = gl.createShader(gl.VERTEX_SHADER)!;

	// Attach vertex shader source code
	gl.shaderSource(vertShader, vertCode);

	// Compile the vertex shader
	gl.compileShader(vertShader);

	// Create fragment shader object
	const fragShader = gl.createShader(gl.FRAGMENT_SHADER)!;

	// Attach fragment shader source code
	gl.shaderSource(fragShader, fragCode);

	// Compile the fragment shader
	gl.compileShader(fragShader);

	// Create a shader program object to store
	// the combined shader program
	const shaderProgram = gl.createProgram()!;

	// Attach a vertex shader
	gl.attachShader(shaderProgram, vertShader);

	// Attach a fragment shader
	gl.attachShader(shaderProgram, fragShader);

	// Link both the programs
	gl.linkProgram(shaderProgram);

	const programInfo = {
		program: shaderProgram,
		attributes: {
			vertexPosition: gl.getAttribLocation(shaderProgram, "vertexPosition"),
		},
		uniforms: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, "projectionMatrix"),
			cameraMatrix: gl.getUniformLocation(shaderProgram, "cameraMatrix"),
			modelMatrix: gl.getUniformLocation(shaderProgram, "modelMatrix"),
		},
	};

	// Use the combined shader program object
	gl.useProgram(shaderProgram);

	/*======= Associating shaders to buffer objects =======*/

	// Bind vertex buffer object
	gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

	// Bind index buffer object
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_Buffer);

	// Point an attribute to the currently bound VBO
	gl.vertexAttribPointer(programInfo.attributes.vertexPosition, 3, gl.FLOAT, false, 0, 0);

	// Enable the attribute
	gl.enableVertexAttribArray(programInfo.attributes.vertexPosition);

	const startTime = performance.now();

	function update() {
		engine.update();
		const time = performance.now();

		const projectionMatrix = mat4.create();
		mat4.perspective(projectionMatrix, 45 * (Math.PI / 180), gl.canvas.width / gl.canvas.height, 0.1, 1000);

		const cameraMatrix = mat4.create();
		mat4.translate(cameraMatrix, cameraMatrix, [5.0, 0.0, 10.0]);
		mat4.invert(cameraMatrix, cameraMatrix);

		const modelMatrix = mat4.create();
		mat4.rotateY(modelMatrix, modelMatrix, (Math.PI / 180) * time * 0.1);
		mat4.rotateX(modelMatrix, modelMatrix, (Math.PI / 180) * time * 0.1);

		gl.uniformMatrix4fv(programInfo.uniforms.projectionMatrix, false, projectionMatrix);
		gl.uniformMatrix4fv(programInfo.uniforms.cameraMatrix, false, cameraMatrix);
		gl.uniformMatrix4fv(programInfo.uniforms.modelMatrix, false, modelMatrix);

		// Draw the triangle
		gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);

		if (setUiState) setUiState({ fps: engine.fps });
		requestAnimationFrame(update);
	}

	update();
}
