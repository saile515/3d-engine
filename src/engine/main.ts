import { Dispatch, SetStateAction } from "react";

import Engine from "./core/Engine";
import MeshFromOBJ from "./utils/MeshFromOBJ";
import Object from "./core/Object";
import { UIState } from "../App";
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

	const vertCode = await readFile("/shaders/vertex/shader.vert");
	const fragCode = await readFile("/shaders/fragment/shader.frag");

	console.log(process.env.PUBLIC_URL);

	const startTime = performance.now();

	function update() {
		engine.update();

		var vertex_buffer = gl.createBuffer();

		// Bind appropriate array buffer to it
		gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

		// Pass the vertex data to the buffer
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices.flatMap((vertex) => vertex.asArray())), gl.STATIC_DRAW);

		// Unbind the buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		// Create an empty buffer object to store Index buffer
		var index_Buffer = gl.createBuffer();

		// Bind appropriate array buffer to it
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_Buffer);

		// Pass the vertex data to the buffer
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);

		// Unbind the buffer
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

		/*================ Shaders ====================*/

		// Create a vertex shader object
		var vertShader = gl.createShader(gl.VERTEX_SHADER)!;

		// Attach vertex shader source code
		gl.shaderSource(vertShader, vertCode);

		// Compile the vertex shader
		gl.compileShader(vertShader);

		// Create fragment shader object
		var fragShader = gl.createShader(gl.FRAGMENT_SHADER)!;

		// Attach fragment shader source code
		gl.shaderSource(fragShader, fragCode);

		// Compile the fragment shader
		gl.compileShader(fragShader);

		// Create a shader program object to store
		// the combined shader program
		var shaderProgram = gl.createProgram()!;

		// Attach a vertex shader
		gl.attachShader(shaderProgram, vertShader);

		// Attach a fragment shader
		gl.attachShader(shaderProgram, fragShader);

		// Link both the programs
		gl.linkProgram(shaderProgram);

		console.log(vertCode, fragCode);

		// Use the combined shader program object
		gl.useProgram(shaderProgram);

		/*======= Associating shaders to buffer objects =======*/

		// Bind vertex buffer object
		gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

		// Bind index buffer object
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_Buffer);

		// Get the attribute location
		var coord = gl.getAttribLocation(shaderProgram, "vertexPosition");

		// Point an attribute to the currently bound VBO
		gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

		// Enable the attribute
		gl.enableVertexAttribArray(coord);

		/*=========Drawing the triangle===========*/

		// Clear the canvas
		gl.clearColor(0.5, 0.5, 0.5, 0.9);

		// Enable the depth test
		gl.enable(gl.DEPTH_TEST);

		// Clear the color buffer bit
		gl.clear(gl.COLOR_BUFFER_BIT);

		// Set the view port
		gl.viewport(0, 0, canvas.width, canvas.height);

		// Draw the triangle
		gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);

		const time = performance.now();
		if (setUiState) setUiState({ fps: engine.fps });
		requestAnimationFrame(update);
	}

	update();
}
