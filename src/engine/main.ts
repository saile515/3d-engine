import Engine from "./core/Engine";
import Mesh from "./components/Mesh";
import Object from "./core/Object";
import Vector3 from "./core/Rendering/Vector3";
import loadShaders from "./core/shaders";

function resizeCanvas(canvas: HTMLCanvasElement) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

declare global {
	var engine: Engine;
}

export default async function Init() {
	const canvas = document.querySelector("#glCanvas") as HTMLCanvasElement;
	resizeCanvas(canvas);
	window.onresize = () => resizeCanvas(canvas);

	// Initialize the GL context
	const gl = canvas.getContext("webgl2");

	// Only continue if WebGL is available and working
	if (gl === null) {
		alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		return;
	}

	// Set clear color to black, fully opaque
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	// Clear the color buffer with specified clear color
	gl.clear(gl.COLOR_BUFFER_BIT);

	const programInfo = loadShaders(gl);

	if (!programInfo) {
		throw new Error("Shaders failed to init");
	}

	globalThis.engine = new Engine(gl);
	engine.scene.shaderInfo = await programInfo;

	const obj = new Object();
	const mesh = new Mesh([
		new Vector3(-1.0, -1.0, 0.0),
		new Vector3(-1.0, 1.0, 0.0),
		new Vector3(1.0, 1.0, 0.0),
		new Vector3(-1.0, -1.0, 0.0),
		new Vector3(1.0, 1.0, 0.0),
		new Vector3(1.0, -1.0, 0.0),
	]);

	obj.addComponent(mesh);
	engine.scene.add(obj);

	const obj1 = new Object();
	const mesh1 = new Mesh([
		new Vector3(-1.0, -1.0, 0.0),
		new Vector3(-1.0, 1.0, 0.0),
		new Vector3(1.0, 1.0, 0.0),
		new Vector3(-1.0, -1.0, 0.0),
		new Vector3(1.0, 1.0, 0.0),
		new Vector3(1.0, -1.0, 0.0),
	]);

	obj.position.setX(3);

	obj1.addComponent(mesh1);
	engine.scene.add(obj1);

	function update() {
		engine.update();
		obj.position.setZ(obj.position.z - 0.01);
		requestAnimationFrame(update);
	}

	update();
}
