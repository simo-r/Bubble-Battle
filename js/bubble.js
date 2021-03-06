class Bubble {
    constructor(x, y, radius, speedX, speedY, color, gameArea, name) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.gameArea = gameArea;
        this.maxSpeed = Bubble.getCurrentMaxSpeed(this.radius);
        this.acceleration = 0.3;
        this.speedX = speedX;
        this.speedY = speedY;
        this.keys = {};
        this.bumping = false;
        this.name = name;
    }

    static get getMinRadius() {
        return 20;
    }

    static get getMaxRadius() {
        return 300;
    }

    static getCurrentMaxSpeed(radius) {
        return Math.ceil(100 / radius);
    }

    get getRadius() {
        return this.radius;
    }

    get getName() {
        return this.name;
    }


    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();

    }

    checkGameAreaCollision() {
        this.checkXBoundaries();
        this.checkYBoundaries();
    }

    /**
     * Aggiorna la velocità sull'asse delle ascisse e delle ordinate
     * Se la bubble si è scontrata sullo shield resetto le velocità.
     */
    updateSpeed() {
        if (this.bumping) {
            this.speedX = 0;
            this.speedY = 0;
            this.bumping = false;
        } else {
            this.updateSpeedX();
            this.updateSpeedY();
        }
    }

    /**
     * Aggiorna la velocità sull'asse delle ascisse a seconda
     * della combinazione di tasti premuta.
     */
    updateSpeedX() {
        if ((this.keys[keyD] && this.keys[keyA]) ||
            (this.speedX !== 0 && !(this.keys[keyD] || this.keys[keyA]))) {
            this.slowDownX();
        } else if (this.keys[keyA]) {
            this.moveLeft();
        } else if (this.keys[keyD]) {
            this.moveRight();

        }
    }

    /**
     * Aggiorna la velocità sull'asse delle ordinate a seconda
     * della combinazione di tasti premuta.
     */
    updateSpeedY() {
        if ((this.keys[keyS] && this.keys[keyW]) ||
            (this.speedY !== 0 && !(this.keys[keyS] || this.keys[keyW]))) {
            this.slowDownY();
        } else if (this.keys[keyW]) {
            this.moveUp();
        } else if (this.keys[keyS]) {
            this.moveDown();
        }
    }


    /**
     * Controlla i bound sull'asse delle ascisse con la game area.
     * Modifica la velocità ed i tasti premuti nel caso sia stato
     * riscontrato uno scontro e riposiziona la bolla al limite 
     * della game area.
     */
    checkXBoundaries() {
        let isOutOfXBounds = this.gameArea.isOutOfXBounds(this.x, this.radius);
        if (isOutOfXBounds) {
            this.speedX = 0;
            this.keys = getRandomWASD();
            if (isOutOfXBounds === -1) {
                this.x = this.gameArea.x + this.radius;
                this.keys[keyA] = false;
                this.keys[keyD] = true;
            } else if (isOutOfXBounds === 1) {
                this.x = this.gameArea.x + this.gameArea.gameWidth - this.radius;
                this.keys[keyA] = true;
                this.keys[keyD] = false;
            }
        }
    }

    /**
     *  Controlla i bound sull'asse delle ordinate con la game area
     *  Modifica la velocità ed i tasti premuti nel caso sia stato
     *  riscontrato uno scontro e riposiziona la bolla al limite
     * della game area.
     */
    checkYBoundaries() {
        let isOutOfYBounds = this.gameArea.isOutOfYBounds(this.y, this.radius);
        if (isOutOfYBounds) {
            this.speedY = 0;
            this.keys = getRandomWASD();
            if (isOutOfYBounds === -1) {
                this.y = this.gameArea.y + this.radius;
                this.keys[keyS] = true;
                this.keys[keyW] = false;
            } else if (isOutOfYBounds === 1) {
                this.y = this.gameArea.y + this.gameArea.gameHeight - this.radius;
                this.keys[keyS] = false;
                this.keys[keyW] = true;
            }
        }
    }

    /**
     * Decrementa la velocità sull'asse delle ascisse di un fattore
     * uguale all'accelerazione per l'attrito tra le due bolle che collidono
     * finché non raggiunge la velocità minima
     *
     * @param coeff coefficiente di attrito tra due bubble che collidono,
     *        coeff = 1 nel caso in cui non ci sia alcuna collisione
     *        
     * @param lowerBound velocità minima
     */
    slowDownX(coeff = 1, lowerBound = 0) {
        if (this.speedX === 0) return;
        if (this.speedX > lowerBound) {
            if ((this.speedX -= this.acceleration * coeff) < lowerBound) {
                this.speedX = lowerBound;
            }
        } else if (this.speedX < -lowerBound) {
            if ((this.speedX += this.acceleration * coeff) > -lowerBound) {
                this.speedX = -lowerBound;
            }
        }
    }

    /**
     * Decrementa la velocità sull'asse delle ordinate di un fattore
     * uguale all'accelerazione per l'attrito tra le due bolle che collidono
     * finché non raggiunge la velocità minima
     *
     * @param coeff coefficiente di attrito tra due bubble che collidono,
     *        coeff = 1 nel caso in cui non ci sia alcuna collisione
     *
     * @param lowerBound velocità minima
     */
    slowDownY(coeff = 1, lowerBound = 0) {
        if (this.speedY === 0) return;
        if (this.speedY > lowerBound) {
            if ((this.speedY -= this.acceleration * coeff) < lowerBound) {
                this.speedY = lowerBound;
            }
        } else if (this.speedY < -lowerBound) {
            if ((this.speedY += this.acceleration * coeff) > -lowerBound) {
                this.speedY = -lowerBound;
            }
        }
    }

    moveLeft() {
        if (this.speedX !== -this.maxSpeed) {
            this.speedX -= this.acceleration;
            if (this.speedX < -(this.maxSpeed)) {
                this.speedX = -(this.maxSpeed);
            }
        }
    }

    moveRight() {
        if (this.speedX !== this.maxSpeed) {
            this.speedX += this.acceleration;
            if (this.speedX > this.maxSpeed) {
                this.speedX = this.maxSpeed;
            }
        }
    }

    moveUp() {
        if (this.speedY !== -this.maxSpeed) {
            this.speedY -= this.acceleration;
            if (this.speedY < -(this.maxSpeed)) {
                this.speedY = -(this.maxSpeed);
            }
        }
    }

    moveDown() {
        if (this.speedY !== this.maxSpeed) {
            this.speedY += this.acceleration;
            if (this.speedY > this.maxSpeed) {
                this.speedY = this.maxSpeed;
            }
        }
    }

    /**
     * Logica di collisione con lo shield.
     * Inverte le velocità sugli assi ed imposta
     * il valore di bumping a true.
     * 
     * @param x ascissa del punto di collisione
     * @param y ordinata del punto di collisione
     */
    collideOnShield(x, y) {
        if (this.speedX === 0) {
            if (this.x < x) {
                this.speedX = 1;
            } else if (this.x > x) {
                this.speedX = -1;
            }
        }
        if (this.speedY === 0) {
            if (this.y < y) {
                this.speedY = 1;
            } else if (this.y > y) {
                this.speedY = -1;
            }
        }
        this.speedX *= -1;
        this.speedY *= -1;
        this.bumping = true;
    }

    /**
     * 
     * @param bubble bubble con cui potrebbe collidere
     * @returns {number} > 0 che indica la quantità di intersezione
     *          tra le due bolle, altrimenti >= 0 se non collidono
     */
    // > 0 se collide, <= 0 altrimenti
    collideOnBubble(bubble) {
        let r = this.radius + bubble.radius;
        return r - ShieldPoint.dist(this.x,this.y,bubble.x,bubble.y);
    }

    /**
     * Implementa la collisione con un'altra bolla.
     * Cambia il valore del raggio di una quantità dipendente
     * da radiusRatio e rallenta la velocità di un fattore
     * uguale al rapporto tra hit e il diametro della bolla 
     * considerata.
     * 
     * @param radiusRatio raggioBubbleMinore/raggioBubbleMaggiore
     * @param hit lunghezza dell'intersezione tra le due bolle
     */
    colliding(radiusRatio = 0, hit = 2 * this.radius) {
        let ratio = (hit / (2 * this.radius)).toFixed(2);
        this.radius -= radiusRatio;
        if (this.radius > Bubble.getMaxRadius) {
            this.radius = Bubble.getMaxRadius;
        }
        this.maxSpeed = Bubble.getCurrentMaxSpeed(this.radius);
        this.slowDownX(ratio, this.acceleration);
        this.slowDownY(ratio, this.acceleration);
    }
}