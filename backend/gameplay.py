from flask import Flask, render_template, Blueprint, jsonify, request


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

if __name__ == '__main__':
    app.run(debug=True)


