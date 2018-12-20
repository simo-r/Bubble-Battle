let xnew;
let ynew;
class UserBubble extends Bubble {
    constructor(x, y, radius, speedX, speedY, color, gameArea) {
        super(x, y, radius, speedX, speedY, color, gameArea);
        //this.isColliding = false;
        this.keys = {};

    }

    static createUserBubble(x, y, radius, speedX, speedY, color, gameArea) {
        let tmpUserBubble = new UserBubble(x, y, radius, speedX, speedY, color, gameArea);
        UserBubble.addKeyListeners(tmpUserBubble);
        return tmpUserBubble;
    }

    //OWN
    static addKeyListeners(bubble) {
        let keyDownFun = function (e) {
            if (e.code === 'KeyW' || e.code === 'KeyA' || e.code === 'KeyS' || e.code === 'KeyD') {
                bubble.keys[e.code] = true;
                //console.log("KEY DOWN " + e.code);
            }
        };
        let keyUpFun = function (e) {
            if (e.code === 'KeyW' || e.code === 'KeyA' || e.code === 'KeyS' || e.code === 'KeyD') {
                bubble.keys[e.code] = false;
                //console.log("KEY UP " + e.code);
            }
        };
        window.addEventListener('keydown', keyDownFun);
        window.addEventListener('keyup', keyUpFun);
    }

    //OVERRIDE + SUPER (DONE)
    move() {
        if (!(Object.keys(this.keys).length === 0 && this.keys.constructor === Object)) {
            super.move();

            //this.gameArea.move(this.speedX, this.speedY);
        }
    }

    //OVERRIDE
    moveX() {
        if ((this.keys['KeyD'] && this.keys['KeyA']) ||
            (this.speedX !== 0 && !(this.keys['KeyD'] || this.keys['KeyA']))) {
            this.slowDownX();
            //console.log("RALLENTA X");
        } else if (this.keys['KeyA']) {
            //console.log("MUOVITI A SINISTRA");
            this.moveLeft();
            //console.log("SX");
            //MOVE LEFT
        } else if (this.keys['KeyD']) {
            //console.log("MUOVITI A DESTRA");
            //console.log("SXX");
            this.moveRight();
            //MOVE RIGHT
        }
    }

    //OVERRIDE(DONE)
    moveY() {
        if ((this.keys['KeyS'] && this.keys['KeyW']) ||
            (this.speedY !== 0 && !(this.keys['KeyS'] || this.keys['KeyW']))) {
            //console.log("RALLENTA X");
            this.slowDownY();
            //RALLENTA
        } else if (this.keys['KeyW']) {
            //console.log("MUOVITI A SINISTRA");
            this.moveUp();
            //MOVE LEFT
        } else if (this.keys['KeyS']) {
            //console.log("MUOVITI A DESTRA");
            this.moveDown();
            //MOVE RIGHT
        }
    }

    //OVERRIDE (DONE) //TODO VEDI SE SI PUò NON FARE L'OVERRIDE
    checkXBoundaries() {
        let isOutOfXBounds = this.gameArea.isOutOfXBounds(this.x, this.radius);
        if (isOutOfXBounds) {
            this.speedX = 0;
            if (isOutOfXBounds === -1) {
                this.gameArea.x = this.x - this.radius;
                console.log("OUT LEFT");
            } else if (isOutOfXBounds === 1) {
                this.gameArea.x = this.x + this.radius - this.gameArea.gameWidth;
                console.log("OUT RIGHT");
            }
        }
    }

    //OVERRIDE (DONE)
    checkYBoundaries() {
        let isOutOfYBounds = this.gameArea.isOutOfYBounds(this.y, this.radius);
        if (isOutOfYBounds) {
            this.speedY = 0;
            if (isOutOfYBounds === -1) {
                this.gameArea.y = this.y - this.radius;
            } else if (isOutOfYBounds === 1) {
                this.gameArea.y = this.y + this.radius - this.gameArea.gameHeight;
            }
        }
    }

    //OWN
    slowDownX() {
        if (this.speedX > 0) {
            if ((this.speedX -= this.acceleration) < 0) {
                this.speedX = 0;
            }
        } else if (this.speedX < 0) {
            if ((this.speedX += this.acceleration) > 0) {
                this.speedX = 0;
            }
        }
    }

    //OWN
    slowDownY() {
        if (this.speedY > 0) {
            if ((this.speedY -= this.acceleration) < 0) {
                this.speedY = 0;
            }
        } else if (this.speedY < 0) {
            if ((this.speedY += this.acceleration) > 0) {
                this.speedY = 0;
            }
        }
    }

    //INHERIT (MAYBE)
    hitDetection(circle) {
        let r = this.radius + circle.radius;
        let x = this.x - circle.x;
        let y = this.y - circle.y;
        return r > Math.sqrt((x * x) + (y * y));
    }

    collideOnShield(x, y, offset) {
        //TODO RIPOSIZIONARE
        /*this.x = x;
        this.y = y;*/
        this.speedX = 0;
        this.speedY = 0;
    }

    /*collidingWithEnemies() {
        //COLLIDING LOGIC
    }*/

}