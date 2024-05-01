from flask import Flask, render_template, Blueprint, jsonify, request
from collections import Counter


app = Flask(__name__) 


@app.route('/')
def view_landing():
    return render_template('landing.html')


@app.route('/bbgame')
def bbgame():
    return render_template('bbgame.html')

<<<<<<< Updated upstream
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
=======
@app.route('/fridge_contents', methods=['GET'])
def get_fridge_contents():
    fridgeContents = ["milk", "eggs", "butter"]
    result_data = {
        'result': fridgeContents[0] + "\n" + fridgeContents[1] + "\n" + fridgeContents[2],
    }
    print(result_data)
    return jsonify(result_data)


@app.route('/cabinet_contents', methods=['GET'])
def get_cabinet_contents():
    cabinetContents = ["flour", "baking powder", "sugar", "salt"]
    result_data = {
        'result':cabinetContents[0] + "\n" + cabinetContents[1] + "\n" + cabinetContents[2],
    }
    print(result_data)
    return jsonify(result_data)


>>>>>>> Stashed changes

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
    pancakeActions = ["place batter", "flip pancake", "remove from pan"]
    return jsonify(pancakeActions)

if __name__ == '__main__':
    app.run(debug=True)
    

