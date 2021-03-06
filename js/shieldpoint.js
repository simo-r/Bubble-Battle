class ShieldPoint {
    constructor(x, y, backgroundX, backgroundY) {
        this.x = x;
        this.y = y;
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

    static dist(x1, y1, x2, y2) {
        let x = x1 - x2;
        let y = y1 - y2;
        return Math.sqrt(x * x + y * y);
    }

    static distanceTo(p1,p2) {
        return ShieldPoint.dist(p1.getGameX,p1.getGameY,p2.getGameX,p2.getGameY);
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

    get getGameX() {
        return this.x - this.backgroundX;
    }

    get getGameY() {
        return this.y - this.backgroundY;
    }

    toString() {
        return " X " + (this.x - this.backgroundX) + " Y " + (this.y - this.backgroundY) + " BGX " + this.backgroundX + " BGY " + this.backgroundY;
    }
}