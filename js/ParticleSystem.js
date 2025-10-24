import { CanvasManager } from "./CanvasManager.js";
import { MouseTracker } from "./MouseTracker.js";
import { Particle } from "./Particle.js";

export class ParticleSystem {
	constructor(options = {}) {
		this.config = {
			fps: options.fps || 60,
			baseColor: options.baseColor || 220,
			particleSize: options.particleSize || [0.5, 2.5],
			particlesPerPoint: options.particlesPerPoint || 2,
			trailLength: options.trailLength || 20,
			maxParticles: options.maxParticles || 1000, // 🆕 límite configurable
		};

		this.canvasManager = new CanvasManager();
		this.mouseTracker = new MouseTracker();
		this.particles = [];
		this.lastFrameTime = 0;
		this.frameInterval = 1000 / this.config.fps;
		this.isVisible = true;

		document.addEventListener("visibilitychange", () => {
			this.isVisible = document.visibilityState === "visible";
		});
	}

	start() {
		requestAnimationFrame((t) => this.animate(t));
	}

	animate(timestamp = 0) {
		requestAnimationFrame((t) => this.animate(t));

		if (!this.isVisible) return;
		if (timestamp - this.lastFrameTime < this.frameInterval) return;
		this.lastFrameTime = timestamp;

		// 🎨 Fondo con gradiente
		this.canvasManager.drawGradientBackground();

		// 🧮 Generar nuevas partículas si el mouse se mueve
		if (this.mouseTracker.isActive) {
			this.generateParticles();
		}

		// 🧹 Limitar el número total de partículas
		if (this.particles.length > this.config.maxParticles) {
			const exceso = this.particles.length - this.config.maxParticles;
			this.particles.splice(0, exceso); // elimina las más viejas
		}

		// ✨ Dibujar partículas activas
		const ctx = this.canvasManager.ctx;
		for (let i = this.particles.length - 1; i >= 0; i--) {
			const p = this.particles[i];
			p.update();
			p.draw(ctx);
			if (p.isDead()) {
				this.particles.splice(i, 1);
			}
		}
	}

	generateParticles() {
		const history = this.mouseTracker.history;
		for (let i = 0; i < history.length; i += 2) {
			for (let j = 0; j < this.config.particlesPerPoint; j++) {
				this.particles.push(
					new Particle({
						x: history[i].x,
						y: history[i].y,
						baseColor: this.config.baseColor,
						sizeRange: this.config.particleSize,
					})
				);
			}
		}
	}
}
