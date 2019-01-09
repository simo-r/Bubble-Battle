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