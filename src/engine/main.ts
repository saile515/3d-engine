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
}

export default async function Init(setUiState?: Dispatch<SetStateAction<UIState>>) {
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

	globalThis.engine = new Engine(gl);

	const obj = new Object();
	const mesh = await MeshFromOBJ("/models/monkey.obj");

	obj.addComponent(mesh);
	engine.scene.add(obj);

	const transform = obj.getComponent<Transform>(Transform);
	transform?.scale.set(2, 2, 2);

	const obj1 = new Object();
	const mesh1 = await MeshFromOBJ("/models/cube.obj");

	obj1.addComponent(mesh1);
	engine.scene.add(obj1);

	const transform1 = obj1.getComponent<Transform>(Transform);

	transform1?.position.setX(3);

	const startTime = performance.now();

	function update() {
		engine.update();
		const time = performance.now();
		transform?.position.setY(Math.sin(time / 500) * 0.75);
		transform?.rotation.setY((time - startTime) / 16);
		if (setUiState) setUiState({ fps: engine.fps });
		requestAnimationFrame(update);
	}

	update();
}
