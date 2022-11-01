import { Dispatch, SetStateAction } from "react";

import Engine from "./core/Engine";
import MeshFromOBJ from "./utils/MeshFromOBJ";
import Object from "./core/Object";
import Transform from "./components/Transform";
import { UIState } from "../App";

function resizeCanvas(canvas: HTMLCanvasElement) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

declare global {
	var engine: Engine;
	var gl: WebGL2RenderingContext;
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

	globalThis.gl = gl;

	globalThis.engine = new Engine();

	const scene = globalThis.engine.scene;

	const obj = new Object();
	const mesh = await MeshFromOBJ("/models/monkey.obj");
	obj.addComponent(mesh);
	scene.add(obj);
	const transform = scene.camera.getComponent<Transform>(Transform);

	const startTime = performance.now();

	function update() {
		engine.update();
		const time = performance.now();

		transform.position.setZ(10);
		transform.rotation.setY(time * 0.01);

		if (setUiState) setUiState({ fps: engine.fps });
		requestAnimationFrame(update);
	}

	update();
}
