const keyW = 'KeyW';
const keyA = 'KeyA';
const keyS = 'KeyS';
const keyD = 'KeyD';

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

function getRandomWASD() {
    // Rappresenta WASD, se key[i] === 1 allora il tasto è premuto
    let key = {};
    let keyName = [keyW,keyA, keyS, keyD];
    let keyValue;
    for (let i = 0; i < 4; i++) {
        keyValue = getRandomInteger(0, 1);
        key[keyName[i]] = keyValue === 1;
    }
    return key;
}

function assert(cond, msg) {
    if (!cond) {
        throw msg || "Assertion failed";
    }
}

/**
 * Rimuove l'elemento in posizione collidedbubbleindex
 * e ricerca la nuova posizione di questo elemento nell'array
 * usando una ricerca binaria.
 * Splice effettua lo shift degli elementi all'interno 
 * dell'array
 * 
 * @param bubbleArr array da ordinare
 * @param collidedBubbleIndex indice dell'elemento da ri-ordinare
 */
function sortBubbles(bubbleArr, collidedBubbleIndex) {
    const splicedElement = (bubbleArr.splice(collidedBubbleIndex, 1)[0]);
    let pos = binarySearch(bubbleArr, splicedElement, 0, bubbleArr.length - 1);
    bubbleArr.splice(pos, 0, splicedElement);
}


function binarySearch(bubbleArr, splicedElement, left, right) {
    if (right <= left)
        return (splicedElement.getRadius > bubbleArr[left].getRadius) ? (left + 1) : left;
    let mid = Math.floor((left + right) / 2);
    if (splicedElement.getRadius === bubbleArr[mid].getRadius)
        return mid + 1;
    if (splicedElement.getRadius > bubbleArr[mid].getRadius)
        return binarySearch(bubbleArr, splicedElement, mid + 1, right);
    return binarySearch(bubbleArr, splicedElement, left, mid - 1);
} 
