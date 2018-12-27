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

    move(speedX,speedY) {
        this.x -= speedX;
        this.y -= speedY;
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
    
    /* Y BOUNDS */
    
    isOutOfYBounds(bubbleY,bubbleRadius){
        let topBound = bubbleY - this.y - bubbleRadius;
        let downBound = bubbleY - this.y + bubbleRadius - this.image.height;
        if(topBound < 0) return -1;
        if(downBound > 0) return 1;
        return false;
    }
    
    get gameWidth(){
        return this.image.width;
    }
    
    get gameHeight(){
        return this.image.height;
    }
    
    get getX(){
        return this.x;
    }
    
    get getY(){
        return this.y;
    }
}