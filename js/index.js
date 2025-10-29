import { ParticleSystem } from "./ParticleSystem.js";

const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

if (!isMobile) {
	const system = new ParticleSystem({
		fps: 60,
		baseColor: 180,
		maxParticles: 1500,
		gradientFrameInterval: 3,
	});
	system.start();
} else {
	const system = new ParticleSystem({
		fps: 40,
		baseColor: 180,
		maxParticles: 15,
		gradientFrameInterval: 8,
	});
	system.start();
}

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
