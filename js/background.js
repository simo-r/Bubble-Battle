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
        this.x -= this.speedX;
        this.y -= this.speedY;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y);
    }
}