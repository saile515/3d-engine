import { mat4, quat, vec3 } from "gl-matrix";

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
		mat4.fromRotationTranslationScale(
			this.matrix,
			quat.fromEuler(this.quaternion, this.rotation.x, this.rotation.y, this.rotation.z),
			vec3.fromValues(this.position.x, this.position.y, this.position.z),
			vec3.fromValues(this.scale.x, this.scale.y, this.scale.z)
		);
	}
}
