class Shield {
    constructor() {
        // Gli elementi sono di tipo ShieldPoint
        this.shieldPoints = [];
        this.paint = false;
        this.isShieldOn = false;
        this.shieldLength = 0;
        this.maxShieldLength = 600;
        this.shieldTimer = null;
        this.shieldDuration = 15000; //milli-seconds
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
        let pointOld;
        let pointNew;
        let find = false;
        let i = 0;
        let x1;
        let y1;
        let x2;
        let y2;
        let cx = Math.abs(bubble.gameArea.x - 640);
        let cy = Math.abs(bubble.gameArea.y - 360);
        //console.log(" CX " + cx + " CY " + cy + " BUBBLE X " + bubble.x + " BUBBLE Y " + bubble.y);
        while (!find && i < (this.shieldPoints.length - 1)) {
            pointOld = this.shieldPoints[i];
            pointNew = this.shieldPoints[i + 1];
            //console.log("COLLIDING");
            x1 = pointOld.x /*+ bubble.gameArea.getX*/ - pointOld.backgroundX;
            y1 = pointOld.y /*+ bubble.gameArea.getY */ - pointOld.backgroundY;
            x2 = pointNew.x /*+ bubble.gameArea.getX*/ - pointNew.backgroundX;
            y2 = pointNew.y /*+ bubble.gameArea.getY*/ - pointNew.backgroundY;
            //console.log("X1 "+ x1 + " X2 " + x2 + " Y1" + y1 + " Y2 " + y2 + " CX " + cx + " CY " + cy);
            let inside1 = this.pointCircle(x1, y1, cx, cy, bubble.radius);
            let inside2 = this.pointCircle(x2, y2, cx, cy, bubble.radius);
            if (inside1 || inside2) {
                if (this.isShieldOn) {
                    console.log("INSIDE");
                    bubble.collideOnShield();
                } else {
                    this.clearOldShield();
                    find = true;
                }
            } else {
                let distX = x1 - x2;
                let distY = y1 - y2;
                let segmLength = Math.sqrt(distX * distX + distY * distY);
                let dot = (((cx - x1) * (x2 - x1)) + ((cy - y1) * (y2 - y1))) / Math.pow(segmLength, 2);
                let closestX = x1 + (dot * (x2 - x1));
                let closestY = y1 + (dot * (y2 - y1));
                if (this.linePoint(x1, y1, x2, y2, closestX, closestY)) {
                    distX = closestX - cx;
                    distY = closestY - cy;
                    let distance = Math.sqrt(distX * distX + distY * distY);
                    if (inside1 || inside2 || distance <= bubble.radius) {
                        if (this.isShieldOn) {
                            console.log("DISTANCE " + distance + " OFFSET " + (distance - bubble.radius) + " CLOS X " + (closestX + bubble.gameArea.getX) + " CLOS Y " + (closestY + bubble.gameArea.getY));
                            bubble.collideOnShield((closestX + bubble.gameArea.getX), closestY + bubble.gameArea.getY, distance - bubble.radius);
                        } else {
                            this.clearOldShield();
                            find = true;
                        }
                    }
                }
            }
            i++;
        }
    }

    pointCircle(px, py, cx, cy, r) {

        // get distance between the point and circle's center
        // using the Pythagorean Theorem
        let distX = px - cx;
        let distY = py - cy;
        let distance = Math.sqrt((distX * distX) + (distY * distY));

        // if the distance is less than the circle's
        // radius the point is inside!
        if (distance <= r) {
            return true;
        }
        return false;
    }

    dist(x1, y1, x2, y2) {
        let x = x1 - x2;
        let y = y1 - y2;
        return Math.sqrt(x * x + y * y);
    }

    linePoint(x1, y1, x2, y2, px, py) {

        // get distance from the point to the two ends of the line
        let d1 = this.dist(px, py, x1, y1);
        let d2 = this.dist(px, py, x2, y2);

        // get the length of the line
        let lineLen = this.dist(x1, y1, x2, y2);

        // since floats are so minutely accurate, add
        // a little buffer zone that will give collision
        let buffer = 0.1;    // higher # = less accurate

        // if the two distances are equal to the line's
        // length, the point is on the line!
        // note we use the buffer here to give a range,
        // rather than one #
        return d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer;

    }

}