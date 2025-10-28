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

const toggle = document.getElementById("nav-toggle");
const nav = document.getElementById("nav");

toggle.addEventListener("click", () => {
	toggle.classList.toggle("active");
	nav.classList.toggle("active");
});

document.getElementById("downloadCvBtn").addEventListener("click", (e) => {
	e.preventDefault();
	const fileUrl = e.target.href;
	const link = document.createElement("a");
	link.href = fileUrl;
	link.download = "Hv_Anthony_Enrique_Martinez_Amell.pdf";
	link.click();
});
