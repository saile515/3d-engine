import Camera from "./Camera";
import Object from "./Object";

export default class Scene {
	children: Object[];
	camera: Camera;

	constructor() {
		this.children = [];
		this.camera = new Camera();
	}

	update() {
		this.children.forEach((object) => object.update());

		this.render();
	}

	render() {}

	add(object: Object) {
		this.children.push(object);
	}
}
