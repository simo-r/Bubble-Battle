class Bubble {
    constructor(x, y, radius, speedX, speedY, color, gameArea) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.gameArea = gameArea;
        this.maxSpeed = 3;
        this.acceleration = 1;
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

        /*this.checkXBoundaries();
        this.checkYBoundaries();*/
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

    //OWN
    slowDownX(coeff = 1) {
        if (this.speedX > 0) {
            if ((this.speedX -= this.acceleration*coeff) < 0) {
                this.speedX = 0;
            }
        } else if (this.speedX < 0) {
            if ((this.speedX += this.acceleration*coeff) > 0) {
                this.speedX = 0;
            }
        }
    }

    //OWN
    slowDownY(coeff=1) {
        console.log(" ACCE * COEFF " + (this.acceleration*coeff));
        if (this.speedY > 0) {
            if ((this.speedY -= this.acceleration*coeff) < 0) {
                this.speedY = 0;
            }
        } else if (this.speedY < 0) {
            if ((this.speedY += this.acceleration*coeff) > 0) {
                this.speedY = 0;
            }
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

    collideOnShield(pointX, pointY) {
        this.speedX *= -1;
        this.speedY *= -1;
    }

    checkGameAreaCollision() {
        this.checkXBoundaries();
        this.checkYBoundaries();
    }

    // > 0 se collide, <= 0 altrimenti
    collideOnBubble(circle) {
        let r = this.radius + circle.radius;
        let x = this.x - circle.x;
        let y = this.y - circle.y;
        //console.log(" Radius - ipo " + (r - Math.sqrt((x * x) + (y * y))));
        return r - Math.sqrt((x * x) + (y * y));
    }

    colliding(hit) {
        // 0<=ratio<=1
        let ratio = hit / (2*this.radius) ;
        console.log("RATIO " + ratio);
        this.radius -= ratio /*Da moltiplicare*/ ;
        this.slowDownX(Math.abs(ratio)/*da moltiplicare*/);
        this.slowDownY(Math.abs(ratio)/*da moltiplicare*/);
    }


}