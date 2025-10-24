export class Particle {
	constructor({ x, y, baseColor, sizeRange }) {
		this.x = x;
		this.y = y;
		this.size = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];
		this.color = `hsl(${Math.random() * 60 + baseColor}, 100%, 60%)`;
		this.speedX = Math.random() * 1 - 0.5;
		this.speedY = Math.random() * 1 - 0.5;
		this.life = Math.random() * 50 + 10;
	}

	update() {
		this.x += this.speedX;
		this.y += this.speedY;
		this.life--;
		this.size *= 0.96;
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		ctx.fillStyle = this.color;
		ctx.fill();
	}

	isDead() {
		return this.life <= 0 || this.size < 0.3;
	}
}
