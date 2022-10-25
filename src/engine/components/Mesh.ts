import * as VecMath from "../utils/VecMath";

import Component from "../core/Component";
import Vector3 from "../core/Vector3";
import VectorToArray from "../utils/VectorToArray";
import { mat4 } from "gl-matrix";

export default class Mesh extends Component {
	vertices: Vector3[];
	indices: number[];
	normals: Vector3[];

	constructor(vertices: Vector3[], indices: number[], normals: Vector3[]) {
		super();
		this.vertices = vertices;
		this.indices = indices;
		this.normals = normals;
	}
}
