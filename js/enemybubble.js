class EnemyBubble extends Bubble {
    constructor(x, y, radius, speedX, speedY, color, gameArea, name) {
        super(x, y, radius, speedX, speedY, color, gameArea, name);
        this.keys = getRandomWASD();
        this.oldGameAreaX = this.gameArea.x;
        this.oldGameAreaY = this.gameArea.y;
    }

    move() {
        this.x += this.speedX + (this.gameArea.x - this.oldGameAreaX);
        this.y += this.speedY + (this.gameArea.y - this.oldGameAreaY);
    }

    draw(ctx) {
        super.draw(ctx);
        this.oldGameAreaX = this.gameArea.x;
        this.oldGameAreaY = this.gameArea.y;
    }

    /**
     * Cambia i tasti, nonché la direzione della bubble.
     */
    changeDirection() {
        this.keys = getRandomWASD();
    }

    /**
     * Super + inverte i tasti premuti
     *
     * @param x ascissa del punto di collisione
     * @param y ordinata del punto di collisione
     */
    collideOnShield(x, y) {
        super.collideOnShield(x, y);
        if (this.keys[keyA]) {
            this.keys[keyA] = false;
            this.keys[keyD] = true;
        } else if (this.keys[keyD]) {
            this.keys[keyA] = true;
            this.keys[keyD] = false;
        }
        if (this.keys[keyW]) {
            this.keys[keyW] = false;
            this.keys[keyS] = true;
        } else if (this.keys[keyS]) {
            this.keys[keyW] = true;
            this.keys[keyS] = false;
        }
    }
}