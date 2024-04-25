from flask import Flask, render_template, Blueprint, jsonify, request


app = Flask(__name__) 


@app.route('/')
def view_landing():
    return render_template('landing.html')


@app.route('/bbgame')
def bbgame():
    return render_template('bbgame.html')

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

@app.route('/fridge_contents', methods=['GET'])
def get_fridge_contents():
    fridgeContents = ["milk", "eggs", "butter"]
    result_data = {
        'result': fridgeContents[0] + "\n" + fridgeContents[1] + "\n" + fridgeContents[2],
    }
    print(result_data)
    return jsonify(result_data)


if __name__ == '__main__':
    app.run(debug=True)
