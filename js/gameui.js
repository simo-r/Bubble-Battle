class GameUi {
    constructor() {
        this.canvas = document.getElementById("uiCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.shadowBlur = 0;
        this.fontSize = GameUi.getDefaultFontSize();
        this.lifeHeight = GameUi.getDefaultLifeHeight();
        this.lifeWidth = GameUi.getDefaultLifeWidth();
        this.lifePercentage = 0;
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
    
    clearAll() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawPlayerCounter(counter, killedPlayers) {
        const txt = " ENEMY COUNTER ";
        this.ctx.textBaseline = 'top';
        this.ctx.clearRect(0, 0, this.ctx.measureText(txt + "100").width, this.fontSize);
        this.ctx.clearRect(window.innerWidth/2, 0, this.ctx.measureText(counter + killedPlayers + '').width, this.fontSize);
        this.ctx.fillText(txt + counter, 0, 0);
        this.ctx.fillText(killedPlayers, window.innerWidth / 2, 0);
    }

    drawUserLife(life) {
        let tot = Math.round(life * this.lifePercentage);
        const x = (window.innerWidth - this.lifeWidth) / 2;
        const y = window.innerHeight - Math.round(this.lifeHeight * 1.5);
        this.ctx.clearRect(x, y, this.lifeWidth, this.lifeHeight);
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(x, y, tot, this.lifeHeight);
        this.ctx.strokeStyle = 'blue';
        this.ctx.strokeRect(x, y, this.lifeWidth, this.lifeHeight);
    }

    //TODO REFACTOR THIS CODE
    drawRanking(players, userBubble) {
        this.ctx.textBaseline = 'top';
        //this.ctx.fontSize = 45+'px';
        const measure = this.ctx.measureText("10. 100").width;
        this.ctx.clearRect(window.innerWidth - measure, 0, measure, this.fontSize * 11);
        if (players.length === 0) {
            this.ctx.fillText("1. " + (userBubble.getName), window.innerWidth - measure, 0);
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
                this.ctx.fillText(j + ". " + (userBubble.getName), window.innerWidth - measure, this.fontSize * (j - 1));
            } else {
                this.ctx.fillText(j + ". " + (currBubble.getName), window.innerWidth - measure, this.fontSize * (j - 1));
                --i;
            }
            ++j;
        }
        if (!find) {
            // Se non sono in top 10, ricerco la mia vera posizione
            console.log("NOT FIND ");
            console.log(" I DOPO " + i);
            for (let h = i; h >= 0; h--) {
                if (userBubble.getRadius >= players[h].getRadius) {
                    this.ctx.fillText((h + 1) + ". " + (userBubble.getName), window.innerWidth - measure, this.fontSize * (j - 1));
                    return;
                }
            }
            // Se sono la bubble più piccola allora sono all'ultima posizione
            this.ctx.fillText((players.length + 1) + ". " + (userBubble.getName), window.innerWidth - measure, this.fontSize * (j - 1));
        }
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
    }
}