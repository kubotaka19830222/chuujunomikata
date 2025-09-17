# 🎯 Cursor完全セットアップガイド

## 📁 Step 1: プロジェクトフォルダ作成

### Cursorで新しいフォルダを作成
1. **Cursor**を開く
2. **「File」→「New Folder」**
3. フォルダ名: `chuugaku-juken-bot`
4. フォルダを開く

### 📄 必要なファイルを作成

#### 1️⃣ ルートディレクトリに作成
```
chuugaku-juken-bot/
├── package.json      ← コピペ
├── vercel.json       ← コピペ  
├── .env.example      ← コピペ
├── .gitignore        ← コピペ
└── README.md         ← コピペ
```

#### 2️⃣ apiフォルダを作成して中に配置
```
api/
├── webhook.js        ← メインLINE Bot実装（前回の scalable_line_bot）
└── video-database.js ← 動画データベース（前回の scalable_video_database）
```

#### 3️⃣ toolsフォルダを作成して中に配置
```
tools/
└── video-manager.js  ← 動画管理ツール（前回の video_management_tools）
```

#### 4️⃣ docsフォルダを作成
```
docs/
└── deployment-guide.md ← デプロイ手順書
```

---

## 🔧 Step 2: ファイル内容をコピペ

### 📋 コピペする順序

1. **package.json** ← 上記のpackage.jsonをコピー
2. **vercel.json** ← 上記のvercel.jsonをコピー
3. **.env.example** ← 上記の.env.exampleをコピー
4. **.gitignore** ← 上記の.gitignoreをコピー
5. **README.md** ← 上記のREADME.mdをコピー

### 📁 apiフォルダのファイル

**api/webhook.js** ← 「拡張可能なLINE Bot実装」の全コードをコピー

**api/video-database.js** ← 「拡張可能な動画データベース構造」の全コードをコピー

### 📁 toolsフォルダのファイル

**tools/video-manager.js** ← 「動画管理・追加ツール」の全コードをコピー

---

## 📦 Step 3: 依存関係のインストール

### Cursorのターミナルで実行
```bash
# 依存関係インストール
npm install

# 動作確認
npm test
```

---

## 🔗 Step 4: GitHubにプッシュ

### Cursor内でGit操作
```bash
# Git初期化
git init

# 全ファイル追加
git add .

# コミット
git commit -m "Initial commit: 中学受験相談LINE Bot"

# GitHubリポジトリ作成後
git remote add origin https://github.com/YOUR_USERNAME/chuugaku-juken-bot.git
git push -u origin main
```

---

## 🚀 Step 5: Vercelデプロイ

### A. Vercel Dashboard
1. [Vercel](https://vercel.com/) にアクセス
2. **「New Project」**をクリック
3. **GitHubリポジトリを選択**
4. **「Import」**をクリック

### B. 環境変数設定
デプロイ前に必ず設定：

```
Name: CHANNEL_ACCESS_TOKEN
Value: [LINE Developersで取得したトークン]

Name: CHANNEL_SECRET  
Value: [LINE Developersで取得したシークレット]

Name: ADMIN_KEY
Value: [任意の管理者キー、例: admin123]
```

### C. デプロイ実行
**「Deploy」**ボタンをクリック → 2-3分で完了

---

## ✅ Step 6: 動作確認

### A. ヘルスチェック
```
https://your-app.vercel.app/api/health
```
→ `{"status":"OK",...}` が表示されればOK

### B. 統計情報確認
```
https://your-app.vercel.app/api/stats
```
→ 動画データベースの情報が表示される

### C. データベース情報
```
https://your-app.vercel.app/api/database
```
→ 講師・カテゴリ情報が表示される

---

## 🎯 完了チェックリスト

- [ ] Cursorでプロジェクトフォルダ作成
- [ ] 全ファイル（8個）をコピペ
- [ ] `npm install` 成功
- [ ] GitHubにプッシュ完了
- [ ] Vercelデプロイ成功
- [ ] 環境変数設定完了
- [ ] ヘルスチェックが通る
- [ ] 統計APIが動作する

**全て ✅ になったら、LINE設定に進めます！**

---

## 🚨 よくある問題と解決

### ❌ npm installでエラー
```bash
# Node.jsバージョン確認
node --version  # v18以上必要

# キャッシュクリア
npm cache clean --force
npm install
```

### ❌ Vercelデプロイでエラー
- **Build失敗**: `package.json`の記述確認
- **Function timeout**: `vercel.json`の`maxDuration`確認
- **Environment変数**: LINE設定値の確認

### ❌ APIが404エラー
- **ルーティング**: `vercel.json`の`routes`設定確認
- **ファイル配置**: `api/webhook.js`が正しい場所にあるか確認

---

## 📞 サポート

何か問題があれば、以下の情報と一緒に質問してください：

1. **エラーメッセージ**の全文
2. **実行したコマンド**
3. **どのステップ**で問題発生
4. **ブラウザ・OS情報**

**すぐに解決方法をお答えします！🚀**