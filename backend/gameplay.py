from flask import Flask, render_template, Blueprint, jsonify, request
from collections import Counter
import time
import threading



app = Flask(__name__) 


@app.route('/')
def view_landing():
    return render_template('landing.html')

@app.route('/bbgame')
def bbgame():
    return render_template('bbgame.html')

#dylan's login code
@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/handle_post', methods=['POST'])
def handle_post():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        print(username, password)
        if username in users and users[username] == password:
            return '<h1>Welcome!!!</h1>'
        else:
            return '<h1>invalid credentials!</h1>'
    else:
        return render_template('login.html')


#Pancakes Class
class pancake:
    def __init__(self):
        self.recipe = ["milk", "eggs", "butter", "flour", "baking powder", "sugar", "salt"]
        self.cookedPancake = {'place batter': 3, 'flip pancake2': 3, 'remove from pan':3, 'plate pancake': 3}
        self.pancakeActions = ["place batter", "flip pancake", "remove from pan", "plate pancake"]
        self.pancakeToppings = ["syrup", "strawberries", "blueberries"]

class chatbox:
    def __init__(self):
        self.messages = [
                {"message": "Your first customer has woken up early craving pancakes. Time to get to work!"}, 
                {"message": "Grab the following ingredients from the fridge and add them to the bowl: milk, eggs, and butter. Grab the following ingredients from the cabinet and add them to the bowl: flour, baking powder, sugar, and a pinch of salt."},  
                {"message": "You have successfully added all the ingredients to the bowl. Now its time to mix the ingredients in the bowl."}, 
                {"message": "Incorrect ingredients have been added to the bowl. Remove the wrong ingredients"}]


#instantiating level1
l1 = pancake()


#sending chatbox updates
@app.route("/messages")
def get_messages():
    return jsonify(l1.messages)

#creating fridge contents buttons
@app.route('/fridge_contents', methods=['GET','POST'])
def fridge_contents():
    data = request.get_json()
    x = data['x']
    y = data['y']
    print(x,y) 

    if (x>430 and x<535 and y>150 and y<204):
        print(x,y) 
        fridgeContents = ["milk", "eggs", "butter", "strawberries", "blueberries"]
        return jsonify({"fridgeContents": fridgeContents , "signal": True })
    else:
       return jsonify({"fridgeContents": fridgeContents , "signal": False})

    
#creating cabinet contents buttons
@app.route('/cabinet_contents', methods=['GET','POST'])
def cabinet_contents():
    data = request.get_json()
    x = data['x']
    y = data['y']
    if (x>115 and x<175 and y>150 and y<204):
        print(x,y)
        cabinetContents = ["flour", "baking powder", "sugar", "salt", "syrup"]
    else:
        cabinetContents = ["","","","",""]
    return jsonify(cabinetContents)
bowlIngredients = []

#adding cabinet/fridge contents to the bowl
@app.route('/add_bowl_ingredient', methods=['POST'])
def add_bowl_ingredient():
    data = request.get_json()
    item = data['item']
    bowlIngredients.append(item)
    return jsonify({'status': 'success', 'bowlIngredients': bowlIngredients})

#removing cabinet/fridge contents from the bowl
@app.route('/remove_bowl_ingredient', methods=['POST'])
def remove_bowl_ingredient():
    data = request.get_json()
    item = data['item']
    bowlIngredients.remove(item)
    return jsonify({'status': 'success', 'bowlIngredients': bowlIngredients})

#removing ALL cabinet/fridge contents from the bowl
@app.route('/remove_all_bowl_ingredients', methods=['POST'])
def remove_all_bowl_ingredient():
    bowlIngredients.clear()
    print(bowlIngredients)
    return jsonify({'status': 'success', 'bowlIngredients': bowlIngredients})


#checking bowl ingredients to mix
@app.route('/check_bowl_ingredients')
def checking_bowl_ingredients():
    try:
        ingredientsPresent = Counter(bowlIngredients) == Counter(l1.recipe)
        return jsonify({"mix": ingredientsPresent})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#creating pancake buttons
@app.route('/pancake_buttons')
def pancake_buttons():
    return jsonify(l1.pancakeActions)


#click counts dictionary
click_counts = {'place batter': 0, 'flip pancake': 0, 'remove from pan': 0, 'plate pancake': 0}
allCooked = False


@app.route('/stove_dial_turn', methods=['GET','POST'])
def turn_dial():
    data = request.get_json()
    x = data['x']
    y = data['y']
    if (x>565 and x<620 and y>150 and y<204):
        print(x,y)
        return jsonify({"turn": True})
    else:
        return jsonify({"turn": False})

def check_all(dictionary):
    allCooked = all(value == 3 for value in dictionary.values())
    return allCooked

# tracking clicks
@app.route('/counting_pancake_actions', methods=['POST'])
def track_click():
    data = request.get_json()
    button_id = data.get('buttonId')
    if button_id in click_counts:
        click_counts[button_id] += 1
        print(click_counts)
    print(click_counts)
    return jsonify({'status': 'success'})

#making sure all pancakes are cooked 
@app.route('/all_pancakes_cooked')
def all_pancakes_cooked():
    allCooked = check_all(click_counts)
    print(allCooked)
    return jsonify({'cookedStatus': allCooked})

# checking bowl topppings to add to pancakes
@app.route('/check_bowl_toppings')
def checking_toppings_ingredients():
    try:
        print(bowlIngredients)
        toppingsPresent = Counter(bowlIngredients) == Counter(l1.pancakeToppings)
        return jsonify({"toppings": toppingsPresent})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
    

