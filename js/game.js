//TODO 
// Rimuovere il keypress quando la window perde il focus
// Refactoring codice del movimento, far muovere le altre bubble con i tasti

// TUTTO QUESTO FUNZIONA FINCHé MAXSPEED < RADIUS altrimenti potrebbe oltrepassare lo shield
// per risolvere potrei fare l'intersezione tra i segmenti dello shield e il vettore spostamento
// anzi meglio rappresentare il vettore spostamento come un rettangolo dato dalla somma 
// dei quadrati che circoscrivono il cerchio e controllare se il rettangolo interseca un segmento
class Game {
    constructor() {
        this.canvas = document.getElementById("bbCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.stage = document.getElementById("content");
        this.mBackground = null;
        this.mBubble = null;
        this.mShield = null;
        this.mBubbleArr = [];
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
        let canvasHalfWidth = this.canvas.width / 2;
        let canvasHalfHeight = this.canvas.height / 2;
        let radius = 30;
        let leftOffset = getRandomInteger(canvasHalfWidth + radius - gameWidth, canvasHalfWidth - radius);
        let topOffset = getRandomInteger(canvasHalfHeight + radius - gameHeight, canvasHalfHeight - radius);
        this.mBackground = BackgroundComponent.createBackground(leftOffset, topOffset, background);
        //let bgCallback = this.mBackground.getBubbleCallbacks();
        this.mBubble = UserBubble.createUserBubble(canvasHalfWidth, canvasHalfHeight, radius, 0, 0, getRandomColor(), this.mBackground);
        this.mShield = Shield.createShield(this.canvas, this.mBackground);
        for (let i = 0; i < 1000; i++)
            this.spawnBubble();
        console.log("BACKGROUND X " + leftOffset + " BACKGROUND Y " + topOffset);
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

    gameLoop() {
        //COLLIDING LOGIC FOR-EACH CIRCLE
        this.move();
        this.draw();
    }

    move() {
        // INIZIO MOVIMENTO BUBBLE UTENTE
        this.mBubble.move();
        if (!this.mShield.checkCollision(this.mBubble))
            this.mBubble.checkGameAreaCollision();
        this.mBackground.move(this.mBubble.speedX, this.mBubble.speedY);
        // FINE MOVIMENTO BUBBLE UTENTE
        this.mBubbleArr.forEach(bubble => {
            bubble.move();
            if (!this.mShield.checkCollision(bubble))
                bubble.checkGameAreaCollision();
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.mBackground.draw(this.ctx);
        this.mBubbleArr.forEach(v => {
            /*this.ctx.save();
            this.ctx.translate(this.mBackground.x - v.oldGameAreaX, this.mBackground.y - v.oldGameAreaY);*/
            v.draw(this.ctx);
            //this.ctx.restore();
        });

        this.mBubble.draw(this.ctx);

        // Così evito di salvarmi il riferimento al background ALMENO nello shield
        this.ctx.save();
        this.ctx.translate(this.mBackground.x, this.mBackground.y);
        this.mShield.draw(this.ctx);
        this.ctx.restore();
    }

    spawnBubble() {
        console.log("SPAWN BUBBLE");
        const radius = getRandomInteger(25, 40);
        const x = getRandomInteger(this.mBackground.x + radius, this.mBackground.x + this.mBackground.gameWidth - radius);
        const y = getRandomInteger(this.mBackground.y + radius, this.mBackground.y + this.mBackground.gameHeight - radius);
        //const x = this.mBackground.x + radius +5;
        //const y = this.mBackground.y + radius + 5;
        //TODO RANDOMIZE THIS SPEED
        //(Math.random() * (1 + 1) - 1);
        const speedX = 0;
        const speedY = 0;
        console.log("X " + x + " Y" + y);
        const newCircle = new EnemyBubble(x, y, radius, speedX, speedY, getRandomColor(), this.mBackground);
        this.mBubbleArr.push(newCircle);
    }
}