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
            frameCtx.drawImage(pinkSprite, x, y, 110, 110);
        }
        requestAnimationFrame(update)
    };
    update()
})

/*
//chatbox fetching messages from backend and displaying them
function fetchMessages(messageIndex) {
    fetch("/messages")
        .then(function(response) {
            return response.json();
        })
        .then(function(messages) {
            const messageBox = document.getElementById("message-box");
            messageBox.innerHTML = messages[messageIndex].message;
        })
        .catch(function(error) {
            console.error("Error fetching messages:", error);
        });
}
*/

// Displaying the contents of the bowl on add ingredient button press
function displayBowlContents(item) {
    const container = document.getElementById('bowl-container');
    const ingredient = document.createElement('div');
    ingredient.id = item;
    ingredient.textContent = item;
    container.appendChild(ingredient);
}

// Removing contents of the bowl on remove ingredient button press
function removeBowlContents(item) {
    const container = document.getElementById('bowl-container');
    const ingredient = document.getElementById(item);
    if (ingredient) {
        container.removeChild(ingredient); 
    } else {
        console.warn(`No element found with ID ${item}`);
    }
}

/*
//first message before game begins
fetchMessages(1);
fetchMessages(2);
*/





// Refrigerator ingredient buttons and adding ingredients to a bowl
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
		if (data.signal) {
	                const container = document.getElementById('fridge-container');
	                container.innerHTML = '';
	
	                data.fridgeContents.forEach(item => {
	                    const ingredient = document.createElement('button');
	                    const removeIngredient = document.createElement('button');
	                    ingredient.textContent = `Add ${item}`;
	                    removeIngredient.textContent = `Remove ${item}`;
	                    
	                    ingredient.onclick = function() {
	                        displayBowlContents(item);
	                        fetch('/add_bowl_ingredient', {
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
	
	                    removeIngredient.onclick = function() {
	                        console.log('Remove button clicked');
	                        removeBowlContents(item);
	                        fetch('/remove_bowl_ingredient', {
	                            method: 'POST',
	                            headers: {  
	                                'Content-Type': 'application/json'
	                            },
	                            body: JSON.stringify({ item: item })
	                        })
	                        .then(response => response.json())
	                        .then(data => console.log(data))
	                    };
	                    container.appendChild(removeIngredient);
	                });
		} else {
			alert("can't reach the fridge");
		}
            })
            .catch(error => console.error('Error fetching fridge contents:', error));
    });
});


// Generating cabinet ingredient buttons and adding cabinet ingredients to a bowl
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('cabinet-contents').addEventListener('click', function() {
        fetch('/cabinet_contents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ x: x, y: y })
        })
        .then(response => response.json())
        .then(data => {
            if (data.signal) {
                const container = document.getElementById('cabinet-container');
                container.innerHTML = '';

                data.forEach(item => {
                    const ingredient = document.createElement('button');
                    const removeIngredient = document.createElement('button');
                    
                    ingredient.textContent = `Add ${item}`;
                    removeIngredient.textContent = `Remove ${item}`;

                    ingredient.onclick = function() {
                        displayBowlContents(item);
                        fetch('/add_bowl_ingredient', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ item: item })
                        })
                        .then(response => response.json())
                        .then(data => console.log(data));
                    };
                    container.appendChild(ingredient);

                    removeIngredient.onclick = function() {
                        console.log('Remove button clicked');
                        removeBowlContents(item);
                        fetch('/remove_bowl_ingredient', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ item: item })
                        })
                        .then(response => response.json())
                        .then(data => console.log(data));
                    };
                    container.appendChild(removeIngredient);
                });
            } else {
                alert("Can't reach the cabinet");
            }
        })
        .catch(error => console.error('Error fetching cabinet contents:', error));
    });
});


//clearing all the ingredients in the bowl
function mixedBowlContentsDisplay() {
    const container = document.getElementById('bowl-container');
    container.innerHTML = '';
        fetch('/remove_all_bowl_ingredients', {
        method: 'POST',
        headers: {  
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => console.log(data))
}


//Mixing ingredients in the bowl
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('mix-button').addEventListener('click', function() {
        fetch('/check_bowl_ingredients')
            .then(response => response.json())
            .then(data => {
               if (data.mix) {
                   mixedBowlContentsDisplay();
                   generateStoveDial();

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
	    fetch('/stove_dial_turn',{
	    	method: 'POST',
	    	headers: {
		    'Content-Type': 'application/json'
	    	},
	    	body: JSON.stringify({ x: x , y: y })
	    })
	    	.then(response => response.json())
	        .then(data => {
			if (data.turn){
				turnDial();
			}
			else{
				alert("Can't reach stove");
			}
       
    		})
            .catch(error => console.error('Error turning stove dial', error));
    });

    dialButton.addEventListener('mouseup', function() {
        clearInterval(this.interval);

    }); 
    dialButton.addEventListener('mouseleave', function() {
        clearInterval(this.interval);
    });
}

function turnDial() {
    	const button = document.getElementById('dial-button');
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
            console.log("Pancakes are done cooking.");
            addToppings();
        } else {
            console.log("Pancakes are not all cooked.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}




//add syrup and fruits to the pancake
function addToppings() {
    document.getElementById('check-toppings').addEventListener('click', function() {
        fetch('/check_bowl_toppings')
            .then(response => response.json())
            .then(data => {
                if (data.toppings) {
                    // chatbox message
                    generateLevelFinishButton(); 
                } else {
                    alert('Incorrect toppings');
                }
            })
            .catch(error => console.error('Error fetching ingredients:', error));
    });
}

function generateLevelFinishButton() {
    const finishedButton = document.createElement('button')
    finishedButton.textContent = "Finish Game"
    finishedButton.id = "finished-button"
    const container = document.getElementById('end-of-game');
    container.appendChild(finishedButton);
    alert('YOU HAVE FINISHED THE LEVEL GOOD JOB!!!!!!!!');

}


function showDiv() {
    var div = document.getElementById('pancake-actions-container');
    div.style.opacity = 1;
    div.style.transition = "opacity 0.5s";
}
