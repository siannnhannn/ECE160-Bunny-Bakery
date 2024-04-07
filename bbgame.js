console.log("bbgame.js loaded")

let bakeryName = "";

function setBakeryName() {
    var bakeryName = document.getElementById("bakeryNameInput").value.trim();
    if (bakeryName) {
        document.getElementById("bakeryNameDisplay").textContent = bakeryName;
         
        document.getElementById('bakeryNameInput').value='';
    } else {
        alert("Name your bakery: ");
    }
}


window.addEventListener("keydown", function(e) {
    if (e.code == 'KeyD') vy = 5;
})

window.addEventListener("DOMContentLoaded", () => {
    const frameCanvas = document.getElementById("game-frame");
    const drawingCanvas = document.getElementById("drawing-game-frame");
    const frameCtx = frameCanvas.getContext("2d");
    const drawingCtx = drawingCanvas.getContext("2d");
    
    const bgImg = new Image();
    bgImg.src = 'BUNNYBAKERY.png';
    img.onload = function() {
        frameCtx.drawImage(bgImg, 0, 0, frameCanvas.width, frameCanvas.height);
    };
 

    x=0;
    y=0;
    vx=0;
    vy=0;

    function update() {
        drawinCctx.clearRect(0,0, drawingCanvas.width, drawingCanvas.height)
        x+=vx;
        y+=vy;
        drawingCtx.fillRect(x,y,50,50)
        requestAnimationFrame(update)
    }
    update()
})



