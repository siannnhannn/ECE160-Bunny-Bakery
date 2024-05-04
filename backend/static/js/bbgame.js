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
        fetch('/fridge_contents', {
		method: 'POST',
		headers: {
		    'Content-Type': 'application/json'
		},
		body: JSON.stringify({ x: x , y: y })
	
	})
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
    fetch('/cabinet_contents',{
	    method: 'POST',
	    headers: {
		    'Content-Type': 'application/json'
	    },
	    body: JSON.stringify({ x: x , y: y })

    })
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
 aaaaaaa   });
});

//Mixing ingredients in the bowl
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('mix-button').addEventListener('click', function() {
        fetch('/check_bowl_ingredients')
            .then(response => response.json())
            .then(data => {
               if (data.mix) {
                   generateStoveDial();
                   //alert('Mixing ingredient in bowl');
               } else {
                    alert('Incorrect ingredients');
                }
            })
            .catch(error => console.error('Error fetching ingredients:', error));
    });
});


//generating and turning the stove dial
function generateStoveDial() {
    const dialButton = document.createElement('button')
    dialButton.textContent = "Dial Button"
    dialButton.id = "dial-button";
    const container = document.getElementById('stove-dial-generated');
    container.appendChild(dialButton);

    dialButton.addEventListener('mousedown', function() {
        const button = this;
        button.degrees = button.degrees || 0; 
        button.interval = setInterval(() => {
            if (button.degrees < 270) {
                button.degrees += 5;
                button.style.transform = `rotate(${button.degrees}deg)`;
            } else {
                button.degrees = 270;
                button.style.transform = `rotate(${button.degrees}deg)`;
                generatePlacePan();
                clearInterval(button.interval);
            }
        }, 50);
    });

    dialButton.addEventListener('mouseup', function() {
        clearInterval(this.interval);

    }); 
    dialButton.addEventListener('mouseleave', function() {
        clearInterval(this.interval);
    });
}




// Generating the 'Place Pan' button
function generatePlacePan() {
    const placePan = document.createElement('button');
    placePan.textContent = "Place Pan";
    placePan.id = "place-pan";
    const container1 = document.getElementById('cooking-pancake');
    container1.appendChild(placePan);

    placePan.addEventListener('click', function() {
        showDiv(); // This function needs to be defined somewhere in your code
        fetch('/pancake_buttons')
            .then(response => response.json())
            .then(data => {
                const container2 = document.getElementById('pancake-actions-container');
                container2.innerHTML = '';
                data.forEach(action => {
                    const actionButton = document.createElement('button');
                    actionButton.textContent = action;
                    actionButton.onclick = function() {
                        countingActions(actionButton.textContent);
                        areWeCooked();
                    };
                    container2.appendChild(actionButton);
                });
            })
            .catch(error => {
                console.error('Error fetching pancake actions', error);
            });
    });
}


// Send a click of an action to the Python side
function countingActions(actionButton) {
    // Send instance of button click to python backend
    const buttonId = actionButton.id;
    fetch('/counting_pancake_actions', {
        method: "POST",
        body: JSON.stringify({
            buttonId: actionButton
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function areWeCooked() {
    // Receive instance of all pancakes cooked from python backend
    fetch('/all_pancakes_cooked')
    .then(response => response.json())
    .then(data => {
        if (data.cookedStatus) {
            // Plate the pancakes
            console.log("All pancakes are cooked. Plating the pancakes...");
        } else {
            console.log("Pancakes are not all cooked.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function showDiv() {
    var div = document.getElementById('pancake-actions-container');
    div.style.opacity = 1;
    div.style.transition = "opacity 0.5s";
}
