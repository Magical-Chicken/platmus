from flask import Flask, render_template

app = Flask(__name__)

@app.route("/main.js")
def mainjs():
    with open("resources/song.mid.b64", "r") as fp:
        song_data = fp.read()
    return render_template("main.js", encsong=song_data)

if __name__ == "__main__":
    app.run(debug=True)
