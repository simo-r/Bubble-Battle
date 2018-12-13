class UserBubble {
    constructor(x, y, radius, color) {
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.color = color;
        this.isColliding = false;
        this.acceleration = 0.3;
        this.maxSpeed = 10;
        this.keys = {};
    }

    static createUserBubble(x, y, radius, color) {
        return new UserBubble(x, y, radius, color);
    }

    move(){
        if (!(Object.keys(mGame.keys).length === 0 && mGame.keys.constructor === Object)) {
            
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    isColliding(circle) {
        let r = this.radius + circle.radius;
        let x = this.x - circle.x;
        let y = this.y - circle.y;
        return r > Math.sqrt((x * x) + (y * y));
    }

    collidingWithEnemies() {
        //COLLIDING LOGIC
    }
    
    
}