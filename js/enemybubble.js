class EnemyBubble extends Bubble{
    constructor(x, y, radius, speedX,speedY, color, gameArea) {
        super(x,y,radius,speedX,speedY,color,gameArea);
        
        //DEBUG
        this.maxSpeed = 10;
        this.oldGameAreaX = this.gameArea.x;
        this.oldGameAreaY = this.gameArea.y;
    }
    
    moveX(){
        super.moveX();
        this.x += this.speedX + (this.gameArea.x - this.oldGameAreaX);
        this.oldGameAreaX = this.gameArea.x;
    }
    
    moveY(){
        super.moveY();
        this.y += this.speedY + (this.gameArea.y - this.oldGameAreaY);
        this.oldGameAreaY = this.gameArea.y;
    }
    
    
}