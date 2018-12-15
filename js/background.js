//TODO Prova a fare il background usando CSS ( Mozilla guide)
// Non la renderizzo off-screen perché l'Image effettua il load 
// dell'intera bitmap in memoria rispettando le size specificate nell'svg.

class BackgroundComponent {
    constructor(x, y, bgImage) {
        this.x = x;
        this.y = y;
        this.image = bgImage;
        this.speedX = 0;
        this.speedY = 0;
    }

    static createBackground(x, y, bgImage) {
        return new BackgroundComponent(x, y, bgImage);
    }

    move() {
        //console.log("SPEED X" + this.speedX);
        this.x -= this.speedX;
        this.y -= this.speedY;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y);
    }
    
    /* X BOUNDS */

    isOutOfXBounds(bubbleX, bubbleRadius) {
        let leftBound = (bubbleX - this.x - bubbleRadius);
        if(leftBound < 0) return -1;
        let rightBound = (bubbleX - this.x + bubbleRadius -this.image.width);
        if(rightBound > 0) return 1;
        return false;
    }

    slowDownX(acceleration) {
        if (this.speedX > 0) {
            if ((this.speedX -= acceleration) < 0) {
                this.speedX = 0;
            }
        } else if (this.speedX < 0) {
            if ((this.speedX += acceleration) > 0) {
                this.speedX = 0;
            }
        }
    }

    moveLeft(acceleration, maxSpeed) {
        if (this.speedX !== -maxSpeed) {
            this.speedX -= acceleration;
            if (this.speedX < -(maxSpeed)) {
                this.speedX = -(maxSpeed);
            }
        }
    }
    
    moveRight(acceleration,maxSpeed){
        if(this.speedX !== maxSpeed){
            this.speedX += acceleration;
            if(this.speedX > maxSpeed){
                this.speedX = maxSpeed;
            }
        }
    }
    
    /* Y BOUNDS */
    
    isOutOfYBounds(bubbleY,bubbleRadius){
        let topBound = bubbleY - this.y - bubbleRadius;
        let downBound = bubbleY - this.y + bubbleRadius - this.image.height;
        if(topBound < 0) return -1;
        if(downBound > 0) return 1;
        return false;
    }
    
    slowDownY(acceleration) {
        if (this.speedY > 0) {
            if ((this.speedY -= acceleration) < 0) {
                this.speedY = 0;
            }
        } else if (this.speedY < 0) {
            if ((this.speedY += acceleration) > 0) {
                this.speedY = 0;
            }
        }
    }

    moveUp(acceleration, maxSpeed) {
        if (this.speedY !== -maxSpeed) {
            this.speedY -= acceleration;
            if (this.speedY < -(maxSpeed)) {
                this.speedY = -(maxSpeed);
            }
        }
    }
    
    moveDown(acceleration,maxSpeed){
        if(this.speedY !== maxSpeed){
            this.speedY += acceleration;
            if(this.speedY > maxSpeed){
                this.speedY = maxSpeed;
            }
        }
    }
    
    get gameWidth(){
        return this.image.width;
    }
    
    get gameHeight(){
        return this.image.height;
    }
}