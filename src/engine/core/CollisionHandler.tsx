import Collider, { BoundingBox } from "../components/Collider";

import Object from "./Object";

export class CollisionHandler {
	update(objects: Object[]) {
		// Get all object with collider component
		const colliderObjects = objects.filter((object) => object.getComponent<Collider>(Collider));

		for (let a = 0; a < colliderObjects.length; a++) {
			for (let b = a + 1; b < colliderObjects.length; b++) {
				if (
					this.isColliding(
						colliderObjects[a].getComponent<Collider>(Collider).boundingBox,
						colliderObjects[b].getComponent<Collider>(Collider).boundingBox
					)
				) {
					console.log("Collision");
				}
			}
		}
	}

	isColliding(a: BoundingBox, b: BoundingBox) {
		return (
			a.minX <= b.maxX &&
			a.maxX >= b.minX &&
			a.minY <= b.maxY &&
			a.maxY >= b.minY &&
			a.minZ <= b.maxZ &&
			a.maxZ >= b.minZ
		);
	}
}
