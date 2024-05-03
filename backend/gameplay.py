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
        self.cookedPancake = {'place batter': 3, 'flip pancake2': 3, 'remove from pan': 3}
        self.pancakeActions = ["place batter", "flip pancake", "remove from pan"]



#instantiating level1
l1 = pancake()


#creating fridge contents buttons
@app.route('/fridge_contents')
def fridge_contents():
    fridgeContents = ["milk", "eggs", "butter"]
    return jsonify(fridgeContents)

#creating cabinet contents buttons
@app.route('/cabinet_contents')
def cabinet_contents():
    cabinetContents = ["flour", "baking powder", "sugar", "salt"]
    return jsonify(cabinetContents)
bowlIngredients = []

#adding cabinet/fridge contents to a bowl
@app.route('/ingredients_to_bowl', methods=['POST'])
def ingredients_to_bowl():
    data = request.get_json()
    item = data['item']
    bowlIngredients.append(item)
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
click_counts = {'place batter': 0, 'flip pancake': 0, 'remove from pan': 0}
allCooked = False


def check_all(dictionary):
    allCooked = all(value == 3 for value in dictionary.values())
    #allCooked = dictionary == l1.cookedPancake
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

 
@app.route('/all_pancakes_cooked')
def all_pancakes_cooked():
    allCooked = check_all(click_counts)
    print(allCooked)
    return jsonify({'cookedStatus': allCooked})


if __name__ == '__main__':
    app.run(debug=True)
    

