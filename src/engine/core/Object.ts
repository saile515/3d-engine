import Component from "./Component";
import Transform from "../components/Transform";
import { v4 as uuidv4 } from "uuid";

export default class Object {
	uuid: string;
	private components: Component[];

	constructor() {
		this.components = [];
		this.uuid = uuidv4();

		// Init all objects with a transform
		this.addComponent(new Transform());
	}

	addComponent(component: Component) {
		component.parent = this;
		this.components.push(component);
	}

	getComponent<T extends Component>(type: any) {
		return this.components.find((component) => component instanceof (type as any)) as T | undefined;
	}

	update() {
		this.components.forEach((component) => component.update());
	}
}
