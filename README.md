ECE160 Final Project: Bunny Bakery an Idle Web game where your character can bake sweet treats

![Bunny Bakery Game](gamepictures/bbpicture.jpg)

Instructions on running the game

Make sure to have flask installed:
sudo apt install flask

RUNNING FLASK (make sure to be in the backend folder bunnybakery/backend)
Mac:
ACTIVATE VIRTUAL ENVIRONMENT
. .venv/bin/activate
RUN THESE COMMAND (do option two)
option1:
export FLASK_RUN=bbgame
export FLASK_DEV=development
flask run
Option2: 
python3 gameplay.py

Windows：
python3 -m venv venv
source venv/bin/activate
python3 gameplay.py

Notes:
- screen size of the game might be different for different laptop, in order to show full screen, suggested to zoom out on the website, if the format is messed up, suggested open inspect; working on fixing this
- logic in gameplay.py, bbgame.html, and bbgame.js
- restrictions due to scope of class assignment -> beyond class will be working on scaling up, moving over to primarily javascript for logic, and creating a database
