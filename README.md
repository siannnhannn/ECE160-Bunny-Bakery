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
- wasn't able to compute database
- screen size of the game might be different for different laptop, in order to show full screen, suggested to zoom out on the website, if the format is messed up, suggested open inspect
- features such as new levels will be computed in upcoming updates
- logics are in gameplay.py, bbgame.html, and bbgame.js
