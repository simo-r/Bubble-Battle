class Game{
    constructor(){
        this.canvas = document.getElementById("bbCanvas");;
        this.ctx = this.canvas.getContext("2d");
        this.stage = document.getElementById("content");
        this.mBackground = null;
        this.mBubble = null;
    }

    static createGame(background) {
        let tmpGame = new Game();
        tmpGame.scaleForWindowResize();
        tmpGame.createComponents(background);
        return tmpGame;
    }
    
    createComponents(background) {
        let gameWidth = background.width;
        let gameHeight = background.height;
        let canvasHalfWidth = this.canvas.width /2;
        let canvasHalfHeight = this.canvas.height /2;
        let radius = 30;
        let leftOffset = getRandomInteger(canvasHalfWidth + radius - gameWidth, canvasHalfWidth - radius);
        let topOffset = getRandomInteger(canvasHalfHeight + radius - gameHeight, canvasHalfHeight - radius);
        this.mBackground = BackgroundComponent.createBackground(leftOffset, topOffset,background);
        //let bgCallback = this.mBackground.getUserBubbleCallback();
        this.mBubble = UserBubble.createUserBubble(canvasHalfWidth, canvasHalfHeight, radius, getRandomColor());
    }

    scaleForWindowResize() {
        let canvasWidth = this.canvas.width;
        let canvasHeight = this.canvas.height;
        let scaleX = window.innerWidth / canvasWidth;
        let scaleY = window.innerHeight / canvasHeight;
        //let scaleToFit = Math.min(scaleX, scaleY);
        let scaleToCover = Math.max(scaleX, scaleY);
        this.stage.style.transformOrigin = '0 0'; //scale from top left
        this.stage.style.transform = 'scale(' + scaleToCover + ')';
        let topBottomMargin = ((window.innerHeight - (canvasHeight * scaleToCover)) / 2);
        let leftRightMargin = ((window.innerWidth - (canvasWidth * scaleToCover)) / 2);
        this.stage.style.margin = topBottomMargin + "px " + leftRightMargin + "px " + topBottomMargin + "px " + leftRightMargin + "px";
        console.log("SCALE FOR WINDOW RESIZE");
    }
    
    gameLoop(){
        //COLLIDING LOGIC FOR-EACH CIRCLE
        //this.move();
        this.draw();
    }
    
    draw(){
        this.mBackground.draw(this.ctx);
        this.mBubble.draw(this.ctx);
    }
}