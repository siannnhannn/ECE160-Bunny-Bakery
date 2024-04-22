
from flask import Flask, render_template
app = Flask(__name__) 

@app.route('/')
def bbgame():
    return render_template('bbgame.html')

@app_route('/static/js', methods=['POST'])
def process():
    data = request.get_json()
    x_result = data['x']
    return jsonify(result=result)

if __name__ == '__main__':
    import app
    app.run(debug=True)


