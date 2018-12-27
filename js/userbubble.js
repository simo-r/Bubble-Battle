class UserBubble extends Bubble {
    constructor(x, y, radius, speedX, speedY, color, gameArea) {
        super(x, y, radius, speedX, speedY, color, gameArea);
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
            }
        };
        let keyUpFun = function (e) {
            if (e.code === 'KeyW' || e.code === 'KeyA' || e.code === 'KeyS' || e.code === 'KeyD') {
                bubble.keys[e.code] = false;
            }
        };
        window.addEventListener('keydown', keyDownFun);
        window.addEventListener('keyup', keyUpFun);
    }

    //OVERRIDE + SUPER (DONE)
    updateSpeed() {
        if (!(Object.keys(this.keys).length === 0 && this.keys.constructor === Object)) {
            super.updateSpeed();
        }
    }

    //OVERRIDE (DONE) //TODO VEDI SE SI PUò NON FARE L'OVERRIDE
    checkXBoundaries() {
        let isOutOfXBounds = this.gameArea.isOutOfXBounds(this.x, this.radius);
        if (isOutOfXBounds) {
            this.speedX = 0;
            if (isOutOfXBounds === -1) {
                this.gameArea.x = Math.floor(this.x - this.radius);
            } else if (isOutOfXBounds === 1) {
                this.gameArea.x = Math.ceil(this.x + this.radius - this.gameArea.gameWidth);
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
    
}