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
                /* let speedXSign = Math.sign(this.speedX);
                 let speedYSign = Math.sign(this.speedY);
                 this.speedX = ((-(speedXSign) * this.acceleration) + this.speedX) * -1 || (speedXSign * this.acceleration);
                 this.speedY = ((-(speedYSign) * this.acceleration) + this.speedY) * -1 || (speedYSign * this.acceleration);*/
                this.bumping = false;
            } /*else if(this.bouncing) {
                this.speedX = 0;
                this.speedY = 0;
                this.bouncing = false;
            }*/ else {
                super.move();
            }
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
        /*let cx = Math.abs(this.gameArea.x - this.x);
        let cy = Math.abs(this.gameArea.y - this.y);
        let ipo = Math.trunc(Math.round(Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2))));
        let catmag = Math.trunc(Math.round(y - this.y));
        let catmin = Math.trunc(Math.round(x - this.x));
        let angle;
        let anglesign = Math.sign(catmin);
        if (Math.abs(catmag) === Math.abs(ipo)) {
            console.log("CAT MAG === IPO");
            angle = Math.sign(catmag) * 90 * Math.PI / 180;
        } else if (Math.abs(catmin) === Math.abs(ipo)) {
            angle = 0;
            console.log("CAT MIN === IPO");
        } else {
            angle = (Math.atan(catmag / catmin));
        }
        if (offset < 1 && offset > -1) offset = Math.sign(offset);
        offset = Math.sign(offset) * Math.ceil(Math.abs(offset));
        let xnew = (offset) * Math.cos(angle);
        let ynew = ((offset) * Math.sin(angle));
        let xsign = Math.sign(xnew);
        let ysign = Math.sign(ynew);
        if (xnew < 1 && xnew > -1) xnew = Math.sign(xnew);
        if (ynew < 1 && ynew > -1) ynew = Math.sign(ynew);
        xnew = Math.sign(xnew) * Math.ceil(Math.abs(xnew));
        ynew = Math.sign(ynew) * Math.ceil(Math.abs(ynew));
        if (Math.abs(angle) === 0) ynew = 0;
        if (Math.abs(angle) === (90 * Math.PI / 180)) xnew = 0;*/

        //TODO RIPOSIZIONARE
        /* console.log(" X " + x + " Y " + y + " OFFSET " + offset +
             " IPO " + ipo + " CAT MAG " + catmag + " CAT MIN " + catmin +
             " ANGLE " + (angle * 180 / Math.PI) + " X NEW " + xnew +
             " Y NEW " + ynew + " ANGLE SIGN " + anglesign);*/

        /*this.gameArea.x += (anglesign * Math.abs(xnew));
        this.gameArea.y -= (ynew);*/
        console.log("SPEED X" + this.speedX + " SPEED Y " + this.speedY);

        /*let speedXSign = Math.sign(this.speedX);
        let speedYSign = Math.sign(this.speedY);*/
        /*this.speedX = ((-(speedXSign)*this.acceleration) + this.speedX) * -1 || (speedXSign*this.acceleration) ;
        this.speedY = ((-(speedYSign)*this.acceleration) + this.speedY) * -1 || (speedYSign*this.acceleration) ;*/

        if (this.speedX === 0) {
            console.log("X MINUS RADIUS " + (this.x - this.radius) + " X PLUS RADIUS " + (this.x + this.radius) + " X " + x);
            if (this.x < x) {
                this.speedX = 1;
            } else if (this.x > x) {
                this.speedX = -1;
            }
        }
        if (this.speedY === 0) {
            console.log("Y MINUS RADIUS " + (this.y - this.radius) + " Y PLUS RADIUS " + (this.y + this.radius) + " Y " + y);
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