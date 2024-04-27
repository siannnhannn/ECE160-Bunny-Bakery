from flask import Flask, render_template, Blueprint, jsonify, request


app = Flask(__name__) 


@app.route('/')
def view_landing():
    return render_template('landing.html')


@app.route('/bbgame')
def bbgame():
    return render_template('bbgame.html')

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



if __name__ == '__main__':
    app.run(debug=True)


