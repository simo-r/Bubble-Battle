// TUTTO QUESTO FUNZIONA FINCHé MAXSPEED < RADIUS altrimenti potrebbe oltrepassare lo shield
// per risolvere potrei fare l'intersezione tra i segmenti dello shield e il vettore spostamento
// anzi meglio rappresentare il vettore spostamento come un rettangolo dato dalla somma 
// dei quadrati che circoscrivono il cerchio e controllare se il rettangolo interseca un segmento

class Game {
    constructor() {
        this.canvas = document.getElementById("bbCanvas");
        this.ctx = this.canvas.getContext("2d", {alpha: false});
        this.ctx.shadowBlur = 0;
        this.stage = document.getElementById("content");
        this.mBackground = null;
        this.mBubble = null;
        this.mShield = null;
        this.mGameUi = null;
        this.mBubbleArr = [];
        this.frameCount = 1;
        this.frameMod = 500;
        this.gameEnd = false;
        this.topBottomMargin = 0;
        this.leftRightMargin = 0;
        this.scaleToCover = 0;
        this.lastCalledTime = 0;
        this.totalEnemyBubble = 100;
        assert(this.totalEnemyBubble < Game.getMaxEnemyBubble(), "Too many enemies bubbles");
        this.fps = 0;
        this.delta = 0;
    }

    static getMaxEnemyBubble() {
        return 1000;
    }

    static createGame(background) {
        let tmpGame = new Game();
        tmpGame.createComponents(background);
        tmpGame.scaleForWindowResize();
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

    get isGameEnd() {
        return this.gameEnd;
    }

    /**
     * Crea i componenti del gioco
     *
     * @param background immagine del background
     */
    createComponents(background) {
        let gameWidth = background.width;
        let gameHeight = background.height;
        let canvasHalfWidth = this.canvas.width / 2;
        let canvasHalfHeight = this.canvas.height / 2;
        let radius = 30;
        let leftOffset = getRandomInteger(canvasHalfWidth + radius - gameWidth, canvasHalfWidth - radius);
        let topOffset = getRandomInteger(canvasHalfHeight + radius - gameHeight, canvasHalfHeight - radius);
        //let leftOffset = canvasHalfWidth + radius - gameWidth;
        //let topOffset = canvasHalfHeight + radius - gameHeight;
        this.mBackground = BackgroundComponent.createBackground(leftOffset, topOffset, background);
        this.mGameUi = new GameUi();
        this.mBubble = UserBubble.createUserBubble(canvasHalfWidth, canvasHalfHeight, radius, 0, 0, getRandomColor(), this.mBackground, 0);
        this.mShield = Shield.createShield(this.canvas, this.mBackground);
        for (let i = 0; i < this.totalEnemyBubble; i++) {
            this.mBubbleArr.push(this.spawnBubble(i + 1));
        }
        this.mBubbleArr.sort(function (b1, b2) {
            return b1.getRadius - b2.getRadius;
        });
        this.mBubbleArr.forEach(bubble => {
            console.log("BUBBLE NAME" + bubble.getName + " RADIUS " + bubble.getRadius);
        });
        this.updateRankingUi();
    }
    
    /**
     * Muove i componenti del gioco e controlla
     * le loro posizioni
     */
    move() {
        this.mShield.checkGameArea(this.mBackground.gameWidth, this.mBackground.gameHeight);
        this.mBubble.updateSpeed();
        if (!this.mShield.checkCollision(this.mBubble)) {
            this.mBubble.checkGameAreaCollision();
        }
        this.mBackground.move(this.mBubble.speedX, this.mBubble.speedY);

        if (this.frameCount % this.frameMod === 0) {
            this.mBubbleArr.forEach(v =>
                v.changeDirection());
        }
        for (let i = 0; i < this.mBubbleArr.length; i++) {
            let bubble = this.mBubbleArr[i];
            bubble.updateSpeed();
            if (!this.mShield.checkCollision(bubble)) {
                bubble.checkGameAreaCollision();
            }
            bubble.move();
        }
        let find = false;
        let bubble;
        let intersectionLen;
        for (let i = 0; i < this.mBubbleArr.length; i++) {
            bubble = this.mBubbleArr[i];
            intersectionLen = this.mBubble.collideOnBubble(bubble);
            if (intersectionLen > 0) {
                find = true;
                Game.bubbleCollidingLogic(this.mBubble, bubble, intersectionLen);
                if (!this.bubbleKillLogic(bubble, i) && this.mBubbleArr.length > 1) {
                    sortBubbles(this.mBubbleArr, i);
                }
            }
        }
        this.bubbleKillLogic(this.mBubble);
        if (find) {
            this.updateRankingUi();
            this.updateLifeUi();
        }
        this.frameCount++;
        if (this.frameCount > this.frameMod) {
            this.frameCount = 1;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#9b9b9b";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.mBackground.draw(this.ctx);
        this.mBubbleArr.forEach(bubble => {
            bubble.draw(this.ctx);
        });
        this.ctx.save();
        this.mBubble.draw(this.ctx);
        this.ctx.restore();

        this.ctx.save();
        this.ctx.translate(this.mBackground.x, this.mBackground.y);
        this.mShield.draw(this.ctx);
        this.ctx.restore();
        this.updateFpsUi();
    }

    /**
     * Se il raggio della bolla è minore del minimo raggio
     * allora elimina la bolla dall'array se questa era un'enemy bubble
     * o termina il gioco se questa era l'user bubble
     *
     * @param bubble bolla da controllare
     * @param i indice della bolla nell'array, -1 se è user bubble
     *
     * @return {boolean} true se bubble è stata eliminata, false altrimenti.
     */
    bubbleKillLogic(bubble, i = -1) {
        let killed = false;
        if (bubble.getRadius < Bubble.getMinRadius()) {
            killed = true;
            switch (i) {
                case -1:
                    this.gameEnd = true;
                    console.log("GAME OVER " + reqId);
                    this.gameEndLogic(false);
                    break;
                default:
                    console.log("KILL");
                    this.mBubbleArr.splice(i, 1);
                    this.updateEnemyCounterUi();
                    if (this.mBubbleArr.length === 0) {
                        this.gameEnd = true;
                        this.gameEndLogic(true);
                    }
                    break;
            }
        }
        return killed;
    }

    /**
     * @param result {boolean} true vittoria, false altrimenti
     */
    gameEndLogic(result) {
        this.gameWin = result;
        this.mGameUi.saveCtx();
        this.mGameUi.scaleCtx(1 / this.scaleToCover, 1 / this.scaleToCover);
        this.mGameUi.translateCtx(-this.leftRightMargin, -this.topBottomMargin);
        this.mGameUi.drawGameEnd(result);
        this.mGameUi.restoreCtx();
    }

    updateEnemyCounterUi() {
        this.mGameUi.saveCtx();
        this.mGameUi.scaleCtx(1 / this.scaleToCover, 1 / this.scaleToCover);
        this.mGameUi.translateCtx(-this.leftRightMargin, -this.topBottomMargin);
        this.mGameUi.drawPlayerCounter(this.mBubbleArr.length, this.totalEnemyBubble - this.mBubbleArr.length);
        this.mGameUi.restoreCtx();
    }

    updateRankingUi() {
        this.mGameUi.saveCtx();
        this.mGameUi.scaleCtx(1 / this.scaleToCover, 1 / this.scaleToCover);
        this.mGameUi.translateCtx(-this.leftRightMargin, -this.topBottomMargin);
        this.mGameUi.drawRanking(this.mBubbleArr, this.mBubble);
        this.mGameUi.restoreCtx();
    }

    updateLifeUi() {
        this.mGameUi.saveCtx();
        this.mGameUi.scaleCtx(1 / this.scaleToCover, 1 / this.scaleToCover);
        this.mGameUi.translateCtx(-this.leftRightMargin, -this.topBottomMargin);
        this.mGameUi.drawUserLife(this.mBubble.radius - Bubble.getMinRadius());
        this.mGameUi.restoreCtx();
    }

    updateFpsUi() {
        this.mGameUi.saveCtx();
        this.mGameUi.scaleCtx(1 / this.scaleToCover, 1 / this.scaleToCover);
        this.mGameUi.translateCtx(-this.leftRightMargin, -this.topBottomMargin);
        this.mGameUi.drawFps(this.fps);
        this.mGameUi.restoreCtx();
    }
    
    /**
     * Logica resize della finesta di gioco
     */
    scaleForWindowResize() {
        let canvasWidth = this.canvas.width;
        let canvasHeight = this.canvas.height;
        let scaleX = window.innerWidth / canvasWidth;
        let scaleY = window.innerHeight / canvasHeight;
        this.scaleToCover = Math.max(scaleX, scaleY);
        this.stage.style.transformOrigin = '0 0';
        this.stage.style.transform = 'scale(' + this.scaleToCover + ')';
        this.topBottomMargin = Math.round((window.innerHeight - (canvasHeight * this.scaleToCover)) / 2);
        this.leftRightMargin = Math.round((window.innerWidth - (canvasWidth * this.scaleToCover)) / 2);
        this.stage.style.margin = this.topBottomMargin + "px " + this.leftRightMargin + "px ";
        // UI
        this.mGameUi.clearAll();
        this.mGameUi.updateScaleRatio(this.scaleToCover);
        this.updateRankingUi();
        this.updateEnemyCounterUi();
        this.updateLifeUi();
        if (this.gameEnd) {
            this.gameEndLogic(this.gameWin);
        }
    }

    /**
     * Richiama le funzione per muovere i
     * componenti e poi li disegna
     */
    gameLoop() {
        if (!this.lastCalledTime) {
            this.lastCalledTime = Date.now();
            this.fps = 0;
            return;
        }
        this.delta = (Date.now() - this.lastCalledTime) / 1000;
        this.lastCalledTime = Date.now();
        this.fps = Math.round(1 / this.delta);
        //COLLIDING LOGIC FOR-EACH CIRCLE
        this.move();
        this.draw();
    }
    

    /**
     * Crea una nuova bolla
     *
     * @param i nome della bubble da creare
     */
    spawnBubble(i) {
        //const radius = 30;
        const radius = getRandomInteger(Bubble.getMinRadius(),100);
        const x = getRandomInteger(this.mBackground.x + radius, this.mBackground.x + this.mBackground.gameWidth - radius);
        const y = getRandomInteger(this.mBackground.y + radius, this.mBackground.y + this.mBackground.gameHeight - radius);
        //const x = this.mBackground.x + radius +5;
        //const y = this.mBackground.y + radius + 5;
        const speedX = 0;
        const speedY = 0;
        return new EnemyBubble(x, y, radius, speedX, speedY, getRandomColor(), this.mBackground, i);
    }


}