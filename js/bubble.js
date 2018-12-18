class Bubble {
    constructor(x, y, radius, speedX, speedY, color, gameArea) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.gameArea = gameArea;
        this.maxSpeed = 10;
        this.acceleration = 0.3;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    move() {
        //TODO Puoi spostare questo in una traslazione nel contesto dall'observer
        this.moveX();
        this.moveY();
        this.checkXBoundaries();
        this.checkYBoundaries();
        //COLLIDING WITH SHIELD
    }

    moveX() {
        if (this.speedX < 0) {
            this.moveLeft();
        } else {
            this.moveRight();
        }
    }

    moveY() {
        if (this.speedY < 0) {
            this.moveUp();
        } else {
            this.moveDown();
        }
    }

    checkXBoundaries() {
        let isOutOfXBounds = this.gameArea.isOutOfXBounds(this.x, this.radius);
        if (isOutOfXBounds === -1) {
            this.x = this.gameArea.x + this.radius;
            this.speedX = this.acceleration;
        } else if (isOutOfXBounds === 1) {
            this.x = this.gameArea.x + this.gameArea.gameWidth - this.radius;
            this.speedX = -(this.acceleration);
        }
    }

    checkYBoundaries() {
        let isOutOfYBounds = this.gameArea.isOutOfYBounds(this.y, this.radius);
        if (isOutOfYBounds === -1) {
            this.y = this.gameArea.y + this.radius;
            this.speedY = this.acceleration;

        } else if (isOutOfYBounds === 1) {
            this.y = this.gameArea.y + this.gameArea.gameHeight - this.radius;
            this.speedY = -(this.acceleration);
        }
    }

    moveLeft() {
        if (this.speedX !== -this.maxSpeed) {
            this.speedX -= this.acceleration;
            if (this.speedX < -(this.maxSpeed)) {
                this.speedX = -(this.maxSpeed);
            }
        }
    }

    moveRight() {
        if (this.speedX !== this.maxSpeed) {
            this.speedX += this.acceleration;
            if (this.speedX > this.maxSpeed) {
                this.speedX = this.maxSpeed;
            }
        }
    }

    moveUp() {
        if (this.speedY !== -this.maxSpeed) {
            this.speedY -= this.acceleration;
            if (this.speedY < -(this.maxSpeed)) {
                this.speedY = -(this.maxSpeed);
            }
        }
    }

    moveDown() {
        if (this.speedY !== this.maxSpeed) {
            this.speedY += this.acceleration;
            if (this.speedY > this.maxSpeed) {
                this.speedY = this.maxSpeed;
            }
        }
    }

    collideOnShield(pointX, pointY){        
        this.speedX = 0;
        this.speedY = 0;
    }


}