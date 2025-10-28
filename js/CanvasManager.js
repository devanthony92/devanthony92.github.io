export class CanvasLayerManager {
	constructor({
		layers = ["background", "particles"],
		useOffscreen = true,
	} = {}) {
		this.layers = {};
		this.order = layers;
		this.useOffscreen = useOffscreen && typeof OffscreenCanvas !== "undefined";
		this._initCanvases();
	}

	_initCanvases() {
		// create DOM container for canvas layers
		this.container = document.createElement("div");
		Object.assign(this.container.style, {
			position: "fixed",
			top: "0",
			left: "0",
			width: "100%",
			height: "100%",
			pointerEvents: "none",
			zIndex: "-1",
		});
		document.body.appendChild(this.container);

		// onscreen canvas that will display the flattened result (compositor canvas)
		this.compositor = document.createElement("canvas");
		this.compositorCtx = this.compositor.getContext("2d");
		Object.assign(this.compositor.style, {
			position: "absolute",
			inset: "0",
			width: "100%",
			height: "100%",
			display: "block",
		});
		this.container.appendChild(this.compositor);

		// create layers
		for (const layerName of this.order) {
			const layer = this._createLayer(layerName);
			this.layers[layerName] = layer;
		}

		this.resize();
		window.addEventListener("resize", () => this.resize());
	}

	_createLayer(name) {
		if (this.useOffscreen) {
			// OffscreenCanvas used as backing buffer. We keep an onscreen element only for compositor.
			const off = new OffscreenCanvas(
				window.innerWidth || 1,
				window.innerHeight || 1
			);
			const ctx = off.getContext("2d");
			return { name, offscreen: off, ctx, needsBlit: true };
		} else {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			Object.assign(canvas.style, {
				position: "absolute",
				inset: "0",
				width: "100%",
				height: "100%",
				display: "block",
			});
			this.container.appendChild(canvas);
			return { name, canvas, ctx };
		}
	}

	getContext(layerName) {
		const layer = this.layers[layerName];
		return layer ? layer.ctx : null;
	}

	resize() {
		const w = Math.max(window.innerWidth, 1);
		const h = Math.max(window.innerHeight, 1);
		// compositor size
		this.compositor.width = w;
		this.compositor.height = h;

		for (const layerName of this.order) {
			const layer = this.layers[layerName];
			if (this.useOffscreen) {
				layer.offscreen.width = w;
				layer.offscreen.height = h;
				layer.ctx = layer.offscreen.getContext("2d");
				layer.needsBlit = true;
			} else {
				layer.canvas.width = w;
				layer.canvas.height = h;
			}
		}
	}

	// Blit all offscreen layers into the compositor (or simply let onscreen canvases show)
	composite() {
		const w = this.compositor.width;
		const h = this.compositor.height;
		const ctx = this.compositorCtx;
		ctx.clearRect(0, 0, w, h);

		if (this.useOffscreen) {
			for (const layerName of this.order) {
				const layer = this.layers[layerName];
				// draw the offscreen canvas onto compositor
				ctx.drawImage(layer.offscreen, 0, 0, w, h);
			}
		} else {
			// if we use onscreen per-layer canvases they are already visible stacked; but we still optionally composite
			for (const layerName of this.order) {
				const layer = this.layers[layerName];
				ctx.drawImage(layer.canvas, 0, 0, w, h);
			}
		}
	}

	clearLayer(name) {
		const layer = this.layers[name];
		if (!layer) return;
		const ctx = layer.ctx;
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		if (layer.offscreen) layer.needsBlit = true;
	}
}

export class GradientCache {
	constructor() {
		this.cache = null;
		this.frameCount = 0;
		this.interval = 8; // default recalc every N frames
	}

	shouldRecalc() {
		return !this.cache || ++this.frameCount % this.interval === 0;
	}

	setInterval(n) {
		this.interval = Math.max(1, Math.floor(n));
	}

	set(cache) {
		this.cache = cache;
	}

	get() {
		return this.cache;
	}
}
