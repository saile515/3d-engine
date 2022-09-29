import Vector3 from "../core/Vector3";

export default function VectorToArray(vectors: Vector3[]) {
	let positions: number[] = [];
	vectors.forEach((vector) => (positions = [...positions, ...vector.asArray()]));
	return new Float32Array(positions);
}
