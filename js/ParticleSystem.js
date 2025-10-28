import { GradientCache, CanvasLayerManager } from "./CanvasManager.js";
import { MouseTracker } from "./MouseTracker.js";
import { ParticlePool } from "./Particle.js";

export class ParticleSystem {
	constructor(options = {}) {
		this.config = {
			fps: options.fps || 60,
			baseColor: options.baseColor || 180,
			particleSize: options.particleSize || [0.6, 2.5],
			particlesPerPoint: options.particlesPerPoint || 3,
			trailLength: options.trailLength || 20,
			maxParticles: options.maxParticles || 1200,
			gradientFrameInterval: options.gradientFrameInterval || 8,
			useOffscreen:
				options.useOffscreen !== undefined ? options.useOffscreen : true,
			backgroundLayerName: "background",
			particleLayerName: "particles",
		};
		this.performance = {
			lastCheck: performance.now(),
			frameCount: 0,
			fps: 60,
			targetFps: options.fps || 60,
			minFps: 45, // umbral de ajuste
			maxFps: 70,
		};

		this.canvasManager = new CanvasLayerManager({
			layers: [this.config.backgroundLayerName, this.config.particleLayerName],
			useOffscreen: this.config.useOffscreen,
		});

		this.mouseTracker = new MouseTracker({
			trailLength: this.config.trailLength,
			smoothing: true,
			interpolationSteps: 2,
		});

		this.particles = [];
		this.pool = new ParticlePool(
			Math.min(600, Math.floor(this.config.maxParticles / 2))
		);

		this.gradientCache = new GradientCache();
		this.gradientCache.setInterval(this.config.gradientFrameInterval);

		this.frameInterval = 1000 / this.config.fps;
		this.lastFrameTime = 0;
		this.running = false;

		// small angle for gradient animation
		this.gradientAngle = 0;

		document.addEventListener("visibilitychange", () => {
			this.isVisible = document.visibilityState === "visible";
		});
		this.isVisible = document.visibilityState === "visible";
	}

	start() {
		if (this.running) return;
		this.running = true;
		this.lastFrameTime = performance.now();
		requestAnimationFrame((t) => this._loop(t));
	}

	stop() {
		this.running = false;
	}

	_loop(timestamp) {
		if (!this.running) return;
		requestAnimationFrame((t) => this._loop(t));

		// medir FPS
		this._measurePerformance(timestamp);

		if (!this.isVisible) return;
		if (timestamp - this.lastFrameTime < this.frameInterval) return;
		this.lastFrameTime = timestamp;

		this._update();
		this._render();
	}

	_measurePerformance(timestamp) {
		const perf = this.performance;
		perf.frameCount++;

		// comprobar cada segundo
		if (timestamp - perf.lastCheck >= 1000) {
			perf.fps = (perf.frameCount * 1000) / (timestamp - perf.lastCheck);
			perf.frameCount = 0;
			perf.lastCheck = timestamp;

			// 🔥 ajuste automático
			if (perf.fps < perf.minFps) this._decreaseQuality();
			else if (perf.fps > perf.maxFps) this._increaseQuality();
		}
	}

	_increaseQuality() {
		// Solo aumentar si el rendimiento es estable
		if (this.config.particlesPerPoint < 4) {
			this.config.particlesPerPoint += 1;
		} else if (this.config.maxParticles < 1200) {
			this.config.maxParticles = Math.min(1200, this.config.maxParticles + 100);
		} else {
			this.config.fps = Math.min(75, this.config.fps + 5);
			this.frameInterval = 1000 / this.config.fps;
		}
		console.log(
			`🚀 Rendimiento estable — Aumentando calidad. FPS: ${this.performance.fps.toFixed(
				1
			)}`
		);
	}

	_increaseQuality() {
		// Solo aumentar si el rendimiento es estable
		if (this.config.particlesPerPoint < 4) {
			this.config.particlesPerPoint += 1;
		} else if (this.config.maxParticles < 1200) {
			this.config.maxParticles = Math.min(1200, this.config.maxParticles + 100);
		} else {
			this.config.fps = Math.min(75, this.config.fps + 5);
			this.frameInterval = 1000 / this.config.fps;
		}
		console.log(
			`🚀 Rendimiento estable — Aumentando calidad. FPS: ${this.performance.fps.toFixed(
				1
			)}`
		);
	}

	_update() {
		// update gradient angle
		this.gradientAngle += 0.006;

		// generate new particles from smoothed mouse path
		if (this.mouseTracker.isActive && this.mouseTracker.smoothed.length > 0) {
			this._generateFromHistory(this.mouseTracker.smoothed);
		}

		// update existing particles
		for (let i = this.particles.length - 1; i >= 0; i--) {
			const p = this.particles[i];
			p.update();
			if (!p.alive) {
				this.pool.release(p);
				this.particles.splice(i, 1);
			}
		}

		// enforce max particles by removing oldest
		if (this.particles.length > this.config.maxParticles) {
			const extra = this.particles.length - this.config.maxParticles;
			for (let i = 0; i < extra; i++) {
				const removed = this.particles.shift();
				if (removed) this.pool.release(removed);
			}
		}
	}

	_generateFromHistory(history) {
		if (history.length === 0) return;

		// Detectar si el mouse está prácticamente quieto
		const current = history[0];
		const previous = this._lastMousePosition || { x: current.x, y: current.y };
		const dx = current.x - previous.x;
		const dy = current.y - previous.y;
		const distance = Math.sqrt(dx * dx + dy * dy);

		// Guardar para la próxima llamada
		this._lastMousePosition = { x: current.x, y: current.y };

		// 🔥 Si el mouse está quieto (distancia muy pequeña), solo genera partículas en el punto actual
		if (distance < 3) {
			for (let j = 0; j < this.config.particlesPerPoint; j++) {
				this.particles.push(
					this.pool.acquire(
						current.x,
						current.y,
						this.config.baseColor,
						this.config.particleSize,
						[24, 80]
					)
				);
			}
			return;
		}

		// 🌀 Si el mouse se mueve, genera partículas a lo largo del rastro
		for (let i = 0; i < history.length; i++) {
			const pt = history[i];
			for (let j = 0; j < this.config.particlesPerPoint; j++) {
				this.particles.push(
					this.pool.acquire(
						pt.x,
						pt.y,
						this.config.baseColor,
						this.config.particleSize,
						[24, 80]
					)
				);
			}
		}
	}

	_render() {
		// RENDER BACKGROUND (cached gradient)
		const bgCtx = this.canvasManager.getContext(
			this.config.backgroundLayerName
		);
		const w = bgCtx.canvas.width;
		const h = bgCtx.canvas.height;

		if (this.gradientCache.shouldRecalc()) {
			// recompute gradient
			const cx = w / 2;
			const cy = h / 2;
			const r = Math.max(w, h) * 0.9;
			const hue1 = (180 + Math.sin(this.gradientAngle) * 60 + 360) % 360;
			const hue2 = (300 + Math.cos(this.gradientAngle * 1.5) * 60 + 360) % 360;
			const grad = bgCtx.createRadialGradient(cx, cy, 0, cx, cy, r);
			grad.addColorStop(0, `hsl(${hue1}, 70%, 20%)`);
			grad.addColorStop(1, `hsl(${hue2}, 70%, 6%)`);
			// store as simple object to reuse
			this.gradientCache.set({
				gradient: grad,
				angle: this.gradientAngle,
				w,
				h,
			});
		}

		// Use cached gradient but if canvas size changed, we must redraw gradient to the context
		const cache = this.gradientCache.get();
		bgCtx.clearRect(0, 0, w, h);
		bgCtx.fillStyle = cache.gradient;
		bgCtx.fillRect(0, 0, w, h);

		// RENDER PARTICLES
		const pCtx = this.canvasManager.getContext(this.config.particleLayerName);
		// fade previous particle layer slightly to create trails (alpha based)
		pCtx.clearRect(0, 0, pCtx.canvas.width, pCtx.canvas.height);

		// draw each particle using globalAlpha based on life ratio
		for (let i = 0; i < this.particles.length; i++) {
			const p = this.particles[i];
			const alpha = Math.max(0, Math.min(1, p.life / p.maxLife));
			pCtx.save();
			pCtx.globalAlpha = alpha;
			p.draw(pCtx);
			pCtx.restore();
		}

		// finally composite layers to the visible compositor
		this.canvasManager.composite();
	}
}
