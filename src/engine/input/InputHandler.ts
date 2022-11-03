import { Key } from "./KeyEnum";
import Vector2 from "../core/Vector2";

export default class InputHandler {
	private keys: { key: Key; value: boolean }[];
	mousePosition: Vector2;
	mouseDelta: Vector2;

	constructor() {
		// Map key enum to key/value pair
		this.keys = Object.values(Key).map((key) => ({ key: key, value: false }));

		this.mousePosition = new Vector2(0, 0);
		this.mouseDelta = new Vector2(0, 0);

		// Init inputs
		this.initKeyboard();
		this.initMouse();
	}

	/* Keyboard */

	private initKeyboard() {
		// Handle key press
		window.addEventListener("keydown", (event) => {
			this.keys.find((key) => key.key == event.code).value = true;
		});

		// Handle key release
		window.addEventListener("keyup", (event) => {
			this.keys.find((key) => key.key == event.code).value = false;
		});
	}

	getKey(key: Key) {
		// Return value of key requested
		return this.keys.find((item) => item.key == key).value;
	}

	/* Mouse */

	private initMouse() {
		// Handle mouse move
		window.addEventListener("mousemove", (event) => {
			// Set mouse position
			this.mousePosition = new Vector2(event.clientX, event.clientY);
			// Accumulate delta movement throughout frame
			this.mouseDelta.set((this.mouseDelta.x += event.movementX), this.mouseDelta.y + event.movementY);
		});
	}

	lockMouse() {
		// Lock mouse
		gl.canvas.requestPointerLock();
	}
}
