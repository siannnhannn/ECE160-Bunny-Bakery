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

//STATE MACHINE IMPLEMENTATION COMMUNICAATING WITH PYTHON
let count = 0;
let mix = false;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('gameflow').addEventListener('click', handleGameFlowBackend);
});

function handleGameFlowBackend() {
    fetch('/gameflow', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({count: count})
    }).then(response => response.json())
    .then(data => {
        const gameflow = document.getElementById('gameflow');
        console.log("Response from server:", data);
        gameflow.textContent = data.buttonText;
        count = data.count;
        message = data.message;
        mix = data.mix;
        handleGameFlow(count, message, mix);
    }).catch(error => console.error('Error:', error));
}

//Call functions along with gameflow backend: this will actually implement the functions in the game
function handleGameFlow(count, message, mix) {
    if(count==0) {
        const messageBox = document.getElementById("instruction-text");
        messageBox.innerHTML = message;
    } else if (count==1) {
        const messageBox = document.getElementById("instruction-text");
        messageBox.innerHTML = message;
    } else if (count==2) {
        const messageBox = document.getElementById("instruction-text");
        messageBox.innerHTML = message;
        showDiv('ingredients');
        showDiv('bowl-ingredients');
        fridgeContents();
        cabinetContents();
    } else if (count==3) {
        const messageBox = document.getElementById("instruction-text");
        removeAllBowlIngredients();
        messageBox.innerHTML = message;
    } else if (count==4) {
        const messageBox = document.getElementById("instruction-text");
        messageBox.innerHTML = message;
        mixBowl();
    } else if (count==5) {
        const messageBox = document.getElementById("instruction-text");
        messageBox.innerHTML = message;
    } else if (count==6) {
        const messageBox = document.getElementById("instruction-text");
        messageBox.innerHTML = message;
        generateStoveDial();
    } else if (count==7) {
        const messageBox = document.getElementById("instruction-text");
        messageBox.innerHTML = message;
        pancakeNextClicked();
    } else if (count==8) {
        const messageBox = document.getElementById("instruction-text");
        messageBox.innerHTML = message;
    } else if (count==9) {
        const messageBox = document.getElementById("instruction-text");
        messageBox.innerHTML = message;
        showDiv('check-toppings');
        addToppings();
    }
}

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

// Function to handle the display and interaction with fridge contents// Function to handle the display and interaction with fridge contents
function fridgeContents() {
    const container1 = document.getElementById('main-buttons');
    const openFridgeButton = document.createElement('button');
    openFridgeButton.textContent = "Open Fridge";
    openFridgeButton.id = "open-fridge";
    container1.appendChild(openFridgeButton);

    openFridgeButton.addEventListener('click', function() {
        fetch('/fridge_contents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ x: x, y: y })
        })
        .then(response => response.json())
        .then(data => {
            if (data.signal) {
                const container = document.getElementById('fridge-container');
                container.innerHTML = '';

                data.fridgeContents.forEach(item => {
                    const ingredientButton = document.createElement('button');
                    const removeIngredientButton = document.createElement('button');
                    ingredientButton.textContent = `Add ${item}`;
                    removeIngredientButton.textContent = `Remove ${item}`;

                    ingredientButton.onclick = function() {
                        displayBowlContents(item);
                        fetch('/add_bowl_ingredient', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ item: item })
                        })
                        .then(response => response.json())
                        .then(data => console.log(data))
                    };
                    container.appendChild(ingredientButton);

                    removeIngredientButton.onclick = function() {
                        console.log('Remove button clicked');
                        removeBowlContents(item);
                        fetch('/remove_bowl_ingredient', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ item: item })
                        })
                        .then(response => response.json())
                        .then(data => console.log(data))
                    };
                    container.appendChild(removeIngredientButton);
                });

                const messageDiv = document.getElementById('message');
                messageDiv.textContent = "";

            } else {
                const messageDiv = document.getElementById('message');
                messageDiv.textContent = "Can't reach the fridge";
            }
        })
        .catch(error => console.error('Error fetching fridge contents:', error));
    });
}

// Function to handle the display and interaction with cabinet contents
function cabinetContents() {
    const container2 = document.getElementById('main-buttons');
    const openCabinetButton = document.createElement('button');
    openCabinetButton.textContent = "Open Cabinet";
    openCabinetButton.id = "open-cabinet";
    container2.appendChild(openCabinetButton);

    openCabinetButton.addEventListener('click', function() {
        fetch('/cabinet_contents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ x: x, y: y }) // Ensure x and y are defined somewhere
        })
        .then(response => response.json())
        .then(data => {
            if (data.signal) {
                const container = document.getElementById('cabinet-container');
                container.innerHTML = ''; // Clears previous contents

                data.cabinetContents.forEach(item => {
                    const ingredientButton = document.createElement('button');
                    const removeIngredientButton = document.createElement('button');
                    
                    ingredientButton.textContent = `Add ${item}`;
                    removeIngredientButton.textContent = `Remove ${item}`;

                    // Function to add ingredient to the bowl
                    ingredientButton.onclick = function() {
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
                    container.appendChild(ingredientButton);

                    // Function to remove ingredient from the bowl
                    removeIngredientButton.onclick = function() {
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
                    container.appendChild(removeIngredientButton);
                });

                const messageDiv = document.getElementById('message');
                messageDiv.textContent = "";

            } else {
                const messageDiv = document.getElementById('message');
                messageDiv.textContent = "Can't reach the cabinet";
            }
        })
        .catch(error => {
            console.error('Error fetching cabinet contents:', error);
            alert('Failed to load cabinet contents. Please try again.');
        });
    });
}

//clearing all the ingredients in the bowl
function removeAllBowlIngredients() {
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

// Mixing ingredients in the bowl
function checkIngredients(mix) {
    const container = document.getElementById('main-buttons');
    const checkIngredientsButton = document.createElement('button');
    checkIngredientsButton.textContent = "Check Ingredients";
    checkIngredientsButton.id = "check-ingredients";
    container.appendChild(checkIngredientsButton);

    checkIngredientsButton.addEventListener('click', function() {
        if (mix) {
            removeAllBowlIngredients();
            alert('Correct Ingredients');
        } else {
            alert('Incorrect ingredients');
        }
    });
}

//call from backend and output message bowl mixing
function mixBowl() {
    const container = document.getElementById('main-buttons');
    const mixBowlButton = document.createElement('button');
    mixBowlButton.textContent = "Mix Ingredients";
    mixBowlButton.id = "mix-ingredients";
    container.appendChild(mixBowlButton);

    mixBowlButton.addEventListener('click', function() {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = "Mixing ingredients in bowl";

        fetch('/bowl_is_mixed', {
        method: 'POST',
        headers: {  
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => console.log(data))
    });
}

//generating the stove dial
function generateStoveDial() {
    const dialButton = document.createElement('button')
    dialButton.textContent = "Dial Button"
    dialButton.id = "dial-button";
    const container = document.getElementById('stove-dial-generated');
    container.appendChild(dialButton);
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = "";

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
				const messageDiv = document.getElementById('message');
                messageDiv.textContent = "Can't reach stove";
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

//Function for dial turning when mouse holds
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
            const messageDiv = document.getElementById('message');
            messageDiv.textContent = "";
        }
    }, 50);

    button.addEventListener('mouseup', function() {
        clearInterval(button.interval);
    }); 
}

// Function to generate the 'Place Pan' button
function generatePlacePan() {
    const placePan = document.createElement('button');
    placePan.textContent = "Place Pan";
    placePan.id = "place-pan";
    const container1 = document.getElementById('cooking-pancake');
    container1.appendChild(placePan);

    placePan.addEventListener('click', function() {
        fetch('/pancake_actions_signal', {
            method: 'POST',
            headers: {  
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())  // Process the JSON response from the server
        .then(data => {
            if (data.status === 'success') {
                console.log('Pancake pan placed successfully', data);
            } else {
                throw new Error('Failed to place pancake pan');
            }
        })
        .catch(error => console.error('Error:', error));
    });
}

// Function to handle the 'Next' button click for pancakesfunction 
function pancakeNextClicked() {
    showDiv('pancake-actions-container');
    fetch('/pancake_buttons')
        .then(response => response.json())
        .then(data => {
            const container2 = document.getElementById('pancake-actions-container');
            container2.innerHTML = ''; // Clear previous buttons
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
            console.error('Error fetching pancake actions:', error);
        });
}

// Send instance of button click to python backend
function countingActions(actionButton) {
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

// Receive instance of all pancakes cooked from python backend
function areWeCooked() {
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

// Add syrup and fruits to the pancake
function addToppings() {
    document.getElementById('check-toppings').addEventListener('click', function() {
        fetch('/check_bowl_toppings')
            .then(response => response.json())
            .then(data => {
                if (data.toppings) {
                    const messageDiv = document.getElementById('message');
                    messageDiv.textContent = 'Syrup and fruits added to the pancake!';
                } else {
                    const messageDiv = document.getElementById('message');
                    messageDiv.textContent = 'Incorrect toppings';
                }
            })
            .catch(error => console.error('Error fetching toppings:', error));
    });
}

function showDiv(divName) {
    var div = document.getElementById(divName);
    div.style.opacity = 1;
    div.style.transition = "opacity 0.5s";
}

function hideDiv(divName) {
    var div = document.getElementById(divName);
    div.style.opacity = 0;
    div.style.transition = "opacity 0.5s";
}
