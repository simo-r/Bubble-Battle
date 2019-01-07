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

    drawPlayerCounter(counter) {
        const txt = " PLAYER COUNTER ";
        this.ctx.textBaseline = 'top';
        this.ctx.clearRect(0, 0, this.ctx.measureText(txt + "100").width, this.fontSize);
        this.ctx.fillText(txt + counter, 0, 0);
    }

    drawUserLife(life) {
        let tot = Math.round(life * this.lifePercentage);
        //console.log("TOT " + tot + " LIFE " + life + " PERCENTAGE " + this.lifePercentage);
        const x = (window.innerWidth - this.lifeWidth) / 2;
        const y = window.innerHeight - Math.round(this.lifeHeight * 1.5);
        this.ctx.clearRect(x, y, this.lifeWidth, this.lifeHeight);
        console.log("TOT " + tot + " LIFE WIDTH " + this.lifeWidth + " LIFE HEIGHT " + this.lifeHeight);
        /*let gradient = this.ctx.createLinearGradient(x, 0, x+tot+5, 0);
        gradient.addColorStop(0, 'red');
        gradient.addColorStop(1, 'white');*/
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(x, y, tot, this.lifeHeight);
        this.ctx.strokeStyle = 'blue';
        this.ctx.strokeRect(x, y, this.lifeWidth, this.lifeHeight);
    }

    drawRanking(players, userBubble) {
        this.ctx.textBaseline = 'top';
        //this.ctx.fontSize = 45+'px';
        const measure = this.ctx.measureText("10. 100").width;
        this.ctx.clearRect(window.innerWidth - measure, 0, measure, this.fontSize * 11);
        if (players.length === 0) {
            this.ctx.fillText("1. " + (userBubble.name), window.innerWidth - measure, 0);
            return;
        }
        let currBubble;
        let i = players.length-1;
        let j = 1;
        let find = false;
        while (i >= 0 && j <= 10) {
            console.log(" I " + i);
            currBubble = players[i];
            if (!find && userBubble.getRadius >= currBubble.getRadius) {
                find = true;
                //currBubble = userBubble;
                //this.ctx.fillText(j + ". " + (currBubble.name), window.innerWidth - measure, this.fontSize * (i - 1));
                this.ctx.fillText(j + ". " + (userBubble.name), window.innerWidth - measure, this.fontSize * (j - 1));
                /*i+=2;*/
            }else{
                this.ctx.fillText(j + ". " + (currBubble.name), window.innerWidth - measure, this.fontSize * (j - 1));
                --i;
            }
            ++j;
        }
        if(!find){
            console.log("NOT FIND " );
            for(let i = players.length-1; i >=0; i--){
                if(userBubble.getRadius >= players[i].getRadius){
                    this.ctx.fillText((i+1) + ". " + (userBubble.name), window.innerWidth - measure, this.fontSize * (j - 1));
                    return;
                }
            }
            // Se arrivo qui vuol dire che sono la bubble più piccola
            this.ctx.fillText((players.length+1) + ". " + (userBubble.name), window.innerWidth - measure, this.fontSize * (j - 1));
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
        this.lifeHeight = (GameUi.getDefaultLifeHeight() * ratio).toFixed(2);
        this.lifeWidth = (GameUi.getDefaultLifeWidth() * ratio).toFixed(2);
        this.lifePercentage = ((this.lifeWidth / (Bubble.getMaxRadius() - Bubble.getMinRadius()))).toFixed(2);
        this.ctx.font = this.fontSize + 'px Courier New';
        console.log(" FONT SIZE " + this.fontSize);
    }
}