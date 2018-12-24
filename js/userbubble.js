class UserBubble extends Bubble {
    constructor(x, y, radius, speedX, speedY, color, gameArea) {
        super(x, y, radius, speedX, speedY, color, gameArea);
        //this.isColliding = false;
        
        this.keys = {};
        this.bumping = false;
    }

    static createUserBubble(x, y, radius, speedX, speedY, color, gameArea) {
        let tmpUserBubble = new UserBubble(x, y, radius, speedX, speedY, color, gameArea);
        UserBubble.addKeyListeners(tmpUserBubble);
        return tmpUserBubble;
    }

    //OWN
    static addKeyListeners(bubble) {
        let keyDownFun = function (e) {
            if ((e.code === 'KeyW' || e.code === 'KeyA' || e.code === 'KeyS' || e.code === 'KeyD')) {
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
            if (this.bumping) {
                this.speedX = 0;
                this.speedY = 0;
                this.bumping = false;
            } else {
                /*this.moveX();
                this.moveY();*/
                super.move();
            }
        }
    }

    //OVERRIDE
    moveX() {
        if ((this.keys['KeyD'] && this.keys['KeyA']) ||
            (this.speedX !== 0 && !(this.keys['KeyD'] || this.keys['KeyA']))) {
            this.slowDownX();
        } else if (this.keys['KeyA']) {
            this.moveLeft();

        } else if (this.keys['KeyD']) {
            this.moveRight();

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
                this.gameArea.x = Math.floor(this.x - this.radius) ;
                console.log("OUT LEFT");
            } else if (isOutOfXBounds === 1) {
                this.gameArea.x = Math.ceil(this.x + this.radius - this.gameArea.gameWidth);
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
                this.gameArea.y = Math.floor(this.y - this.radius);
            } else if (isOutOfYBounds === 1) {
                this.gameArea.y = Math.ceil(this.y + this.radius - this.gameArea.gameHeight);
            }
        }
    }
    
    collideOnShield(x, y, offset) {
        console.log("SPEED X" + this.speedX + " SPEED Y " + this.speedY);
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
        console.log("SPEED X AFTER " + this.speedX + " SPEED Y AFTER " + this.speedY);
        this.bumping = true;
    }

    /*collidingWithEnemies() {
        //COLLIDING LOGIC
    }*/

}