from flask import Flask, render_template, Blueprint, jsonify, request, session, redirect, url_for, flash
from gameplay import pancake, fridge_contents, cabinet_contents, ingredients_to_bowl, checking_bowl_ingredients, pancake_buttons 

import sqlite3

app = Flask(__name__) 
app.secret_key="Bruh"  #change this lol
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn


@app.route('/')
def view_landing():
    return render_template('landing.html')
def index():
    conn = get_db_connection()
    posts = conn.execute('SELECT * FROM posts').fetchall()
    conn.close()
    return render_template('index.html', posts=posts)


@app.route('/bbgame')
def bbgame():
    return render_template('bbgame.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/handle_post', methods=['POST'])
def handle_post():
    if request.method == 'POST':
        error = None
        username  = request.form['username']
        session['user'] = username
        password = request.form['password']   #hash, maybe 
        print(username, password) #delete this later
        
        #case 1: either username or password field is empty
        if not username:
            error = 'Input a username'
            print(error)
            return redirect(url_for('login'))
        elif not password:
            error = 'Input a password'
            print(error)
            return redirect(url_for('login'))

            
#case 2: check if user exists in db 
        else:
            conn = get_db_connection()
            query_exists = conn.execute('SELECT COUNT(*) FROM posts WHERE uname=?',(username,)).fetchone()
            print(query_exists)
            if query_exists:
                print(111)
                query_password = conn.execute('SELECT password FROM posts WHERE uname=?',(username,)).fetchone()
                print(query_password)
                if query_password == password:
                    return redirect(url_for('bbgame'))   
 
            conn.execute('INSERT INTO posts (uname, password) VALUES (?, ?)',
                         (username, password))
            conn.commit()
            conn.close()
            return render_template("login.html", error=error)


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
