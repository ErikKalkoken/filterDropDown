import json
from pathlib import Path

from flask import Flask, render_template, Blueprint, jsonify

app = Flask(__name__)
static_path = Path(__file__).parent.parent / "js"
blueprint = Blueprint(
    "site", __name__, static_url_path="/static/site", static_folder=str(static_path)
)
app.register_blueprint(blueprint)


@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")


@app.route("/test_vanilla", methods=["GET"])
def vanilla():
    return render_template("test.html")


@app.route("/test_bootstrap", methods=["GET"])
def bootstrap():
    return render_template("test_bs.html")


@app.route("/data", methods=["GET"])
def data():
    filepath = Path(__file__).parent / "data.json"
    with filepath.open("r") as f:
        data = json.load(f)

    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True, port=5000)  # run app in debug mode on port 5000
