import Component from "./Component";
import Transform from "../components/Transform";
import { v4 as uuidv4 } from "uuid";

export default class Object {
	uuid: string;
	components: Component[];

	constructor() {
		this.components = [new Transform()];
		this.uuid = uuidv4();
	}

	addComponent(component: Component) {
		this.components.push(component);
	}

	getComponent<T extends Component>(type: any) {
		return this.components.find((component) => component instanceof (type as any)) as T | undefined;
	}

	update() {
		this.components.forEach((component) => component.update());
	}
}
