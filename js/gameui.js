class GameUi {
    constructor() {
        this.canvas = document.getElementById("uiCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.shadowBlur = 0;
        this.fontSize = GameUi.getDefaultFontSize();
        this.lifeHeight = GameUi.getDefaultLifeHeight();
        this.lifeWidth = GameUi.getDefaultLifeWidth();
        this.lifePercentage = 0;
        this.userLifeX = 0;
        this.userLifeY = 0;
        this.enemyCounterText = " ENEMY COUNTER ";
        this.enemyCounterTextMaxWidth = 0;
        this.killCounterTextMaxWidth = 0;
        this.halfWindowWidth = 0;
        this.rankX = 0;
        this.rankMaxWidth = 0;
    }


    static getDefaultLifeHeight() {
        return 25;
    }

    static getDefaultLifeWidth() {
        return 200;
    }

    static getDefaultFontSize() {
        return 16;
    }

    static getWinString() {
        return "Hai vinto";
    }

    static getLostString() {
        return "Hai perso";
    }

    static getReloadString() {
        return "Ricarica la pagina per giocare";
    }

    clearAll() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawPlayerCounter(counter, killedPlayers) {
        this.ctx.textBaseline = 'top';
        // Clear enemy counter space
        this.ctx.clearRect(0, 0, this.enemyCounterTextMaxWidth, this.fontSize);
        // Clear kill counter space
        this.ctx.clearRect(this.halfWindowWidth, 0, this.killCounterTextMaxWidth, this.fontSize);
        // Draw enemy counter
        this.ctx.fillText(this.enemyCounterText + counter, 0, 0);
        // Draw kill counter
        this.ctx.fillText(killedPlayers, this.halfWindowWidth, 0);
    }

    drawUserLife(life) {
        let tot = Math.round(life * this.lifePercentage);
        this.ctx.clearRect(this.userLifeX, this.userLifeY, this.lifeWidth, this.lifeHeight);
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.userLifeX, this.userLifeY, tot, this.lifeHeight);
        this.ctx.strokeStyle = 'blue';
        this.ctx.strokeRect(this.userLifeX, this.userLifeY, this.lifeWidth, this.lifeHeight);
    }

    drawFps(fps) {
        //console.log("RANK X " + this.rankX + " USER Y " + this.userLifeY);
        this.ctx.textBaseline = 'top';
        this.ctx.clearRect(this.rankX, this.userLifeY,
            window.innerWidth - this.rankX, window.innerHeight - this.fontSize);
        this.ctx.fillText(fps, this.rankX, this.userLifeY);
    }
    
    drawRanking(players, userBubble) {
        this.ctx.textBaseline = 'top';
        this.ctx.clearRect(this.rankX, 0, this.rankMaxWidth, this.fontSize * 11);
        if (players.length === 0) {
            this.ctx.fillText("1. " + (userBubble.getName) + " - " + Math.round(userBubble.getRadius), this.rankX, 0);
            return;
        }
        let currBubble;
        let i = players.length - 1;
        let j = 1;
        let find = false;
        // Scrivo la top 10
        while (i >= 0 && j <= 10) {
            currBubble = players[i];
            if (!find && userBubble.getRadius >= currBubble.getRadius) {
                find = true;
                this.ctx.fillText(j + ". " + (userBubble.getName) + " - " + Math.round(userBubble.getRadius), this.rankX, this.fontSize * (j - 1));
            } else {
                this.ctx.fillText(j + ". " + (currBubble.getName) + " - " + Math.round(currBubble.getRadius), this.rankX, this.fontSize * (j - 1));
                i--;
            }
            j++;
        }
        if (!find) {
            // Se non sono in top 10, ricerco la mia vera posizione
            console.log("NOT FIND ");
            console.log(" I DOPO " + i);
            for (let h = i; h >= 0; h--) {
                if (userBubble.getRadius >= players[h].getRadius) {
                    this.ctx.fillText((h + 1) + ". " + (userBubble.getName) + " - " + Math.round(userBubble.getRadius), this.rankX, this.fontSize * (j - 1));
                    return;
                }
            }
            // Se sono la bubble più piccola allora sono all'ultima posizione
            this.ctx.fillText((players.length + 1) + ". " + (userBubble.getName) + " - " + Math.round(userBubble.getRadius), this.rankX, this.fontSize * (j - 1));
        }
    }

    drawGameEnd(result) {
        //centralo
        let resultText = result ? GameUi.getWinString() : GameUi.getLostString();
        this.ctx.textBaseline = 'middle';
        const fontSize = this.fontSize * 3;
        const halfHeight = (window.innerHeight - fontSize) / 2;
        this.ctx.font = 'bold ' + (fontSize) + 'px Courier New';
        this.ctx.fillText(resultText,
            this.halfWindowWidth - this.ctx.measureText(resultText).width / 2,
            halfHeight);
        this.ctx.font = 'bold ' + (this.fontSize) + 'px Courier New';
        this.ctx.fillText(GameUi.getReloadString(),
            this.halfWindowWidth - this.ctx.measureText(GameUi.getReloadString()).width / 2,
            halfHeight + fontSize);

    }


    saveCtx() {
        this.ctx.save();
    }

    scaleCtx(x, y) {
        this.ctx.scale(x, y);
    }

    translateCtx(x, y) {
        this.ctx.translate(x, y);
    }

    restoreCtx() {
        this.ctx.restore();
    }

    /**
     * Aggiorna tutti i parametri della UI secondo
     * il nuovo rapporto.
     *
     * @param ratio nuovo scale ratio della finestra di gioco
     */
    updateScaleRatio(ratio) {
        this.fontSize = (GameUi.getDefaultFontSize() * ratio).toFixed(2);
        this.lifeHeight = (GameUi.getDefaultLifeHeight() * ratio).toFixed(2);
        this.lifeWidth = (GameUi.getDefaultLifeWidth() * ratio).toFixed(2);
        this.lifePercentage = ((this.lifeWidth / (Bubble.getMaxRadius() - Bubble.getMinRadius()))).toFixed(2);
        this.ctx.font = this.fontSize + 'px Courier New';
        this.userLifeX = (window.innerWidth - this.lifeWidth) / 2;
        this.userLifeY = window.innerHeight - Math.round(this.lifeHeight * 1.5);
        this.killCounterTextMaxWidth = this.ctx.measureText(Game.getMaxEnemyBubble().toString()).width;
        this.enemyCounterTextMaxWidth = this.ctx.measureText(this.enemyCounterText +
            Game.getMaxEnemyBubble()).width;
        this.halfWindowWidth = window.innerWidth / 2;
        this.rankMaxWidth = this.ctx.measureText(
            Game.getMaxEnemyBubble() + '. ' + Game.getMaxEnemyBubble() + " - " + Bubble.getMaxRadius()).width;
        this.rankX = window.innerWidth - this.rankMaxWidth;
    }


}