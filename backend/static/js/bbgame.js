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

/*
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

function displayCabinetContents() {
    $.ajax({ 
        url: '/cabinet_contents',
        type: 'GET',
        dataType: 'json',
        success: function(response) { 
            document.getElementById('cabinet-output').innerHTML = response.result; 
        },
        error: function(error) { 
            console.log(error); 
        } 
    }); 
}
*/

//displaying the contents of the bowl
function displayBowlContents(item) {
    const container = document.getElementById('bowl-container');
    const ingredient = document.createElement('div');
    ingredient.textContent = item;
    container.appendChild(ingredient);
}


//refridgerator ingredient buttons and adding ingredients to a bowl
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fridge-contents').addEventListener('click', function() {
        fetch('/fridge_contents')
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById('fridge-container');
                container.innerHTML = '';
                data.forEach(item => {
                    const ingredient = document.createElement('button');
                    ingredient.textContent = item;
                    ingredient.onclick = function() {
                        displayBowlContents(item);
                        fetch('/ingredients_to_bowl', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ item: item })
                        })
                        .then(response => response.json())
                        .then(data => console.log(data))
                    };
                    container.appendChild(ingredient);
                });
            })
            .catch(error => console.error('Error fetching fridge contents:', error));
    });
});

//generating cabinet ingredients buttons and adding cabinet ingredients to a bowl
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('cabinet-contents').addEventListener('click', function() {
    fetch('/cabinet_contents')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('cabinet-container');
            container.innerHTML = '';
            data.forEach(item => {
                    const ingredient = document.createElement('button');
                    ingredient.textContent = item;
                    ingredient.onclick = function() {
                        displayBowlContents(item);
                        fetch('/ingredients_to_bowl', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ item: item })
                        })
                        .then(response => response.json())
                        .then(data => console.log(data))
                    };
                    container.appendChild(ingredient);
                });
            })
            .catch(error => console.error('Error fetching fridge contents:', error));
    });
});


