class EnemyBubble extends Bubble {
    constructor(x, y, radius, speedX, speedY, color, gameArea,name) {
        super(x, y, radius, speedX, speedY, color, gameArea,name);
        //DEBUG
        this.keys = getRandomWASD();
        this.oldGameAreaX = this.gameArea.x;
        this.oldGameAreaY = this.gameArea.y;
    }

    changeDirection() {
        this.keys = getRandomWASD();
    }
    
    draw(ctx) {
        super.draw(ctx);
        this.oldGameAreaX = this.gameArea.x;
        this.oldGameAreaY = this.gameArea.y;
    }

    move(){
        this.x += this.speedX + (this.gameArea.x - this.oldGameAreaX);
       
        this.y += this.speedY + (this.gameArea.y - this.oldGameAreaY);
       
    }
    
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