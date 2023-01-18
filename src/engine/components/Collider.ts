import Component from "../core/Component";
import Mesh from "./Mesh";
import Transform from "./Transform";
import { vec3 } from "gl-matrix";

export interface BoundingBox {
	minX: number;
	minY: number;
	minZ: number;
	maxX: number;
	maxY: number;
	maxZ: number;
}

export default class Collider extends Component {
	mesh: Mesh;
	transform: Transform;
	boundingBox: BoundingBox;

	constructor() {
		super();
		this.updateDependencies();
		this.boundingBox = { minX: 0, minY: 0, minZ: 0, maxX: 0, maxY: 0, maxZ: 0 };
	}

	// Get components needer for collisions and store them in reference
	updateDependencies() {
		if (!this.parent) return;
		this.mesh = this.parent.getComponent<Mesh>(Mesh);
		this.transform = this.parent.getComponent<Transform>(Transform);
		console.log(this.mesh.vertices);
	}

	update() {
		// Update dependencies if not found
		if (!this.mesh || !this.transform) this.updateDependencies();

		// Init variables
		const vertices = this.mesh.vertices;

		const boundingBox: BoundingBox = {
			minX: Infinity,
			minY: Infinity,
			minZ: Infinity,
			maxX: -Infinity,
			maxY: -Infinity,
			maxZ: -Infinity,
		};

		const coordinates: { x: number[]; y: number[]; z: number[] } = { x: [], y: [], z: [] };

		// Find transformed coordinate of vertices
		for (let i = 0; i < vertices.length; i += 3) {
			const transformedVertex = vec3.fromValues(
				vertices[i],
				vertices[i + 1],
				vertices[i + 2]
			);
			vec3.transformMat4(transformedVertex, transformedVertex, this.transform.matrix);

			coordinates.x.push(transformedVertex[0]);
			coordinates.y.push(transformedVertex[1]);
			coordinates.z.push(transformedVertex[2]);
		}

		// Calculate bounding box

		boundingBox.minX = Math.min(...coordinates.x);
		boundingBox.minY = Math.min(...coordinates.y);
		boundingBox.minZ = Math.min(...coordinates.z);
		boundingBox.maxX = Math.max(...coordinates.x);
		boundingBox.maxY = Math.max(...coordinates.y);
		boundingBox.maxZ = Math.max(...coordinates.z);

		this.boundingBox = boundingBox;
	}
}
