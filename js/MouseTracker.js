export class MouseTracker {
	constructor({
		trailLength = 20,
		smoothing = true,
		interpolationSteps = 2,
	} = {}) {
		this.x = null;
		this.y = null;
		this.isActive = false;
		this.history = []; // recent raw points
		this.smoothed = []; // interpolated points used by particle generator
		this.trailLength = trailLength;
		this.smoothing = smoothing;
		this.interpolationSteps = interpolationSteps;
		this._bind();
	}

	_bind() {
		window.addEventListener("mousemove", (e) => this._onMove(e));
		window.addEventListener("mouseout", () => this._onOut());
		window.addEventListener("mouseleave", () => this._onOut());
	}

	_onMove(e) {
		const x = e.clientX;
		const y = e.clientY;
		this.isActive = true;
		this.x = x;
		this.y = y;

		this.history.unshift({ x, y, t: performance.now() });
		if (this.history.length > this.trailLength)
			this.history.length = this.trailLength;

		this._updateSmoothed();
	}

	_onOut() {
		this.isActive = false;
		this.history.length = 0;
		this.smoothed.length = 0;
	}

	_updateSmoothed() {
		// Build a smoothed array by interpolating between history points.
		const points = this.history.slice(); // newest first
		const out = [];

		for (let i = 0; i < points.length - 1; i++) {
			const a = points[i + 1]; // older
			const b = points[i]; // newer
			if (!a || !b) continue;
			out.push({ x: b.x, y: b.y });
			if (this.smoothing) {
				for (let s = 1; s <= this.interpolationSteps; s++) {
					const t = s / (this.interpolationSteps + 1);
					out.push({
						x: a.x + (b.x - a.x) * t,
						y: a.y + (b.y - a.y) * t,
					});
				}
			}
		}

		// ensure we include the oldest point too
		if (points.length) out.push(points[points.length - 1]);

		// limit length
		this.smoothed = out.slice(0, this.trailLength);
	}
}
