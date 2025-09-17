# 🌸 中学受験相談LINE Bot

西村創先生と佐藤ママの実践的アドバイス動画を提供するLINE Botです。

## ✨ 特徴

- 🎯 **西村創先生**（12万人登録YouTuber）の受験指導動画
- 👩‍🏫 **佐藤ママ**の実体験ベース家庭学習アドバイス
- 🤖 相談内容に応じた**自動動画推薦**
- 📱 LINE上での**簡単相談**
- 🔧 **拡張可能**な動画データベース

## 📊 対応している相談内容

- ✅ やる気・モチベーション向上
- ✅ スケジュール・時間管理  
- ✅ 暗記法・学習方法
- ✅ 塾選び・志望校選択
- ✅ ママ友関係・保護者の悩み
- ✅ 教科別学習法（算数・国語・理科・社会）

## 🎬 収録動画（30本以上）

### 佐藤ママ（確認済みURL）
- [ママ友との付き合い方](https://youtu.be/SeZ_7l43hms)
- [スケジュール管理のコツ](https://youtu.be/77_yj-Y1HWw)
- [夏休みの過ごし方](https://youtu.be/0_WV88nNahA)
- [暗記力強化法](https://youtu.be/1l_-eRLfCsw)
- [テレビとの向き合い方](https://youtu.be/F4O1xulHwww)

### 西村創先生
- [チャンネル](https://youtube.com/@nishimurasensei)（登録者12万人）
- 受験戦略、塾選び、やる気向上など200本以上

## 🚀 デプロイ手順

### 1. プロジェクト準備
```bash
# フォルダ作成
mkdir chuugaku-juken-bot
cd chuugaku-juken-bot

# ファイルを配置（下記参照）
```

### 2. LINE設定
1. [LINE Developers](https://developers.line.biz/) でチャンネル作成
2. `Channel Access Token` と `Channel Secret` を取得

### 3. Vercelデプロイ
```bash
# GitHubにpush
git init
git add .
git commit -m "Initial commit"
git push origin main

# Vercelで import
# 環境変数設定:
# - CHANNEL_ACCESS_TOKEN
# - CHANNEL_SECRET
```

### 4. LINE Webhook設定
1. Webhook URL: `https://your-app.vercel.app/api/webhook`
2. 「Use webhook」ON
3. 「Auto-reply messages」OFF

## 📱 使用方法

1. LINE Botを友だち追加
2. 「やる気が出ません」と送信
3. 関連動画が自動表示
4. 動画を見て実践！

## 🛠️ 開発者向け

### ローカル開発
```bash
npm install
cp .env.example .env
# .env に実際の値を設定
npm run dev
```

### 新しい動画追加
```bash
# 動画管理ツール実行
npm test
```

### API エンドポイント
- `POST /api/webhook` - LINE Bot Webhook
- `GET /api/health` - ヘルスチェック
- `GET /api/stats` - 統計情報
- `POST /api/admin/video` - 動画追加（要ADMIN_KEY）

## 💰 コスト

- **完全無料** で運用可能
- Vercel: 月10万リクエストまで無料
- LINE API: 月1000メッセージまで無料

## 🔧 技術スタック

- **Backend**: Node.js + Express
- **API**: LINE Messaging API
- **Deploy**: Vercel (サーバーレス)
- **Database**: メモリ内（将来的にDB拡張可能）

## 📈 統計

- 総動画数: 30本以上
- 対応講師: 2名（拡張予定）
- カテゴリ: 8種類
- 応答パターン: 動的生成

## 🤝 貢献

新しい講師・動画の追加は `tools/video-manager.js` を使用してください。

## 📄 ライセンス

MIT License

---

**お子さまの中学受験を応援します！📚✨**