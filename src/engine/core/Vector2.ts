export default class Vector2 {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	asArray() {
		return [this.x, this.y] as const;
	}

	set(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	setX(x: number) {
		this.x = x;
	}

	setY(y: number) {
		this.y = y;
	}
}
