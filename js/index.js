import { ParticleSystem } from "./ParticleSystem.js";

const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

try {
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
} catch (e) {
	document.body.style.cursor = "auto";
}

const toggle = document.getElementById("nav-toggle");
const nav = document.getElementById("nav");

toggle.addEventListener("click", () => {
	toggle.classList.toggle("active");
	nav.classList.toggle("active");
});

const contactForm = document.getElementById("contact-form");
if (contactForm) {
	const btn = document.getElementById("form-submit-btn");
	const feedback = document.getElementById("form-feedback");

	contactForm.addEventListener("submit", async (e) => {
		e.preventDefault();

		feedback.className = "form__feedback";

		// Verificar que el captcha fue resuelto antes de enviar
		const formData = new FormData(contactForm);
		const captchaToken = formData.get("h-captcha-response");
		if (!captchaToken) {
			feedback.classList.add("visible", "form__feedback--error");
			feedback.textContent =
				"Por favor completa el captcha antes de enviar.";
			return;
		}

		// Sincronizar replyto con el email ingresado
		document.getElementById("replyto-field").value =
			document.getElementById("input-email").value;
		formData.set("replyto", document.getElementById("input-email").value);

		btn.disabled = true;
		btn.innerHTML =
			'Enviando... <i class="fa-solid fa-spinner fa-spin"></i>';

		try {
			const response = await fetch("https://api.web3forms.com/submit", {
				method: "POST",
				body: formData,
			});
			const data = await response.json();

			feedback.classList.add("visible");
			if (data.success) {
				feedback.classList.add("form__feedback--success");
				feedback.textContent =
					"¡Mensaje enviado! Me pondré en contacto contigo pronto.";
				contactForm.reset();
			} else {
				feedback.classList.add("form__feedback--error");
				feedback.textContent =
					"Hubo un error al enviar el mensaje. Intenta de nuevo.";
			}
		} catch {
			feedback.classList.add("visible", "form__feedback--error");
			feedback.textContent = "Error de conexión. Intenta nuevamente.";
		} finally {
			btn.disabled = false;
			btn.innerHTML =
				'Enviar <i class="fa-solid fa-paper-plane"></i><span class="overlay"></span>';
		}
	});
}

document.getElementById("downloadCvBtn").addEventListener("click", (e) => {
	e.preventDefault();
	const fileUrl = e.target.href;
	const link = document.createElement("a");
	link.href = fileUrl;
	link.download = "Hv_Anthony_Enrique_Martinez_Amell.pdf";
	link.click();
});
