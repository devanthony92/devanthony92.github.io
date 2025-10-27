// modals.js
class ModalManager {
	constructor() {
		this.activeModal = null;
		this.init();
	}

	init() {
		// Detectar todos los botones que abren modales
		document.querySelectorAll("[data-modal-open]").forEach((btn) => {
			btn.addEventListener("click", (e) => this.openModal(e));
		});

		// Detectar botones de cierre
		document.querySelectorAll("[data-modal-close]").forEach((btn) => {
			btn.addEventListener("click", () => this.closeModal());
		});

		// Cerrar al hacer clic fuera del contenido
		document.addEventListener("click", (e) => {
			if (this.activeModal && e.target === this.activeModal) {
				this.closeModal();
			}
		});

		// Cerrar con tecla ESC
		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape" && this.activeModal) {
				this.closeModal();
			}
		});
	}

	openModal(event) {
		const modalId = event.currentTarget.dataset.modalOpen;
		this.modal = document.getElementById(modalId);
		this.modalClass = `${this.modal.classList.value}--active`;
		console.log(this.modalClass);
		if (!this.modal)
			return console.warn(`Modal con ID "${modalId}" no encontrado`);

		// Cierra cualquier modal activo antes de abrir uno nuevo
		if (this.activeModal) this.closeModal();

		this.modal.classList.add(this.modalClass);
		this.activeModal = this.modal;

		// Si contiene un iframe, reproducir video desde el inicio
		const iframe = this.modal.querySelector("iframe");
		if (iframe) {
			const src = iframe.dataset.src || iframe.src;
			if (!iframe.dataset.src) iframe.dataset.src = src; // guardar src original
			iframe.src = src; // recargar para iniciar desde 0
		}
	}

	closeModal() {
		if (!this.activeModal) return;
		console.log(this.modalClass);
		// Si el modal tiene video, detenerlo
		const iframe = this.activeModal.querySelector("iframe");
		if (iframe) {
			iframe.src = ""; // limpia para detener reproducción
		}

		this.activeModal.classList.remove(this.modalClass);
		this.activeModal = null;
	}
}

// Inicializar al cargar
document.addEventListener("DOMContentLoaded", () => new ModalManager());
