# Vercel環境変数設定ガイド

## 🚨 現在の問題
スプレッドシートの接続テストは成功したが、リロードテストと動画アップロードが進まない問題があります。

## 🔍 原因
Vercelで必要な環境変数が設定されていない可能性があります。

## ✅ 解決手順

### 1. Vercelダッシュボードにアクセス
1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. あなたのプロジェクトを選択

### 2. 環境変数を設定
**Settings** → **Environment Variables** で以下の変数を追加：

#### 必須の環境変数
```
CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
CHANNEL_SECRET=your_line_channel_secret
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n
SHEETS_SPREADSHEET_ID=your_spreadsheet_id
SHEETS_RANGE=Videos!A2:O
ADMIN_KEY=your_admin_key
```

#### 推奨の環境変数
```
NODE_ENV=production
MAX_VIDEOS_PER_RESPONSE=8
CACHE_DURATION=300
ENABLE_ANALYTICS=false
```

### 3. 環境変数の設定方法

#### Google Sheets API設定
1. **GOOGLE_CLIENT_EMAIL**: サービスアカウントのメールアドレス
2. **GOOGLE_PRIVATE_KEY**: サービスアカウントの秘密鍵（改行文字\nを含む）
3. **SHEETS_SPREADSHEET_ID**: スプレッドシートのID（URLから取得）

#### スプレッドシートIDの取得方法
```
https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
```
↑ の `[SPREADSHEET_ID]` の部分を使用

### 4. デプロイの再実行
環境変数設定後：
1. **Deployments** タブに移動
2. 最新のデプロイメントの **「Redeploy」** をクリック
3. または、GitHubにプッシュして自動デプロイ

### 5. 動作確認

#### スプレッドシート接続テスト
```
https://your-app.vercel.app/api/admin/sheets/test
```

#### リロードテスト
```bash
curl -X POST "https://your-app.vercel.app/api/admin/sheets/reload" \
  -H "Content-Type: application/json" \
  -d '{"adminKey": "your_admin_key"}'
```

#### 動画アップロードテスト
```bash
curl -X POST "https://your-app.vercel.app/api/admin/sheets/video" \
  -H "Content-Type: application/json" \
  -d '{
    "adminKey": "your_admin_key",
    "videoData": {
      "id": "test_001",
      "title": "テスト動画",
      "educator": "テスト講師",
      "url": "https://youtu.be/test",
      "category": "テスト",
      "tags": ["テスト"],
      "target_audience": ["保護者"],
      "grade": ["全学年"]
    }
  }'
```

## 🔧 トラブルシューティング

### 環境変数が反映されない場合
1. デプロイを再実行
2. 環境変数の値に改行文字（\n）が正しく含まれているか確認
3. スプレッドシートIDが正しいか確認

### スプレッドシート接続エラーの場合
1. Google Sheets APIが有効になっているか確認
2. サービスアカウントにスプレッドシートへのアクセス権限があるか確認
3. スプレッドシートの共有設定を確認

### 認証エラーの場合
1. ADMIN_KEYが正しく設定されているか確認
2. リクエストボディにadminKeyが含まれているか確認

## 📱 LINE Bot設定

### Webhook URL設定
```
https://your-app.vercel.app/api/webhook
```

### 環境変数確認
Vercelダッシュボードで以下が設定されているか確認：
- CHANNEL_ACCESS_TOKEN
- CHANNEL_SECRET

## 🎯 次のステップ

1. 環境変数を設定
2. デプロイを再実行
3. APIテストを実行
4. LINE Botで動作確認

---

**💡 ヒント**: 環境変数設定後は必ずデプロイを再実行してください！
