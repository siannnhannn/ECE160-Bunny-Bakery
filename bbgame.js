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
    if (e.code == 'KeyS') vy = 3;
    if (e.code == 'KeyW') vy = -3;
    if (e.code == 'KeyD') vx = 3;
    if (e.code == 'KeyA') vx = -3;
})

window.addEventListener("keyup", function(e) {
    if (e.code == 'KeyS') vy = 0;
    if (e.code == 'KeyW') vy = 0;
    if (e.code == 'KeyD') vx = 0;
    if (e.code == 'KeyA') vx = 0;
    
})
    
window.addEventListener("DOMContentLoaded", () => {
    const frameCanvas = document.getElementById("game-frame");
    const frameCtx = frameCanvas.getContext("2d");
   
       //drawing background
    const bgImg = new Image();
    bgImg.src = 'BUNNYBAKERY.png';
    bgImg.onload = function() {
        frameCtx.drawImage(bgImg, 0, 0, frameCanvas.width, frameCanvas.height);
    };
    

    const pinkSprite = new Image();
    pinkSprite.src = 'PINKSPRITE.png';

    x=5;
    y=5;
    vx=0;
    vy=0;

    function update() {
        frameCtx.clearRect(0,0, frameCanvas.width, frameCanvas.height)
        if(x<5) {
            x = 5;
        } else if (x>506) {
            x = 506;
        } else if (y<5) {
            y = 5;
        } else if (y>335) {
            y = 335;
        } else {
            x+=vx;
            y+=vy;
        }
        frameCtx.drawImage(bgImg, 0, 0, frameCanvas.width, frameCanvas.height);

        frameCtx.drawImage(pinkSprite, x, y,200,200);
        requestAnimationFrame(update)
    };
    update()
})



