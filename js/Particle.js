class Particle {
	constructor() {
		// properties will be initialized via reset()
		this.reset(0, 0, 0, [1, 2]);
	}

	reset(x, y, baseColor, sizeRange, lifeRange = [20, 80]) {
		this.x = x;
		this.y = y;
		this.size = Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0];
		this.baseColor = baseColor;
		this.hue = Math.random() * 60 + baseColor;
		this.color = `hsl(${this.hue}, 100%, 60%)`;
		this.speedX = (Math.random() - 0.5) * 1.5;
		this.speedY = (Math.random() - 0.5) * 1.5;
		this.life = Math.random() * (lifeRange[1] - lifeRange[0]) + lifeRange[0];
		this.maxLife = this.life;
		this.alive = true;
		return this;
	}

	update() {
		this.x += this.speedX;
		this.y += this.speedY;
		this.life -= 1;
		// ease size down, but keep minimum bound
		this.size *= 0.985;
		if (this.life <= 0 || this.size < 0.25) this.alive = false;
	}

	draw(ctx) {
		if (!this.alive) return;
		ctx.beginPath();
		ctx.arc(this.x, this.y, Math.max(this.size, 0.1), 0, Math.PI * 2);
		// globalAlpha will be set by caller based on life ratio
		ctx.fillStyle = this.color;
		ctx.fill();
	}
}

export class ParticlePool {
	constructor(initialSize = 200) {
		this.pool = [];
		for (let i = 0; i < initialSize; i++) this.pool.push(new Particle());
	}

	acquire(x, y, baseColor, sizeRange, lifeRange) {
		const p = this.pool.length ? this.pool.pop() : new Particle();
		return p.reset(x, y, baseColor, sizeRange, lifeRange);
	}

	release(p) {
		// sanitize and push back
		p.alive = false;
		this.pool.push(p);
	}
}
