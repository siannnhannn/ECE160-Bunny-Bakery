from flask import Flask, render_template

app = Flask(__name__) 

@app.route('/')
def bbgame():
    return render_template('bbgame.html')



if __name__ == '__main__':
#    import app
    app.run(debug=True)
