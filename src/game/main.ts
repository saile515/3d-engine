import { Dispatch, SetStateAction } from "react";

import Collider from "../engine/components/Collider";
import Engine from "../engine/core/Engine";
import { Key } from "../engine/input/KeyEnum";
import LineRenderer from "../engine/utils/LineRenderer";
import Material from "../engine/components/Material";
import MeshFromOBJ from "../engine/utils/MeshFromOBJ";
import Object from "../engine/core/Object";
import Shader from "../engine/components/Shader";
import TextureFromImg from "../engine/utils/TextureFromImg";
import Transform from "../engine/components/Transform";
import { UIState } from "../App";
import Vector3 from "../engine/core/Vector3";
import readFile from "../engine/utils/readFile";

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

	const scene = engine.scene;

	canvas.onclick = () => engine.inputHandler.lockMouse();

	const obj = new Object();
	const mesh = await MeshFromOBJ("/models/cube.obj");
	obj.addComponent(mesh);
	const collider = new Collider();
	obj.addComponent(collider);
	const material = new Material(new Vector3(1.0, 0.0, 0.0));
	obj.addComponent(material);
	const vertCode = await readFile("/shaders/vertex/shader.vert");
	const fragCode = await readFile("/shaders/fragment/material.frag");
	const shader = new Shader(vertCode, fragCode);
	obj.addComponent(shader);
	scene.add(obj);
	const transform = obj.getComponent<Transform>(Transform);

	const lineRenderer = new LineRenderer([]);

	transform.position.setZ(-10);
	transform.rotation.setAll(45);

	function update() {
		engine.update();

		transform.rotation.setZ(360 * Math.random());
		transform.rotation.setX(360 * Math.random());
		transform.rotation.setY(360 * Math.random());

		lineRenderer.vertices = [
			new Vector3(collider.boundingBox.minX, collider.boundingBox.minY, collider.boundingBox.minZ),
			new Vector3(collider.boundingBox.maxX, collider.boundingBox.minY, collider.boundingBox.minZ),
			new Vector3(collider.boundingBox.maxX, collider.boundingBox.minY, collider.boundingBox.maxZ),
			new Vector3(collider.boundingBox.minX, collider.boundingBox.minY, collider.boundingBox.maxZ),
			new Vector3(collider.boundingBox.minX, collider.boundingBox.minY, collider.boundingBox.minZ),
			new Vector3(collider.boundingBox.minX, collider.boundingBox.maxY, collider.boundingBox.minZ),
			new Vector3(collider.boundingBox.minX, collider.boundingBox.maxY, collider.boundingBox.minZ),
			new Vector3(collider.boundingBox.maxX, collider.boundingBox.maxY, collider.boundingBox.minZ),
			new Vector3(collider.boundingBox.maxX, collider.boundingBox.maxY, collider.boundingBox.maxZ),
			new Vector3(collider.boundingBox.minX, collider.boundingBox.maxY, collider.boundingBox.maxZ),
			new Vector3(collider.boundingBox.minX, collider.boundingBox.maxY, collider.boundingBox.minZ),
			new Vector3(collider.boundingBox.maxX, collider.boundingBox.maxY, collider.boundingBox.minZ),
			new Vector3(collider.boundingBox.maxX, collider.boundingBox.minY, collider.boundingBox.minZ),
			new Vector3(collider.boundingBox.maxX, collider.boundingBox.maxY, collider.boundingBox.minZ),
			new Vector3(collider.boundingBox.maxX, collider.boundingBox.maxY, collider.boundingBox.maxZ),
			new Vector3(collider.boundingBox.maxX, collider.boundingBox.minY, collider.boundingBox.maxZ),
			new Vector3(collider.boundingBox.minX, collider.boundingBox.minY, collider.boundingBox.maxZ),
			new Vector3(collider.boundingBox.minX, collider.boundingBox.maxY, collider.boundingBox.maxZ),
		];

		lineRenderer.render();

		const camera = engine.scene.camera;
		const cameraTransform = camera.getComponent<Transform>(Transform);

		const angle = cameraTransform.rotation.y * (Math.PI / 180);

		if (engine.inputHandler.getKey(Key.W)) {
			cameraTransform.position.setZ(cameraTransform.position.z - Math.cos(angle) * 2 * engine.deltaTime);
			cameraTransform.position.setX(cameraTransform.position.x - Math.sin(angle) * 2 * engine.deltaTime);
		}

		if (engine.inputHandler.getKey(Key.S)) {
			cameraTransform.position.setZ(cameraTransform.position.z + Math.cos(angle) * 2 * engine.deltaTime);
			cameraTransform.position.setX(cameraTransform.position.x + Math.sin(angle) * 2 * engine.deltaTime);
		}

		if (engine.inputHandler.getKey(Key.A)) {
			cameraTransform.position.setZ(cameraTransform.position.z - Math.cos(angle + Math.PI / 2) * 2 * engine.deltaTime);
			cameraTransform.position.setX(cameraTransform.position.x - Math.sin(angle + Math.PI / 2) * 2 * engine.deltaTime);
		}

		if (engine.inputHandler.getKey(Key.D)) {
			cameraTransform.position.setZ(cameraTransform.position.z + Math.cos(angle + Math.PI / 2) * 2 * engine.deltaTime);
			cameraTransform.position.setX(cameraTransform.position.x + Math.sin(angle + Math.PI / 2) * 2 * engine.deltaTime);
		}

		cameraTransform.rotation.setY(cameraTransform.rotation.y - engine.inputHandler.mouseDelta.x / 10);
		cameraTransform.rotation.setX(cameraTransform.rotation.x - engine.inputHandler.mouseDelta.y / 10);

		engine.clean();
		if (setUiState) setUiState({ fps: engine.fps });
		requestAnimationFrame(update);
	}

	update();
}
