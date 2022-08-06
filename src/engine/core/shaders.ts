import readFile from "../utils/readFile";

export interface ProgramInfo {
	attribLocations: { vertexPosition: number };
	program: WebGLProgram | null;
	uniformLocations: {
		positionMatrix: WebGLUniformLocation | null;
		projectionMatrix: WebGLUniformLocation | null;
		modelViewMatrix: WebGLUniformLocation | null;
	};
}

export default async function loadShaders(gl: WebGL2RenderingContext): Promise<ProgramInfo | undefined> {
	const vertexShader = readFile("/shaders/vertex/shader.vertex");
	const fragmentShader = readFile("/shaders/fragment/shader.fragment");

	const shaderProgram = initShaderProgram(gl, await vertexShader, await fragmentShader);
	if (!shaderProgram) return;

	const programInfo = {
		program: shaderProgram,
		attribLocations: {
			vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
		},
		uniformLocations: {
			projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
			modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
			positionMatrix: gl.getUniformLocation(shaderProgram, "uPositionMatrix"),
		},
	} as ProgramInfo;

	return programInfo;
}

function initShaderProgram(gl: WebGL2RenderingContext, vsSource: string, fsSource: string) {
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)!;
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)!;

	// Create the shader program

	const shaderProgram = gl.createProgram()!;
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	// If creating the shader program failed, alert

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
		return null;
	}

	return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl: WebGL2RenderingContext, type: number, source: string) {
	const shader = gl.createShader(type)!;

	// Send the source to the shader object

	gl.shaderSource(shader, source);

	// Compile the shader program

	gl.compileShader(shader);

	// See if it compiled successfully

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
		gl.deleteShader(shader);
		return null;
	}

	return shader;
}
