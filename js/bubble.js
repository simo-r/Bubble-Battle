class Bubble {
    constructor(x, y, radius, speedX, speedY, color, gameArea,name) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.gameArea = gameArea;
        this.maxSpeed = this.getCurrentMaxSpeed;
        this.acceleration = 0.3;
        this.speedX = speedX;
        this.speedY = speedY;
        this.keys = {};
        this.bumping = false;
        this.name = name;
    }

    static getMinRadius() {
        return 20;
    }

    static getMaxRadius() {
        return 300;
    }

    get getCurrentMaxSpeed() {
        return Math.ceil(100 / this.radius);
    }

    get getRadius() {
        return this.radius;
    }


    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        
    }

    updateSpeed() {
        if (this.bumping) {
            this.speedX = 0;
            this.speedY = 0;
            this.bumping = false;
        } else {
            this.updateSpeedX();
            this.updateSpeedY();
        }
    }

    //OVERRIDE
    updateSpeedX() {
        if ((this.keys['KeyD'] && this.keys['KeyA']) ||
            (this.speedX !== 0 && !(this.keys['KeyD'] || this.keys['KeyA']))) {
            this.slowDownX();
        } else if (this.keys['KeyA']) {
            this.moveLeft();

        } else if (this.keys['KeyD']) {
            this.moveRight();

        }
    }

    updateSpeedY() {
        if ((this.keys['KeyS'] && this.keys['KeyW']) ||
            (this.speedY !== 0 && !(this.keys['KeyS'] || this.keys['KeyW']))) {
            
            this.slowDownY();
            //RALLENTA
        } else if (this.keys['KeyW']) {
            this.moveUp();
            //MOVE LEFT
        } else if (this.keys['KeyS']) {
            this.moveDown();
            //MOVE RIGHT
        }
    }


    checkXBoundaries() {
        let isOutOfXBounds = this.gameArea.isOutOfXBounds(this.x, this.radius);
        if (isOutOfXBounds) {
            this.speedX = 0;
            this.keys = getRandomWASD();
            if (isOutOfXBounds === -1) {
                this.x = this.gameArea.x + this.radius;
                this.keys['KeyA'] = false;
                this.keys['KeyD'] = true;
            } else if (isOutOfXBounds === 1) {
                this.x = this.gameArea.x + this.gameArea.gameWidth - this.radius;
                this.keys['KeyA'] = true;
                this.keys['KeyD'] = false;
            }
        }
    }

    checkYBoundaries() {
        let isOutOfYBounds = this.gameArea.isOutOfYBounds(this.y, this.radius);
        if (isOutOfYBounds) {
            this.speedY = 0;
            this.keys = getRandomWASD();
            if (isOutOfYBounds === -1) {
                this.y = this.gameArea.y + this.radius;
                this.keys['KeyS'] = true;
                this.keys['KeyW'] = false;
                //this.keys = getRandomWASD();
            } else if (isOutOfYBounds === 1) {
                this.y = this.gameArea.y + this.gameArea.gameHeight - this.radius;
                this.keys['KeyS'] = false;
                this.keys['KeyW'] = true;
                //this.keys = getRandomWASD();
            }
        }
    }

    //OWN
    slowDownX(coeff = 1, lowerBound = 0) {
        if (this.speedX === 0) return;
        if (this.speedX > lowerBound) {
            if ((this.speedX -= this.acceleration * coeff) < lowerBound) {
                this.speedX = lowerBound;
            }
        } else if (this.speedX < -lowerBound) {
            if ((this.speedX += this.acceleration * coeff) > -lowerBound) {
                this.speedX = -lowerBound;
            }
        }
    }

    //OWN
    slowDownY(coeff = 1, lowerBound = 0) {
        if (this.speedY === 0) return;
        if (this.speedY > lowerBound) {
            if ((this.speedY -= this.acceleration * coeff) < lowerBound) {
                this.speedY = lowerBound;
            }
        } else if (this.speedY < -lowerBound) {
            if ((this.speedY += this.acceleration * coeff) > -lowerBound) {
                this.speedY = -lowerBound;
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

    collideOnShield(x, y) {
        if (this.speedX === 0) {
            if (this.x < x) {
                this.speedX = 1;
            } else if (this.x > x) {
                this.speedX = -1;
            }
        }
        if (this.speedY === 0) {
            if (this.y < y) {
                this.speedY = 1;
            } else if (this.y > y) {
                this.speedY = -1;
            }
        }
        this.speedX *= -1;
        this.speedY *= -1;

        this.bumping = true;
        //console.log("SPEED X AFTER " + this.speedX + " SPEED Y AFTER " + this.speedY);

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
        return r - Math.sqrt((x * x) + (y * y));
    }

    colliding(radiusRatio = 0, hit = 2 * this.radius) {
        // 0<=ratio<=1
        let ratio = (hit / (2 * this.radius)).toFixed(2);
        this.radius -= radiusRatio /*Da moltiplicare*/;
        if (this.radius > Bubble.getMaxRadius()) {
            this.radius = Bubble.getMaxRadius();
        }
        this.maxSpeed = this.getCurrentMaxSpeed;
        this.slowDownX(ratio, this.acceleration);
        this.slowDownY(ratio, this.acceleration);
        //console.log("RATIO " + ratio + " RADIUS RATIO " + radiusRatio);
    }


}