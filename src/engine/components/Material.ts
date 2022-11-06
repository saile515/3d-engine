import Component from "../core/Component";
import Vector3 from "../core/Vector3";

export default class Material extends Component {
	color: Vector3;

	constructor(color: Vector3) {
		super();
		this.color = color;
	}
}
