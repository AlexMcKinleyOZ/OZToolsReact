# Set Up

🖥️ React フロントエンド

```bash

cd internal-tools
npm install
npm start
```

🌐 Node.js バックエンド（URLコンソールチェッカー用）

```bash
cd ../internal-tools-backend
npm install
node index.js
```


🐍 Python バックエンド（Word → HTML コンバーター用）

```bash
cd ../py-doc-backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python convert.py
```

すべての依存関係がインストールされたら、以下のコマンドを実行してください。
初回は

ルートディレクトリで
```bash
npm install
```

```bash
npm run start-all
```
を実行すると、すべてのサーバーが起動します。

