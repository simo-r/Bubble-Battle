class UserBubble extends Bubble {
    constructor(x, y, radius, speedX, speedY, color, gameArea,name) {
        super(x, y, radius, speedX, speedY, color, gameArea,name);
    }

    static createUserBubble(x, y, radius, speedX, speedY, color, gameArea,name) {
        let tmpUserBubble = new UserBubble(x, y, radius, speedX, speedY, color, gameArea,name);
        UserBubble.addKeyListeners(tmpUserBubble);
        return tmpUserBubble;
    }
    
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
    
    /**
     * Override
     */
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

    /**
     * Override
     */
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