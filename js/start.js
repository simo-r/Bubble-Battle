// Il ready permette di determinare quando
// è possibile manipolare il DOM in maniera sicura
let mGame;
let reqId;
$('document').ready(function () {
    let background = new Image();
    background.onload = function () {
        mGame = Game.createGame(background);
        window.onresize = () => {
            mGame.scaleForWindowResize()
        };
        reqId = window.requestAnimationFrame(renderLoop);

        console.log("Init canvas")
    };
    background.src = "background.svg";
});

function renderLoop() {
   /* if(!lastCalledTime) {
        lastCalledTime = Date.now();
        fps = 0;
        return;
    }
    delta = (Date.now() - lastCalledTime)/1000;
    lastCalledTime = Date.now();
    fps = 1/delta;*/
    mGame.gameLoop();
    reqId = window.requestAnimationFrame(renderLoop);
    // TROPPO LENTO
    if (mGame.isGameOver) {
        window.cancelAnimationFrame(reqId);
    }
}
