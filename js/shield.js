class Shield {
    constructor() {
        // Gli elementi sono di tipo ShieldPoint
        this.shieldPoints = [];
        this.paint = false;
        this.isShieldOn = false;
        this.shieldLength = 0;
        this.maxShieldLength = 600;
        this.shieldTimer = null;
        this.shieldDuration = 3000; //milli-seconds
    }

    static createShield(canvas, background) {
        let tmpShield = new Shield();
        this.addMouseListeners(tmpShield, canvas, background);
        return tmpShield;
    }

    static addMouseListeners(shield, canvas, background) {
        let mouseDownFun = function (e) {
            console.log("THIS " + this + ' ' + typeof this);
            if (shield.isShieldOn) return;
            let shieldPoint = ShieldPoint.newPoint(e, canvas, background);
            shield.paint = true;
            shield.shieldPoints.push(shieldPoint);
        };

        let mouseMoveFun = function (e) {
            if (!shield.paint ||
                shield.isShieldOn ||
                (shield.shieldLength >= shield.maxShieldLength)) return;
            let shieldPoint = ShieldPoint.newPoint(e, canvas, background);
            shieldPoint.setDrag = true;
            shield.increaseShieldLength(shieldPoint);
            //CHECK COLLISION WHILE DRAWING
            if (shield.shieldLength < shield.maxShieldLength) {
                shield.shieldPoints.push(shieldPoint);
            }
        };

        let mouseUpFun = function (e) {
            if (shield.isShieldOn || (!shield.paint)) return;
            shield.paint = false;
            if (shield.shieldPoints.length <= 1 /* || CHECK COLLISION */) {
                shield.clearOldShield();
            } else {
                shield.isShieldOn = true;
                shield.shieldTimer = window.setInterval(function () {
                    shield.clearOldShield();
                    shield.isShieldOn = false;
                    window.clearTimeout(shield.shieldTimer);
                }, shield.shieldDuration);
            }
        };
        canvas.onmousedown = mouseDownFun;
        canvas.onmousemove = mouseMoveFun;
        canvas.onmouseup = mouseUpFun;
        canvas.onmouseleave = mouseUpFun;
    }

    increaseShieldLength(newPoint) {
        let previousPoint = this.shieldPoints[this.shieldPoints.length - 1];
        this.shieldLength += previousPoint.distanceTo(newPoint);
        console.log("SHIELD LENGTH " + this.shieldLength);
    }

    draw(ctx) {
        if (this.shieldPoints.length <= 1) return;
        // Posso usare una canonincal spline per disegnare 
        ctx.strokeStyle = '#df4b26';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 5;
        let xPos;
        let yPos;
        let currPoint;
        let prevPoint;
        for (let i = 0; i < this.shieldPoints.length; i++) {
            ctx.beginPath();
            currPoint = this.shieldPoints[i];
            if (this.shieldPoints[i].isDrag && i) {
                prevPoint = this.shieldPoints[i - 1];
                xPos = prevPoint.getX - prevPoint.getBackgroundX;
                yPos = prevPoint.getY - prevPoint.getBackgroundY;
                ctx.moveTo(xPos, yPos);
            } else {
                xPos = (currPoint.getX - 1) - currPoint.getBackgroundX;
                yPos = currPoint.getY - currPoint.getBackgroundY;
                ctx.moveTo(xPos, yPos);
            }
            xPos = currPoint.getX - currPoint.getBackgroundX;
            yPos = currPoint.getY - currPoint.getBackgroundY;
            ctx.lineTo(xPos, yPos);
            ctx.closePath();
            ctx.stroke();
        }
    }

    clearOldShield() {
        this.shieldPoints.length = 0;
        this.paint = false;
        this.shieldLength = 0;
    }

    checkCollision(bubble) {
        // LAZY HIT DETECTION FOR PERFORMANCE IMPROVING
        let point;
        let find = false;
        let i = 0;
        //SHIELD POINT
        let pointX;
        let pointY;
        //RECTANGLE
        let topLeftX = bubble.x - bubble.radius;
        let topLeftY = bubble.y - bubble.radius;
        let width = bubble.radius * 2;
        let height = bubble.radius * 2;
        while (!find && i < this.shieldPoints.length) {
            point = this.shieldPoints[i];
            //console.log("COLLIDING");
            pointX = point.x + bubble.gameArea.getX - point.backgroundX;
            pointY = point.y + bubble.gameArea.getY - point.backgroundY;
            let leftOffset = topLeftX - pointX;
            let rightOffset = pointX - topLeftX - width;
            let topOffset = topLeftY - pointY;
            let downOffset = pointY - topLeftY - height;
            
            if ((leftOffset <= 0) &&
                (rightOffset <= 0) &&
                (topOffset<= 0) &&
                (downOffset <= 0)) {
                if (this.isShieldOn) {
                    //console.log("COLLIDING ON");
                    bubble.collideOnShield(leftOffset,rightOffset,topOffset,downOffset);
                    console.log("LEFT " + leftOffset + " RIGHT " + rightOffset +
                        " TOP " + topOffset + " DOWN " + downOffset);
                } else {
                    console.log("COLLIDING OFF");
                    this.clearOldShield();
                    find = true;
                }
            }
            i++;
        }
    }

}