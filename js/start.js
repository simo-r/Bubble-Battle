// Il ready permette di determinare quando
// è possibile manipolare il DOM in maniera sicura
let mGame;
$('document').ready(function () {
    let background = new Image();
    background.onload = function () {
        mGame = Game.createGame(background);
        window.requestAnimationFrame(renderLoop);
        window.onresize = () => {
            mGame.scaleForWindowResize()
        };
        console.log("Init canvas")
    };
    background.src = "background.svg";
});

function renderLoop() {
    mGame.gameLoop();
    requestAnimationFrame(renderLoop);
}


