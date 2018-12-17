class ShieldPoint{
    constructor(x,y,backgroundX,backgroundY,clickDrag){
        this.x = x;
        this.y = y;
        this.clickDrag = clickDrag;
        this.backgroundX = backgroundX;
        this.backgroundY = backgroundY;
    }

    distanceTo(p2) {
        
        //p2.x - (this.x + currbg.x - this.bgx)
        let distance = Math.abs(Math.sqrt(
            Math.pow(p2.x - (this.x + p2.backgroundX - this.backgroundX), 2) + 
            Math.pow(p2.y - (this.y + p2.backgroundY - this.backgroundY), 2)));
        console.log("LENGTH " + distance);
        return distance;
    }
    
    get isDrag(){
        return this.clickDrag;
    }
    
    get getX(){
        return this.x;
    }
    
    get getY(){
        return this.y;
    }
    
    get getBackgroundX(){
        return this.backgroundX;
    }

    get getBackgroundY(){
        return this.backgroundY;
    }
    /*set setDrag(v){
        this.clickDrag = v;
    }*/
}