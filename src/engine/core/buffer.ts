import Mesh from "../components/Mesh";
import Vector3 from "./Rendering/Vector3";

export default function initBuffers(gl: WebGL2RenderingContext) {
	// Create a buffer for the square's positions.

	const positionBuffer = gl.createBuffer();

	// Select the positionBuffer as the one to apply buffer
	// operations to from here out.

	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Now create an array of positions for the square.

	const mesh = new Mesh([
		new Vector3(-1.0, -1.0, 0.0),
		new Vector3(-1.0, 1.0, 0.0),
		new Vector3(1.0, 1.0, 0.0),
		new Vector3(-1.0, -1.0, 0.0),
		new Vector3(1.0, 1.0, 0.0),
		new Vector3(1.0, -1.0, 0.0),
	]);

	// Now pass the list of positions into WebGL to build the
	// shape. We do this by creating a Float32Array from the
	// JavaScript array, then use it to fill the current buffer.

	gl.bufferData(gl.ARRAY_BUFFER, mesh.asFloat32Array(), gl.STATIC_DRAW);

	return {
		position: positionBuffer,
	};
}
