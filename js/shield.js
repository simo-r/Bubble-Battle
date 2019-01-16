class Shield {
    constructor() {
        this.shieldPoints = [];
        this.paint = false;
        this.isShieldOn = false;
        this.shieldLength = 0;
        //this.maxShieldLength = 600;
        this.shieldTimer = null;
        //shieldDuration = 10000; //milli-seconds
    }

    static get getMaxShieldLength() {
        return 600;
    }

    static get getShieldDuration() {
        return 10000;//milli-seconds
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
                (shield.shieldLength >= Shield.getMaxShieldLength)) return;
            let shieldPoint = ShieldPoint.newPoint(e, canvas, background);
            shield.increaseShieldLength(shieldPoint);
            if (shield.shieldLength < Shield.getMaxShieldLength) {
                shield.shieldPoints.push(shieldPoint);
            }
        };

        let mouseUpFun = function (e) {
            if (shield.isShieldOn || (!shield.paint)) return;
            shield.paint = false;
            if (shield.shieldPoints.length <= 1) {
                shield.clearOldShield();
            } else {
                shield.isShieldOn = true;
                shield.shieldTimer = window.setInterval(function () {
                    shield.clearOldShield();
                    shield.isShieldOn = false;
                    window.clearTimeout(shield.shieldTimer);
                }, Shield.getShieldDuration);
            }
        };
        window.onmousedown = mouseDownFun;
        window.onmousemove = mouseMoveFun;
        window.onmouseup = mouseUpFun;
        window.onmouseleave = mouseUpFun;
    }
    
    static pointBubbleDistance(px, py, cx, cy, r) {
        //Distanza punto - centro bubble
        let distance = ShieldPoint.dist(px, py, cx, cy);
        //Se la distanza è <= del raggio allora è dentro
        if (distance <= r) {
            return distance - r;
        }
        return false;
    }

    static linePoint(x1, y1, x2, y2, px, py) {
        // distanza centro - estremi del segmento
        let d1 = ShieldPoint.dist(px, py, x1, y1);
        let d2 = ShieldPoint.dist(px, py, x2, y2);
        // lunghezza del segmento
        let lineLen = ShieldPoint.dist(x1, y1, x2, y2);
        // Errore per simulare un minimo di spessore della linea
        let buffer = 0.1;
        // Se le due distanze sono uguali alla lunghezza
        // del segmento allora il punto è sulla linea
        return d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer;

    }

    increaseShieldLength(newPoint) {
        let previousPoint = this.shieldPoints[this.shieldPoints.length - 1];
        this.shieldLength += ShieldPoint.distanceTo(previousPoint,newPoint);
    }

    draw(ctx) {
        if (this.shieldPoints.length <= 1) return;
        ctx.strokeStyle = '#df4b26';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 5;
        let xPos;
        let yPos;
        let currPoint;
        ctx.beginPath();
        ctx.moveTo(this.shieldPoints[0].getX - this.shieldPoints[0].getBackgroundX,
            this.shieldPoints[0].getY - this.shieldPoints[0].getBackgroundY);
        for (let i = 1; i < this.shieldPoints.length; i++) {
            currPoint = this.shieldPoints[i];
            xPos = currPoint.getX - currPoint.getBackgroundX;
            yPos = currPoint.getY - currPoint.getBackgroundY;
            ctx.lineTo(xPos, yPos);
            ctx.moveTo(xPos, yPos);
        }
        ctx.closePath();
        ctx.stroke();
    }

    clearOldShield() {
        this.shieldPoints.length = 0;
        this.paint = false;
        this.shieldLength = 0;
    }
    
    checkCollision(bubble) {
        let pointOld;
        let pointNew;
        let found = false;
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
        let segmLength;
        let cosAngle;
        let closestX;
        let closestY;
        let distance;
        while (!found && i < (this.shieldPoints.length - 1)) {
            pointOld = this.shieldPoints[i];
            pointNew = this.shieldPoints[i + 1];
            x1 = pointOld.x - pointOld.backgroundX;
            y1 = pointOld.y - pointOld.backgroundY;
            x2 = pointNew.x - pointNew.backgroundX;
            y2 = pointNew.y - pointNew.backgroundY;
            // Controllo se uno dei due estremi del segmento è all'interno della circonferenza
            inside1 = Shield.pointBubbleDistance(x1, y1, cx, cy, bubble.radius);
            inside2 = Shield.pointBubbleDistance(x2, y2, cx, cy, bubble.radius);
            if (inside1 !== false) {
                collisionDetected = this.collisionDetected(bubble, x1 + bubble.gameArea.getX, y1 + bubble.gameArea.getY);
                found = true;
            } else if (inside2 !== false) {
                collisionDetected = this.collisionDetected(bubble, x2 + bubble.gameArea.getX, y2 + bubble.gameArea.getY);
                found = true;
            } else {
                // Cerchiamo il punto sul segmento (x1,y1) - (x2,y2) più vicino alla circonferenza
                segmLength = ShieldPoint.dist(x1, y1, x2, y2);
                // Coseno dell'angolo tra il centro della circonferenza e il segmento in considerazione
                cosAngle = (((cx - x1) * (x2 - x1)) + ((cy - y1) * (y2 - y1))) / Math.pow(segmLength, 2);
                closestX = x1 + (cosAngle * (x2 - x1));
                closestY = y1 + (cosAngle * (y2 - y1));
                // Se il punto sta sul segmento
                if (Shield.linePoint(x1, y1, x2, y2, closestX, closestY)) {
                    distance = ShieldPoint.dist(closestX, closestY, cx, cy)/*Math.sqrt(distX * distX + distY * distY)*/;
                    if (distance <= bubble.radius) {
                        collisionDetected = this.collisionDetected(bubble,
                            (closestX + bubble.gameArea.getX),
                            closestY + bubble.gameArea.getY);
                        found = true;
                    }
                }
            }
            i++;
        }
        return collisionDetected;
    }
    
    /**
     * 
     * @param bubble bubble che collide
     * @param x1 ascissa del punto di collisione
     * @param y1 ordinata del punto di collisione
     * @returns {boolean} true se lo shield è on e collide, false se collide e lo shield è off
     */
    collisionDetected(bubble, x1, y1) {
        if (this.isShieldOn) {
            bubble.collideOnShield(x1, y1);
            return true;
        } else {
            this.clearOldShield();
            return false;
        }
    }

    /**
     * Controlla che lo shield sia contenuto 
     * nella game-area. Se non lo è lo cancella.
     * 
     * @param gameWidth larghezza della game-area
     * @param gameHeight altezza della game-area
     */
    checkGameArea(gameWidth, gameHeight) {
        this.shieldPoints.forEach(v => {
            if (v.getGameX <= 0 || v.getGameX >= gameWidth || v.getGameY <= 0 || v.getGameY >= gameHeight) {
                this.clearOldShield();
            }
        });
    }

}
