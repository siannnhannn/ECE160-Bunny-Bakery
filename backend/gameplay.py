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
        self.messages = [
                {"message": "Your first customer has woken up early craving pancakes. Time to get to work!"}, 
                {"message": "Grab the following ingredients from the fridge and add them to the bowl: milk, eggs, and butter. Grab the following ingredients from the cabinet and add them to the bowl: flour, baking powder, sugar, and a pinch of salt."},  
                {"message": "You have successfully added all the ingredients to the bowl. Now its time to mix the ingredients in the bowl."}, 
                {"message": "Incorrect ingredients have been added to the bowl. Add and remove ingredients so that they are correct."}, 
                {"message": "All of your ingredients have been mixed"},
                {"message": "Turn on your stove"},
                {"message": "Place your pan down on the stove"}]




#instantiating level1
l1 = pancake()


#PYTHON STATE MACHINE THAT COMMUNICATES WITH THE FRONT END; THIS IS NOT WORKING YET VARIABLES:w
count = 0
mix = False
mixed = False
placed = False
clicked = False



#sending chatbox updates (this is called in the javascript state machine)
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
        return jsonify({"fridgeContents": fridgeContents, "signal": True})
    else:
       return jsonify({"signal": False})

    
#creating cabinet contents buttons
@app.route('/cabinet_contents', methods=['GET','POST'])
def cabinet_contents():
    data = request.get_json()
    x = data['x']
    y = data['y']
    if (x>115 and x<175 and y>150 and y<204):
        print(x,y)
        cabinetContents = ["flour", "baking powder", "sugar", "salt", "syrup"]
        return jsonify({"cabinetContents": cabinetContents, "signal": True})
    else:
        return jsonify({"signal": False})
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


#signal that all the bowl ingredients have been mixed
@app.route('/bowl_is_mixed', methods=['POST'])
def bowl_is_mixed():
    global mixed
    mixed = True
    return jsonify({'status': 'success', 'mixed': mixed})


#creating pancake buttons
@app.route('/pancake_actions_signal', methods=['POST'])
def pancake_actions_signal():
    global clicked
    clicked = True
    print(clicked)
    return jsonify({'status': 'success', 'clicked': clicked})


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


@app.route('/gameflow', methods=['POST'])
def l1_game_flow():
    global count, mix, mixed

    try:
        data = request.get_json()
    except Exception as e:
        return jsonify({"error": "Invalid JSON", "details": str(e)}), 400

    result = {"message": "", "count": count, "buttonText": "", "mix": mix}
    
    if count == 0:
        result["message"] = "Your first customer has woken up early craving pancakes. Time to get to work!"
        count = 1
        mix = False
        result["buttonText"] = "Next"
    elif count == 1:
        result["message"] = "Grab the following ingredients from the fridge and add them to the bowl: milk, eggs, and butter. Grab the following ingredients from the cabinet and add them to the bowl: flour, baking powder, sugar, and a pinch of salt. Make sure to check your ingredients."
        result["buttonText"] = "check ingredients"
        count = 2
    elif count == 2: 
        ingredientsPresent = Counter(bowlIngredients) == Counter(l1.recipe)
        mix = ingredientsPresent
        if mix:
            result["message"] = "You have successfully added all the ingredients to the bowl."
            result["buttonText"] = "Next"
            count = 3
        else:
            result["message"] = "Incorrect ingredients have been added to the bowl. Add and remove ingredients so that they are correct."
            mix = False  # Reset mix on ingredient correction
            result["buttonText"] = "Prev"
            count = 1
    elif count == 3:
        result["message"] = "Mix the ingredients in the bowl."
        result["buttonText"] = "Next"
        count=4
    elif count == 4:
        print(mixed)
        if mixed:
            result["message"] = "You have successfully mixed all the ingredients in the bowl."
            result["buttonText"] = "Next"
            mixed = False
            print(count)
            count=5
        else:
            result["message"] = "You have not yet mixed your ingredients in the bowl."
            result["buttonText"] = "Prev"
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
        self.messages = [
                {"message": "Your first customer has woken up early craving pancakes. Time to get to work!"}, 
                {"message": "Grab the following ingredients from the fridge and add them to the bowl: milk, eggs, and butter. Grab the following ingredients from the cabinet and add them to the bowl: flour, baking powder, sugar, and a pinch of salt."},  
                {"message": "You have successfully added all the ingredients to the bowl. Now its time to mix the ingredients in the bowl."}, 
                {"message": "Incorrect ingredients have been added to the bowl. Add and remove ingredients so that they are correct."}, 
                {"message": "All of your ingredients have been mixed"},
                {"message": "Turn on your stove"},
                {"message": "Place your pan down on the stove"}]




#instantiating level1
l1 = pancake()


#PYTHON STATE MACHINE THAT COMMUNICATES WITH THE FRONT END; THIS IS NOT WORKING YET VARIABLES:w
count = 0
mix = False
mixed = False
paced = False
clicked = False



#sending chatbox updates (this is called in the javascript state machine)
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
        return jsonify({"fridgeContents": fridgeContents, "signal": True})
    else:
       return jsonify({"signal": False})

    
#creating cabinet contents buttons
@app.route('/cabinet_contents', methods=['GET','POST'])
def cabinet_contents():
    data = request.get_json()
    x = data['x']
    y = data['y']
    if (x>115 and x<175 and y>150 and y<204):
        print(x,y)
        cabinetContents = ["flour", "baking powder", "sugar", "salt", "syrup"]
        return jsonify({"cabinetContents": cabinetContents, "signal": True})
    else:
        return jsonify({"signal": False})
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


#signal that all the bowl ingredients have been mixed
@app.route('/bowl_is_mixed', methods=['POST'])
def bowl_is_mixed():
    global mixed
    mixed = True
    return jsonify({'status': 'success', 'mixed': mixed})


#Pancake actions signal
@app.route('/pancake_actions_signal', methods=['POST'])
def pancake_actions_signal():
    global clicked
    clicked = True
    return jsonify({'status': 'success', 'clicked': clicked})


#pancake buttons list
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
    global allCooked
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
    global allCooked
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


@app.route('/gameflow', methods=['POST'])
def l1_game_flow():
    global count, mix, mixed, clicked, allCooked

    try:
        data = request.get_json()
    except Exception as e:
        return jsonify({"error": "Invalid JSON", "details": str(e)}), 400

    result = {"message": "", "count": count, "buttonText": "", "mix": mix}
    
    if count == 0:
        result["message"] = "Your first customer has woken up early craving pancakes. Time to get to work!"
        count = 1
        mix = False
        result["buttonText"] = "Next"
    elif count == 1:
        result["message"] = "Grab the following ingredients from the fridge and add them to the bowl: milk, eggs, and butter. Grab the following ingredients from the cabinet and add them to the bowl: flour, baking powder, sugar, and a pinch of salt. Make sure to check your ingredients."
        result["buttonText"] = "check ingredients"
        count = 2
    elif count == 2: 
        ingredientsPresent = Counter(bowlIngredients) == Counter(l1.recipe)
        mix = ingredientsPresent
        if mix:
            result["message"] = "You have successfully added all the ingredients to the bowl."
            result["buttonText"] = "Next"
            count = 3
        else:
            result["message"] = "Incorrect ingredients have been added to the bowl. Add and remove ingredients so that they are correct."
            mix = False  # Reset mix on ingredient correction
            result["buttonText"] = "Prev"
            count = 1
    elif count == 3:
        result["message"] = "Mix the ingredients in the bowl."
        result["buttonText"] = "Next"
        count=4
    elif count == 4:
        print(mixed)
        if mixed:
            result["message"] = "You have successfully mixed all the ingredients in the bowl."
            result["buttonText"] = "Next"
            mixed = False
            count=5
        else:
            result["message"] = "You have not yet mixed your ingredients in the bowl."
            result["buttonText"] = "Prev"
            count = 3
    elif count == 5:
        result["message"] = " Now you must turn on your stove and place down your pan."
        result["buttonText"] = "Next"
        count = 6
    elif count ==6:
        print(clicked)
        if clicked:
            result["message"] = "You have successfully placed your pan on the stove."
            result["buttonText"] = "Next"
            count = 7
        else: 
            result["message"] = "You have not yet placed your pan on the stove."
            result["buttonText"] = "Prev"
            count = 6
        result["buttonText"] = "Next"
    elif count == 7:
        result["message"] = "Complete the pancake actions to cook your pancakes."
        result["buttonText"] = "Next"
        if allCooked:
            count = 8
    elif count == 8:
        result["message"] = "Your pancakes are finished cooking"
        result["buttonText"] = "Next"
        count = 9
    elif count ==9:
        result["message"] = "Place toppings on your pancakes"        
        result["buttonText"] = "You're done"



    result["mix"] = mix  # Update mix state in the result
    result["count"] = count  # Update count state in the result
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)
    

