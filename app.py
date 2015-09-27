from flask import Flask, render_template

app = Flask(__name__)

@app.route("/main.js")
def thingy():
    return render_template("main.js")

if __name__ == "__main__":
    app.run(debug=True)
