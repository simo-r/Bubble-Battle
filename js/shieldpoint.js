class ShieldPoint {
    constructor(x, y, backgroundX, backgroundY) {
        this.x = x;
        this.y = y;
        this.clickDrag = false;
        this.backgroundX = backgroundX;
        this.backgroundY = backgroundY;
    }

    static newPoint(e, canvas, background) {
        //Scala i punti rispetto al canvas NON SCALATO
        let scaleX = window.innerWidth / canvas.width;
        let scaleY = window.innerHeight / canvas.height;
        let scaleToCover = Math.max(scaleX, scaleY);
        let topBottomMargin = ((window.innerHeight - (canvas.height * scaleToCover)) / 2);
        let leftRightMargin = ((window.innerWidth - (canvas.width * scaleToCover)) / 2);

        const mouseX = Math.round(e.clientX - leftRightMargin) / scaleToCover;
        const mouseY = Math.round(e.clientY - topBottomMargin) / scaleToCover;
        return new ShieldPoint(mouseX, mouseY, background.x, background.y);
    }

    distanceTo(p2) {
        let distance = Math.sqrt(
            Math.pow(p2.x - (this.x + p2.backgroundX - this.backgroundX), 2) +
            Math.pow(p2.y - (this.y + p2.backgroundY - this.backgroundY), 2));
        return distance;
    }

    set setDrag(v) {
        this.clickDrag = v;
    }

    get isDrag() {
        return this.clickDrag;
    }

    get getX() {
        return this.x;
    }

    get getY() {
        return this.y;
    }

    get getBackgroundX() {
        return this.backgroundX;
    }

    get getBackgroundY() {
        return this.backgroundY;
    }
    
    get getGameX(){
        return this.x - this.backgroundX;
    }
    
    get getGameY(){
        return this.y - this.backgroundY;
    }
    
    toString(){
        return " X " + (this.x - this.backgroundX)+ " Y " + (this.y-this.backgroundY) + " BGX " + this.backgroundX + " BGY " + this.backgroundY;
    }
}