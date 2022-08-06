import Component from "./Component";
import Vector3 from "./Rendering/Vector3";
import { v4 as uuidv4 } from "uuid";

export default class Object {
	uuid: string;
	position: Vector3;
	components: Component[];

	constructor() {
		this.position = new Vector3(0, 0, 0);
		this.components = [];
		this.uuid = uuidv4();
	}

	addComponent(component: Component) {
		this.components.push(component);
	}

	getComponent<T>(type: Component) {
		return this.components.find((component) => component instanceof (type as any)) as T | undefined;
	}
}
