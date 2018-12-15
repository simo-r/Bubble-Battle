class EnemyBubble {
    constructor(x, y, radius, color, gameArea) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.gameArea = gameArea;
        this.maxSpeed = 10;
        this.gamex = this.gameArea.x;
        this.gamey = this.gameArea.y;
    }
    
    checkXMovements(){
        let isOutOfXBounds = this.gameArea.isOutOfXBounds(this.x,this.radius);
        if(isOutOfXBounds){
            if (isOutOfXBounds === -1 ){
                this.x = this.gameArea.x + this.radius;
                this.speedX = 1;
                console.log("ENEMY BUBBLE OUT LEFT");
            }else if(isOutOfXBounds === 1 ){
                this.x = this.gameArea.x + this.gameArea.gameWidth - this.radius;
                this.speedX = -1;
                console.log("ENEMY BUBBLE OUT RIGHT");
            }
        }
    }
    
    checkYMovements(){
        let isOutOfYBounds = this.gameArea.isOutOfYBounds(this.y, this.radius);
        if(isOutOfYBounds){
            if (isOutOfYBounds === -1 ){
                this.y = this.gameArea.y + this.radius;
                this.speedY = 1;
                console.log("ENEMY BUBBLE OUT TOP");
            }else if(isOutOfYBounds === 1 ){
                this.y = this.gameArea.y + this.gameArea.gameHeight - this.radius;
                this.speedY = -1;
                console.log("ENEMY BUBBLE OUT DOWN");
            }
        }
    }

    move() {
        //TODO Puoi spostare questo in una traslazione nel contesto dall'observer
        this.x += this.speedX + (this.gameArea.x - this.gamex);
        this.gamex = this.gameArea.x;
        this.y += this.speedY + (this.gameArea.y - this.gamey);
        this.gamey = this.gameArea.y;
        this.checkXMovements();
        this.checkYMovements();
        //COLLIDING WITH SHIELD
        //console.log("BUBBLE MOVE");
    }

    //TODO PROVA A PASSARE IL CONTESTO TRASLATO DI SPEEDX - SPEEDY
    draw(ctx) {
        //console.log("BUBBLE DRAW");
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}