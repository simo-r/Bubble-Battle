class GameUi {
    constructor() {
        this.canvas = document.getElementById("uiCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.shadowBlur = 0;
        this.fontSize = GameUi.getDefaultFontSize();
        this.lifeHeigth = GameUi.getDefaultLifeHeight();
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

    drawPlayerCounter(counter) {
        const txt = " PLAYER COUNTER ";
        this.ctx.textBaseline = 'top';
        this.ctx.clearRect(0, 0, this.ctx.measureText(txt + "100").width, this.fontSize);
        this.ctx.fillText(txt + counter, 0, 0);
    }

    drawUserLife(life) {
        let tot = Math.round(life * this.lifePercentage);
        //console.log("TOT " + tot + " LIFE " + life + " PERCENTAGE " + this.lifePercentage);
        const x = (window.innerWidth  - this.lifeWidth) /2;
        const y = window.innerHeight - Math.round(this.lifeHeigth*1.5);
        this.ctx.clearRect(x, y, this.lifeWidth, this.lifeHeigth);
        console.log("TOT " + tot + " LIFE WIDTH " + this.lifeWidth + " LIFE HEIGHT " + this.lifeHeigth);
        this.ctx.beginPath();
        this.ctx.fillStyle = 'red';
        this.ctx.rect(x, y, tot, this.lifeHeigth);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'blue';
        this.ctx.rect(x, y, this.lifeWidth, this.lifeHeigth);
        this.ctx.stroke();
    }

    drawRanking(players) {
        this.ctx.textBaseline = 'top';
        
        //this.ctx.fontSize = 45+'px';
        const measure = this.ctx.measureText("10. 100").width;
        this.ctx.clearRect(window.innerWidth - measure, 0, measure, this.fontSize * 10);
        let currBubble;
        for (let i = 1; i < 11; i++) {
            currBubble = players[players.length - i];
            this.ctx.fillText(i + ". " + (players.length - i), window.innerWidth - measure, this.fontSize * (i - 1));
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
    
    updateScaleRatio(ratio) {
        this.fontSize = (GameUi.getDefaultFontSize() * ratio).toFixed(2);
        this.lifeHeigth = (GameUi.getDefaultLifeHeight() * ratio).toFixed(2);
        this.lifeWidth = (GameUi.getDefaultLifeWidth() * ratio).toFixed(2);
        this.lifePercentage = ((this.lifeWidth/(Bubble.getMaxRadius()-Bubble.getMinRadius()))).toFixed(2);
        this.ctx.font = this.fontSize+'px Courier New';
        console.log(" FONT SIZE " + this.fontSize);
    }
}