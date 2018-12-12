// Il ready permette di determinare quando
// è possibile manipolare il DOM in maniera sicura
$('document').ready(function () {
    let background = new Image();
    background.onload = function () {
        console.log("Init canvas")
    };
    background.src = "background.svg";
});


