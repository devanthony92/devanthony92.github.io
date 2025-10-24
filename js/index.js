import { ParticleSystem } from "./ParticleSystem.js";

const system = new ParticleSystem({
	fps: 60,
	baseColor: 180,
	particleSize: [0.5, 2.5],
	particlesPerPoint: 4,
	trailLength: 20,
	maxParticles: 1200, // límite máximo de partículas
});

system.start();
