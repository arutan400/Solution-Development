from flask import Flask, jsonify, render_template
import requests

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/proxy_nodes")
def proxy_nodes():
    try:
        res = requests.get("http://162.43.47.174:8080/nodes", timeout=5)
        res.raise_for_status()
        return jsonify(res.json())
    except requests.RequestException as e:
        print("★外部API取得エラー：", e)  # ← これを追加！
        return jsonify({"error": "データ取得に失敗しました", "details": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)