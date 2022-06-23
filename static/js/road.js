class Road {
	constructor(width, height) {
		this.width = width;
		this.height = height;

		this.p1 = [0, 0, 0];
		this.p2 = [this.width, 0, 0];
		this.p3 = [0, this.height - 20, 20];
		this.p4 = [this.width, this.height - 20, 20];
	}
}
