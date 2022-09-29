import Vector3 from "../core/Vector3";

export function magnitude(vector: Vector3) {
	return Math.sqrt(vector.x ** 2 + vector.y ** 2 + vector.z ** 2);
}

export function dot(a: Vector3, b: Vector3) {
	return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function cross(a: Vector3, b: Vector3) {
	return new Vector3(a.y * b.z - a.z * b.y, -(a.x * b.z - a.z * b.x), a.x * b.y - a.y * b.x);
}

export function add(a: Vector3, b: Vector3) {
	return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
}

export function subtract(a: Vector3, b: Vector3) {
	return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
}

export function multiply(vector: Vector3, factor: number) {
	return new Vector3(vector.x * factor, vector.y * factor, vector.z * factor);
}

export function divide(vector: Vector3, divisor: number) {
	return new Vector3(vector.x / divisor, vector.y / divisor, vector.z / divisor);
}
