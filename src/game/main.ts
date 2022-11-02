import { Dispatch, SetStateAction } from "react";

import Engine from "../engine/core/Engine";
import { Key } from "../engine/input/KeyEnum";
import MeshFromOBJ from "../engine/utils/MeshFromOBJ";
import Object from "../engine/core/Object";
import TextureFromImg from "../engine/utils/TextureFromImg";
import Transform from "../engine/components/Transform";
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

	canvas.onclick = () => engine.inputHandler.lockMouse();

	const obj = new Object();
	const mesh = await MeshFromOBJ("/models/sphere.obj");
	obj.addComponent(mesh);
	const texture = await TextureFromImg("/images/cat.png");
	obj.addComponent(texture);
	scene.add(obj);
	const transform = obj.getComponent<Transform>(Transform);

	transform.position.setZ(-10);

	function update() {
		engine.update();

		if (engine.inputHandler.getKey(Key.W)) transform.position.setZ(transform.position.z - 1 * engine.deltaTime);
		if (engine.inputHandler.getKey(Key.S)) transform.position.setZ(transform.position.z + 1 * engine.deltaTime);
		if (engine.inputHandler.getKey(Key.A)) transform.position.setX(transform.position.x - 1 * engine.deltaTime);
		if (engine.inputHandler.getKey(Key.D)) transform.position.setX(transform.position.x + 1 * engine.deltaTime);

		transform.scale.setAll(transform.scale.x + engine.inputHandler.mouseDelta.y / 1000);

		engine.clean();
		if (setUiState) setUiState({ fps: engine.fps });
		requestAnimationFrame(update);
	}

	update();
}
