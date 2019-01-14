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

    move(speedX,speedY) {
        this.x -= speedX;
        this.y -= speedY;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y);
    }
    
    /**
     * Controlla i bordi della game area sull'asse delle ascisse
     *
     * @param bubbleX centro della bolla
     * @param bubbleRadius raggio della bolla
     * @returns {number,boolean} -1 se è fuori il bordo sinistro, 1 se è fuori il bordo destro
     *          altrimenti false
     */
    isOutOfXBounds(bubbleX, bubbleRadius) {
        let leftBound = (bubbleX - this.x - bubbleRadius);
        if(leftBound < 0) return -1;
        let rightBound = (bubbleX - this.x + bubbleRadius -this.image.width);
        if(rightBound > 0) return 1;
        return false;
    }
   
    /**
     * Controlla i bordi della game area sull'asse delle ordinate
     *
     * @param bubbleY centro della bolla
     * @param bubbleRadius raggio della bolla
     * @returns {number,boolean} -1 se è fuori il bordo superiore, 1 se è fuori il bordo inferiore
     *          altrimenti false
     */
    isOutOfYBounds(bubbleY,bubbleRadius){
        let topBound = bubbleY - this.y - bubbleRadius;
        let downBound = bubbleY - this.y + bubbleRadius - this.image.height;
        if(topBound < 0) return -1;
        if(downBound > 0) return 1;
        return false;
    }
}