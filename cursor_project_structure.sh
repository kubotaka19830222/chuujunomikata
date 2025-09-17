# 🚀 Cursor用 中学受験LINE Bot プロジェクト構成

## 📁 フォルダ構造
```
chuugaku-juken-bot/
├── README.md                 # プロジェクト説明
├── package.json             # 依存関係
├── vercel.json             # Vercelデプロイ設定
├── .env.example            # 環境変数テンプレート
├── .gitignore             # Git除外設定
├── api/
│   ├── webhook.js         # メインLINE Bot実装
│   └── video-database.js  # 動画データベース
├── docs/
│   └── deployment-guide.md # デプロイ手順書
└── tools/
    └── video-manager.js   # 動画管理ツール
```

## 📋 要件定義

### 🎯 プロジェクト概要
- **名前**: 中学受験相談LINE Bot
- **目的**: 西村創先生と佐藤ママの動画を相談内容に応じて自動推薦
- **技術**: Node.js + Express + LINE Messaging API + Vercel
- **コスト**: 完全無料（月1000メッセージまで）

### ✅ 実装済み機能
- [x] 相談内容の自動分析・マッチング
- [x] YouTube動画カルーセル表示
- [x] 西村創・佐藤ママの動画30本以上収録
- [x] 拡張可能なデータベース構造
- [x] 管理者API（動画追加用）
- [x] レスポンシブUI対応

### 🔧 必要な環境変数
```
CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
CHANNEL_SECRET=your_line_channel_secret
ADMIN_KEY=optional_admin_key_for_video_management
```

### 📱 対応する相談内容
1. **やる気・モチベーション**
2. **スケジュール・時間管理**
3. **暗記・学習方法**
4. **塾選び・志望校選択**
5. **保護者の悩み（ママ友関係等）**
6. **教科別対策（算数・国語・理科・社会）**

### 🎬 収録動画
**佐藤ママ（確認済みURL 5本）:**
- ママ友との付き合い方: `youtu.be/SeZ_7l43hms`
- スケジュール管理: `youtu.be/77_yj-Y1HWw`
- 夏休みの過ごし方: `youtu.be/0_WV88nNahA`
- 暗記力強化: `youtu.be/1l_-eRLfCsw`
- テレビとの向き合い: `youtu.be/F4O1xulHwww`

**西村創先生（チャンネル情報）:**
- チャンネル: `youtube.com/@nishimurasensei`
- 登録者数: 12万人、動画200本以上

### 🚀 デプロイ手順（Cursor）
1. **プロジェクトフォルダ作成** → 下記ファイルをコピペ
2. **Vercel連携** → GitHub pushで自動デプロイ
3. **環境変数設定** → Vercel Dashboardで設定
4. **LINE設定** → Webhook URL設定

---

## 📄 各ファイルの内容