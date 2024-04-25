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
    bgImg.src = 'static/img/BUNNYBAKERY.png';
    bgImg.onload = function() {
        frameCtx.drawImage(bgImg, 0, 0, frameCanvas.width, frameCanvas.height);
    };
    
    const bgCounter = new Image();
    bgCounter.src = 'static/img/BUNNYBAKERYCOUNTER.png'
    const pinkSprite = new Image();
    pinkSprite.src = 'static/img/PINKSPRITE.png';

    x=100;
    y=225;
    vx=0;
    vy=0;

    function update() {
        frameCtx.clearRect(0,0, frameCanvas.width, frameCanvas.height)
        if(x<45) {
            x = 45;
        } else if (x>620) {
            x = 620;
        } else if (y<180) {
            y = 180;
        } else if (y>440) {
            y = 440;
        } else if (y>290 && y<340 && x<575) {
            y = 290;
        } else if (y<420 && y>340 && x<575) {
            y = 420;
        } else if (x<580 && y>290 && y<420) {
            x = 580;
        } else {
            x+=vx;
            y+=vy;
        }
        frameCtx.drawImage(bgImg, 0, 0, frameCanvas.width, frameCanvas.height);

        if(y<305) {
            frameCtx.drawImage(pinkSprite, x, y,110,110);
            frameCtx.drawImage(bgCounter, 0, 0, frameCanvas.width, frameCanvas.height);
        } else {
            frameCtx.drawImage(bgCounter, 0, 0, frameCanvas.width, frameCanvas.height);
            frameCtx.drawImage(pinkSprite, x, y, 100, 100);
        }
        requestAnimationFrame(update)
    };
    update()
})


function displayFridgeContents() {
    $.ajax({
        url: '/fridge_contents',
        type: 'GET',
        success: function(result_data) {
            $('#data').text(JSON.stringify(result_data));
        },
        error: function(error) {
            console.log('Error:', error);
        }
    });
}

function displayFridgeContents() {
    $.ajax({ 
        url: '/fridge_contents',
        type: 'GET',
        dataType: 'json',
        success: function(response) { 
            document.getElementById('fridge-output').innerHTML = response.result; 
        },
        error: function(error) { 
            console.log(error); 
        } 
    }); 
}

