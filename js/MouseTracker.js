export class MouseTracker {
	constructor(trailLength = 20) {
		this.x = null;
		this.y = null;
		this.isActive = false;
		this.history = [];
		this.trailLength = trailLength;
		this.bindEvents();
	}

	bindEvents() {
		window.addEventListener("mousemove", (e) => {
			this.x = e.clientX;
			this.y = e.clientY;
			this.isActive = true;
			this.addHistoryPoint(this.x, this.y);
		});

		window.addEventListener("mouseout", () => {
			this.isActive = false;
			this.history = [];
		});
	}

	addHistoryPoint(x, y) {
		this.history.unshift({ x, y });
		if (this.history.length > this.trailLength) {
			this.history.pop();
		}
	}
}
