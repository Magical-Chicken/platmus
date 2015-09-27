# Flask server that does nothing so we can test

from flask import Flask

app = Flask(__name__)

if __name__ == "__main__":
    app.run(debug=True)
