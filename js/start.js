// Il ready permette di determinare quando
// è possibile manipolare il DOM in maniera sicura
let mGame;
$('document').ready(function () {
    let background = new Image();
    background.onload = function () {
        mGame = Game.createGame(background);
        //mGame.init(background);
        //let g = renderLoop(mGame);
        window.requestAnimationFrame(renderLoop);
        window.onresize = () => {
            mGame.scaleForWindowResize()
        };
        console.log("Init canvas")
    };
    background.src = "background.svg";
});

function renderLoop() {
    //if (mGame !== undefined && mGame !== undefined) {
        /*if ((frameCount / 50) % 1 === 0) {
            //mGame.spawnCircle();
        }
        frameCount++;*/
        /*mGame.updatePositions();
        mGame.updateCanvas();*/
    //}
    mGame.gameLoop();
    //console.log("RENDER LOOP");
    requestAnimationFrame(renderLoop);
}


