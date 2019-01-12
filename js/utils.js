function getRandomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getRandomWASD(){
    // Rappresenta WASD, se key[i] === 1 allora il tasto è premuto
    let key = {};
    let keyName = ['KeyW','KeyA','KeyS','KeyD'];
    let keyValue;
    for(let i = 0; i < 4; i++){
        keyValue = getRandomInteger(0,1);
        key[keyName[i]] = keyValue === 1;
    }
    return key;
}

function assert(cond,msg){
    if(!cond){
        throw msg || "Assertion failed";
    }
}

/*
function sortBubbles(bubbleArr,collidedBubbleIndexes) {
    console.log(" BUBBLE ARR " + bubbleArr.toString());
    let splicedElements = [];
    collidedBubbleIndexes.forEach( i => {
        console.log("SPLICED " + i);
        splicedElements.push(bubbleArr.splice(i,1)[0]);
    });
    console.log(" BUBBLE ARR " + bubbleArr.toString());
    splicedElements.forEach( currBubble =>{
        console.log("CURR BUBBLE " + currBubble.toString() + " index " + currBubble.getName);
        let left = 0;
        let right = bubbleArr.length - 1;
        /!*if((i-1) >= 0 && currBubble.getRadius < bubbleArr[i-1].getRadius ){
            right = i;
        }
        if((i+1) < bubbleArr.length && currBubble.getRadius > bubbleArr[i+1].getRadius){
            left = i;
        }*!/
        if(left === 0 && right === 0){
            console.log("LEFT === RIGHT === 0");
            if(bubbleArr[0].getRadius < currBubble.getRadius){
                bubbleArr.push(currBubble);
            }else{
                bubbleArr.unshift(currBubble);
            }
            return;
        }
        let mid =  Math.floor((left + right)/2);
        while(left < right){
            if(bubbleArr[mid].getRadius < currBubble.getRadius){
                right = mid - 1;
            }else{
                left = mid +1;
                
            }
            mid = Math.floor((left+right) / 2);
        }
        console.log("MID " + mid);
        bubbleArr.splice(mid,0,currBubble);
    });
    console.log(" BUBBLE ARR " + bubbleArr.toString());
}*/
