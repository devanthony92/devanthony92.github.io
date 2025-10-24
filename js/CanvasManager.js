export class CanvasManager {
	constructor() {
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
		this.gradientAngle = 0;
		this.init();
	}

	init() {
		Object.assign(this.canvas.style, {
			position: "fixed",
			top: "0",
			left: "0",
			width: "100%",
			height: "100%",
			zIndex: "-1",
			pointerEvents: "none",
			display: "block",
		});
		document.body.appendChild(this.canvas);
		this.resize();
		window.addEventListener("resize", () => this.resize());
	}

	resize() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}

	drawGradientBackground() {
		const ctx = this.ctx;
		const { width, height } = this.canvas;
		if (!width || !height) return;

		this.gradientAngle += 0.005;

		const cx = width / 2;
		const cy = height / 2;
		const r = Math.max(width, height);

		const hue1 = (180 + Math.sin(this.gradientAngle) * 60) % 360;
		const hue2 = (300 + Math.cos(this.gradientAngle * 1.5) * 60) % 360;

		const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
		gradient.addColorStop(0, `hsl(${hue1}, 70%, 20%)`);
		gradient.addColorStop(1, `hsl(${hue2}, 70%, 5%)`);

		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, width, height);
	}
}
