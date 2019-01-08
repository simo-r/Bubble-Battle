class EnemyBubble extends Bubble {
    constructor(x, y, radius, speedX, speedY, color, gameArea,name) {
        super(x, y, radius, speedX, speedY, color, gameArea,name);
        this.keys = getRandomWASD();
        this.oldGameAreaX = this.gameArea.x;
        this.oldGameAreaY = this.gameArea.y;
    }

    move(){
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
        if (this.keys['KeyA']) {
            this.keys['KeyA'] = false;
            this.keys['KeyD'] = true;
        } else if (this.keys['KeyD']) {
            this.keys['KeyA'] = true;
            this.keys['KeyD'] = false;
        }
        if (this.keys['KeyW']) {
            this.keys['KeyW'] = false;
            this.keys['KeyS'] = true;
        } else if (this.keys['KeyS']) {
            this.keys['KeyW'] = true;
            this.keys['KeyS'] = false;
        }
    }
}