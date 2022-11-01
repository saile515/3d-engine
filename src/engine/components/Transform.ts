import { mat4, quat } from "gl-matrix";

import Component from "../core/Component";
import Vector3 from "../core/Vector3";

export default class Transform extends Component {
	position: Vector3;
	rotation: Vector3;
	scale: Vector3;
	matrix: mat4;
	quaternion: quat;

	constructor(position?: Vector3, rotation?: Vector3, scale?: Vector3) {
		super();
		this.position = position || new Vector3(0, 0, 0);
		this.rotation = rotation || new Vector3(0, 0, 0);
		this.scale = scale || new Vector3(1, 1, 1);
		this.matrix = mat4.create();
		this.quaternion = quat.create();
	}

	update() {
		quat.fromEuler(this.quaternion, this.rotation.x, this.rotation.y, this.rotation.z);
		mat4.fromRotationTranslationScale(this.matrix, this.quaternion, this.position.asArray(), this.scale.asArray());
	}
}
