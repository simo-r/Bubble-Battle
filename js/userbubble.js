class UserBubble {
    constructor(x, y, radius, color,gameArea) {
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.color = color;
        this.keys = {};
        this.gameArea = gameArea;
        this.isColliding = false;
        this.acceleration = 0.3;
        this.maxSpeed = 10;
        
    }

    static createUserBubble(x, y, radius, color,gameArea) {
        let tmpUserBubble = new UserBubble(x, y, radius, color,gameArea);
        UserBubble.addKeyListeners(tmpUserBubble);
        return tmpUserBubble;
    }
    
    checkXMovements(){
        let isOutOfXBounds = this.gameArea.isOutOfXBounds(this.x,this.radius);
        if(isOutOfXBounds){
            this.gameArea.speedX = 0;
            if (isOutOfXBounds === -1 ){
                this.gameArea.x = this.x - this.radius;
                console.log("OUT LEFT");
            }else if(isOutOfXBounds === 1 ){
                this.gameArea.x = this.x + this.radius - this.gameArea.gameWidth;
                console.log("OUT RIGHT");
            }
        }else{
            this.moveX();
        }
    }
    
    checkYMovements(){
        let isOutOfYBounds = this.gameArea.isOutOfYBounds(this.y,this.radius);
        if(isOutOfYBounds){
            this.gameArea.speedY = 0;
            if(isOutOfYBounds === -1){
                this.gameArea.y = this.y - this.radius;
                console.log("OUT TOP")
            }else if(isOutOfYBounds === 1){
                this.gameArea.y = this.y + this.radius - this.gameArea.gameHeight;
                console.log("OUT DOWN");
            }
        }else{
            this.moveY();
        }
    }

    move(){
        if (!(Object.keys(this.keys).length === 0 && this.keys.constructor === Object)) {
            this.checkXMovements();
            this.checkYMovements();
        }
    }
    
    moveY(){
        if((this.keys['KeyS'] && this.keys['KeyW']) ||
            (this.gameArea.speedY !== 0 && !(this.keys['KeyS'] || this.keys['KeyW']))){
            //console.log("RALLENTA X");
            this.gameArea.slowDownY(this.acceleration);
            //RALLENTA
        }else if(this.keys['KeyW']){
            //console.log("MUOVITI A SINISTRA");
            this.gameArea.moveUp(this.acceleration,this.maxSpeed);
            //MOVE LEFT
        }else if(this.keys['KeyS']){
            //console.log("MUOVITI A DESTRA");
            this.gameArea.moveDown(this.acceleration,this.maxSpeed);
            //MOVE RIGHT
        }
    }
    
    moveX(){
        if((this.keys['KeyD'] && this.keys['KeyA']) ||
            (this.gameArea.speedX !== 0 && !(this.keys['KeyD'] || this.keys['KeyA']))){
            //console.log("RALLENTA X");
            this.gameArea.slowDownX(this.acceleration);
            //RALLENTA
        }else if(this.keys['KeyA'] ){
            //console.log("MUOVITI A SINISTRA");
            this.gameArea.moveLeft(this.acceleration,this.maxSpeed);
            console.log("SX");
            //MOVE LEFT
        }else if(this.keys['KeyD'] ){
            //console.log("MUOVITI A DESTRA");
            console.log("SXX");
            this.gameArea.moveRight(this.acceleration,this.maxSpeed);
            //MOVE RIGHT
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    hitDetection(circle) {
        let r = this.radius + circle.radius;
        let x = this.x - circle.x;
        let y = this.y - circle.y;
        return r > Math.sqrt((x * x) + (y * y));
    }

    /*collidingWithEnemies() {
        //COLLIDING LOGIC
    }*/
    
    static addKeyListeners(bubble){
        let keyDownFun = function (e){
            if (e.code === 'KeyW' || e.code === 'KeyA' || e.code === 'KeyS' || e.code === 'KeyD') {
                bubble.keys[e.code] = true;
                //console.log("KEY DOWN " + e.code);
            }
        };
        let keyUpFun = function ( e ) {
            if (e.code === 'KeyW' || e.code === 'KeyA' || e.code === 'KeyS' || e.code === 'KeyD') {
                bubble.keys[e.code] = false;
                //console.log("KEY UP " + e.code);
            }
        };
        window.addEventListener('keydown', keyDownFun);
        window.addEventListener('keyup', keyUpFun);
    }
    
}