class Shield{
    constructor(){
        // Gli elementi sono di tipo ShieldPoint
        this.shieldPoints = [];
        this.paint = false;
        this.isShieldOn = false;
        this.shieldLength = 0;
        this.maxShieldLength = 600;
        this.shieldTimer = null;
        this.shieldDuration = 3000; //milli-seconds
    }
    
    static createShield(canvas,background){
        let tmpShield = new Shield();
        this.addMouseListeners(tmpShield,canvas,background);
        return tmpShield;
    }
    
    static addMouseListeners(shield,canvas,background){
        let mouseDownFun = function (e){
            if(shield.isShieldOn) return;
            //shield.clearOldShield();
            //Scala i punti rispetto al canvas NON SCALATO
            let scaleX = window.innerWidth / canvas.width;
            let scaleY = window.innerHeight / canvas.height;
            let scaleToCover = Math.max(scaleX, scaleY);
            let topBottomMargin = ((window.innerHeight - (canvas.height * scaleToCover)) / 2);
            let leftRightMargin = ((window.innerWidth - (canvas.width * scaleToCover)) / 2);

            const mouseX = (e.clientX - leftRightMargin) / scaleToCover;
            const mouseY = (e.clientY - topBottomMargin) / scaleToCover;
            shield.paint = true;
            let shieldPoint = new ShieldPoint(mouseX,mouseY,background.x,background.y,false);
            shield.shieldPoints.push(shieldPoint);
        };
        
        let mouseMoveFun = function (e) {
            if (!shield.paint || shield.isShieldOn) return;
            let scaleX = window.innerWidth / canvas.width;
            let scaleY = window.innerHeight / canvas.height;
            //let scaleToFit = Math.min(scaleX, scaleY);
            let scaleToCover = Math.max(scaleX, scaleY);
            let topBottomMargin = ((window.innerHeight - (canvas.height * scaleToCover)) / 2);
            let leftRightMargin = ((window.innerWidth - (canvas.width * scaleToCover)) / 2);
            const mouseX = (e.clientX - leftRightMargin) / scaleToCover;
            const mouseY = (e.clientY - topBottomMargin) / scaleToCover;
            let shieldPoint = new ShieldPoint(mouseX,mouseY,background.x,background.y,true);
            shield.increaseShieldLength(shieldPoint);
            //CHECK COLLISION WHILE DRAWING
            if(shield.shieldLength < shield.maxShieldLength){
                shield.shieldPoints.push(shieldPoint);
            }
        };
        
        let mouseUpFun = function (e){
            if(shield.isShieldOn || (!shield.paint)) return;
            shield.paint = false;
            if(shield.shieldPoints.length <= 1 /* || CHECK COLLISION */){
                shield.clearOldShield();
            }else{
                shield.isShieldOn = true;
                shield.shieldTimer = window.setInterval(function () {
                    shield.clearOldShield();
                    shield.isShieldOn = false;
                    window.clearTimeout(shield.shieldTimer);
                },shield.shieldDuration);
            }
        };
        canvas.onmousedown = mouseDownFun;
        canvas.onmousemove = mouseMoveFun;
        canvas.onmouseup = mouseUpFun;
        canvas.onmouseleave = mouseUpFun;
    }

    increaseShieldLength(newPoint) {
        let previousPoint = this.shieldPoints[this.shieldPoints.length -1];
        this.shieldLength += previousPoint.distanceTo(newPoint);
        console.log("SHIELD LENGTH " + this.shieldLength);
    }

    draw(ctx) {
        if (this.shieldPoints.length <= 1){
            console.log("NO POINT");
            return;  
        } 
        // Posso usare una canonincal spline per disegnare 
        ctx.strokeStyle = '#df4b26';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 5;
        let xPos;
        let yPos;
        for (let i = 0; i < this.shieldPoints.length; i++) {
            ctx.beginPath();
            let currPoint = this.shieldPoints[i];
            if (this.shieldPoints[i].isDrag && i) {
                let prevPoint = this.shieldPoints[i-1];
                xPos = prevPoint.getX + (- prevPoint.getBackgroundX );
                yPos = prevPoint.getY + (-prevPoint.getBackgroundY);
                ctx.moveTo(xPos, yPos);
            } else {
                xPos = (currPoint.getX - 1) + (-currPoint.getBackgroundX);
                yPos = currPoint.getY + (-currPoint.getBackgroundY );
                ctx.moveTo(xPos, yPos);
            }
            xPos = currPoint.getX + (-currPoint.getBackgroundX );
            yPos = currPoint.getY + (-currPoint.getBackgroundY );
            ctx.lineTo(xPos, yPos);
            ctx.closePath();
            ctx.stroke();
        }
    }
    
    clearOldShield(){
        this.shieldPoints.length = 0;
        this.paint = false;
        this.shieldLength = 0;
    }
    
}