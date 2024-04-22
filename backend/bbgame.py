from flask import Flask, render_template
app = Flask(__name__) 

@app.route('/')
def bbgame():
    return render_template('bbgame.html')

if __name__ == '__main__':
    app.run(debug=True)
=======
from flask import Flask

app = Flask(__name__)

@app.route('/')

def hello():
    return 'HELLO'

if __name__=='__main__':
    app.run()

