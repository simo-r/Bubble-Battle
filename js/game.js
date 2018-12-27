//TODO 
// Rimuovere il keypress quando la window perde il focus
// Inserire velocità e accelerazione min e max

// TUTTO QUESTO FUNZIONA FINCHé MAXSPEED < RADIUS altrimenti potrebbe oltrepassare lo shield
// per risolvere potrei fare l'intersezione tra i segmenti dello shield e il vettore spostamento
// anzi meglio rappresentare il vettore spostamento come un rettangolo dato dalla somma 
// dei quadrati che circoscrivono il cerchio e controllare se il rettangolo interseca un segmento
class Game {
    constructor() {
        this.canvas = document.getElementById("bbCanvas");
        this.uicanvas = document.getElementById("uiCanvas");
        this.uictx = this.uicanvas.getContext("2d", { alpha: true });
        this.ctx = this.canvas.getContext("2d", { alpha: false });
        this.stage = document.getElementById("content");
        this.mBackground = null;
        this.mBubble = null;
        this.mShield = null;
        this.mBubbleArr = [];
        this.frameCount = 1;
        this.frameMod = 500;
        this.gameOver = false;
    }

    static createGame(background) {
        let tmpGame = new Game();
        tmpGame.scaleForWindowResize();
        tmpGame.createComponents(background);
        return tmpGame;
    }

    static bubbleCollidingLogic(bubble1, bubble2, intersectionLen) {
        if (bubble1.radius > bubble2.radius) {
            // 0 <= radiusRatio <= 1
            let radiusRatio = (bubble2.radius / bubble1.radius).toFixed(2);
            bubble1.colliding(-radiusRatio, intersectionLen);
            bubble2.colliding(radiusRatio, intersectionLen);
        } else if (bubble1.radius < bubble2.radius) {
            // 0 <= radiusRatio <=1
            let radiusRatio = (bubble1.radius / bubble2.radius).toFixed(2);
            bubble1.colliding(radiusRatio, intersectionLen);
            bubble2.colliding(-radiusRatio, intersectionLen);
        } else {
            bubble1.colliding();
            bubble2.colliding();
        }
    }

    bubbleKillLogic(bubble, i = -1) {
        if (bubble.getRadius < Bubble.getMinRadius()) {
            switch (i) {
                case -1:
                    //TODO GAME OVER LOGIC
                    this.gameOver = true;
                    console.log("GAME OVER " + reqId);
                    break;
                default:
                    console.log("KILLED " + i);
                    this.mBubbleArr.splice(i, 1);
                    break;
            }


        }
    }

    createComponents(background) {
        let gameWidth = background.width;
        let gameHeight = background.height;
        let canvasHalfWidth = this.canvas.width / 2;
        let canvasHalfHeight = this.canvas.height / 2;
        let radius = 30;
        //let leftOffset = getRandomInteger(canvasHalfWidth + radius - gameWidth, canvasHalfWidth - radius);
        //let topOffset = getRandomInteger(canvasHalfHeight + radius - gameHeight, canvasHalfHeight - radius);
        let leftOffset = canvasHalfWidth + radius - gameWidth;
        let topOffset = canvasHalfHeight + radius - gameHeight;
        this.mBackground = BackgroundComponent.createBackground(leftOffset, topOffset, background);
        //let bgCallback = this.mBackground.getBubbleCallbacks();
        this.mBubble = UserBubble.createUserBubble(canvasHalfWidth, canvasHalfHeight, radius, 0, 0, getRandomColor(), this.mBackground);
        this.mShield = Shield.createShield(this.canvas, this.mBackground);
        for (let i = 0; i < 100; i++)
            this.spawnBubble();
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
        // CHECK SE LO SHIELD è FUORI DALLA GAME AREA
        this.mShield.checkGameArea(this.mBackground.gameWidth, this.mBackground.gameHeight);
        // INIZIO MOVIMENTO BUBBLE UTENTE
        this.mBubble.updateSpeed();
        if (!this.mShield.checkCollision(this.mBubble)) {
            this.mBubble.checkGameAreaCollision();
        }
        this.mBackground.move(this.mBubble.speedX, this.mBubble.speedY);
        // FINE MOVIMENTO BUBBLE UTENTE
        for (let i = 0; i < this.mBubbleArr.length; i++) {
            let bubble = this.mBubbleArr[i];
            if (this.frameCount % this.frameMod === 0) {
                bubble.changeDirection();
            }
            bubble.updateSpeed();
            if (!this.mShield.checkCollision(bubble)) {
                bubble.checkGameAreaCollision();
            }
            bubble.move();
        }

        for (let i = 0; i < this.mBubbleArr.length; i++) {
            let bubble = this.mBubbleArr[i];
            let intersectionLen = this.mBubble.collideOnBubble(bubble);
            if (intersectionLen > 0) {
                Game.bubbleCollidingLogic(this.mBubble, bubble, intersectionLen);
                this.bubbleKillLogic(bubble, i);
            }
        }
        this.bubbleKillLogic(this.mBubble);

        this.frameCount++;
        if (this.frameCount > this.frameMod) {
            this.frameCount = 1;
        }
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.mBackground.draw(this.ctx);
        this.mBubbleArr.forEach(bubble => {
            /*this.ctx.save();
            this.ctx.translate(+this.mBackground.x - bubble.oldGameAreaX,+this.mBackground.y - bubble.oldGameAreaY);
            */
            bubble.draw(this.ctx);
            /*this.ctx.restore();*/
        });
        this.mBubble.draw(this.ctx);
        // Così evito di salvarmi il riferimento al background ALMENO nello shield
        this.ctx.save();
        this.ctx.translate(this.mBackground.x, this.mBackground.y);
        this.mShield.draw(this.ctx);
        this.ctx.restore();


        
        this.uictx.font = '48px serif';
        this.uictx.textBaseline = 'hanging';
        this.uictx.color = 'black';
        this.uictx.fillText('Hello world', 0, 100);
        
    }

    spawnBubble() {
        //const radius = 30;
        const radius = getRandomInteger(25, 40);
        const x = getRandomInteger(this.mBackground.x + radius, this.mBackground.x + this.mBackground.gameWidth - radius);
        const y = getRandomInteger(this.mBackground.y + radius, this.mBackground.y + this.mBackground.gameHeight - radius);
        //const x = this.mBackground.x + radius +5;
        //const y = this.mBackground.y + radius + 5;
        //TODO RANDOMIZE THIS SPEED
        //(Math.random() * (1 + 1) - 1);
        const speedX = 0;
        const speedY = 0;
        const newCircle = new EnemyBubble(x, y, radius, speedX, speedY, getRandomColor(), this.mBackground);
        this.mBubbleArr.push(newCircle);
    }

    get isGameOver(){
        return this.gameOver;
    }
}