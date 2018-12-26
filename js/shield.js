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
        let collisionDetected = false;
        let i = 0;
        let x1;
        let y1;
        let x2;
        let y2;
        const cx = Math.abs(bubble.gameArea.x - bubble.x);
        const cy = Math.abs(bubble.gameArea.y - bubble.y);
        let inside1;
        let inside2;
        let distX;
        let distY;
        let segmLength;
        let dot;
        let closestX;
        let closestY;
        let distance;
        while (!find && i < (this.shieldPoints.length - 1)) {
            pointOld = this.shieldPoints[i];
            pointNew = this.shieldPoints[i + 1];
            x1 = pointOld.x - pointOld.backgroundX;
            y1 = pointOld.y - pointOld.backgroundY;
            x2 = pointNew.x - pointNew.backgroundX;
            y2 = pointNew.y - pointNew.backgroundY;
            //console.log("X1 "+ x1 + " X2 " + x2 + " Y1" + y1 + " Y2 " + y2 + " CX " + cx + " CY " + cy);
            // Controllo se uno dei due estremi del segmento è all'interno della circonf
            inside1 = this.pointCircle(x1, y1, cx, cy, bubble.radius);
            inside2 = this.pointCircle(x2, y2, cx, cy, bubble.radius);
            if (inside1 !== false) {
                collisionDetected = this.collisionDetected(bubble, x1 + bubble.gameArea.getX, y1 + bubble.gameArea.getY);
                find = true;
            } else if (inside2 !== false) {
                collisionDetected = this.collisionDetected(bubble, x2 + bubble.gameArea.getX, y2 + bubble.gameArea.getY);
                find = true;
            } else {
                // Cerchiamo il punto sul segmento (x1,y1) - (x2,y2) più vicino alla circonferenza
                distX = x1 - x2;
                distY = y1 - y2;
                segmLength = Math.sqrt(distX * distX + distY * distY);
                dot = (((cx - x1) * (x2 - x1)) + ((cy - y1) * (y2 - y1))) / Math.pow(segmLength, 2);
                closestX = x1 + (dot * (x2 - x1));
                closestY = y1 + (dot * (y2 - y1));
                // Se il punto sta sul segmento
                if (this.linePoint(x1, y1, x2, y2, closestX, closestY)) {
                    distX = closestX - cx;
                    distY = closestY - cy;
                    distance = Math.sqrt(distX * distX + distY * distY);
                    if (distance <= bubble.radius) {
                        collisionDetected = this.collisionDetected(bubble,
                            (closestX + bubble.gameArea.getX),
                            closestY + bubble.gameArea.getY);
                        //if(!find) i =0;
                        find = true;
                    }
                }
            }
            i++;
        }
        return collisionDetected;
    }

    // True se lo shield è on e collide, false se collide e lo shield è off
    collisionDetected(bubble, x1, y1) {
        // Se lo shield è attivo la bubble collide altrimenti lo shield si cancella
        if (this.isShieldOn) {
            //console.log("DISTANCE " + distance + " OFFSET " + (distance - bubble.radius) + " CLOS X " + (closestX + bubble.gameArea.getX) + " CLOS Y " + (closestY + bubble.gameArea.getY));
            bubble.collideOnShield(x1, y1);
            return true;
        } else {
            this.clearOldShield();
            return false;
        }

    }

    pointCircle(px, py, cx, cy, r) {
        //Distanza punto - centro bubble
        let distX = px - cx;
        let distY = py - cy;
        let distance = Math.sqrt((distX * distX) + (distY * distY));

        //Se la distanza è minore del raggio allora è dentro
        if (distance <= r) {
            return distance - r;
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

    checkGameArea(gameWidth,gameHeight) {
        this.shieldPoints.forEach(v => {
            //console.log(v.toString());
            if(v.getGameX <= 0 || v.getGameX >= gameWidth || v.getGameY <= 0 || v.getGameY >= gameHeight) {
                this.clearOldShield();
                return;
            }
        });
    }

}