const track = document.querySelector(".carousel__track");
const slides = Array.from(track.children);
const nextButton = document.querySelector(".next");
const prevButton = document.querySelector(".prev");
const nav = document.querySelector(".carousel__nav");

// Crear indicadores
slides.forEach((_, index) => {
	const dot = document.createElement("button");
	dot.classList.add("carousel__indicator");
	if (index === 0) dot.classList.add("active");
	nav.appendChild(dot);
});

const dots = Array.from(nav.children);

let currentSlide = 0;

function updateCarousel(index) {
	track.style.transform = `translateX(-${index * 100}%)`;
	dots.forEach((dot) => dot.classList.remove("active"));
	dots[index].classList.add("active");
}

nextButton.addEventListener("click", () => {
	currentSlide = (currentSlide + 1) % slides.length;
	updateCarousel(currentSlide);
});

prevButton.addEventListener("click", () => {
	currentSlide = (currentSlide - 1 + slides.length) % slides.length;
	updateCarousel(currentSlide);
});

dots.forEach((dot, index) => {
	dot.addEventListener("click", () => {
		currentSlide = index;
		updateCarousel(currentSlide);
	});
});
