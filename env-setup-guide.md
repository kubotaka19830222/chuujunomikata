# 環境変数設定ガイド

## 必要な環境変数

以下の環境変数を設定してください：

### 1. LINE Bot設定
```bash
CHANNEL_ACCESS_TOKEN=your_channel_access_token
CHANNEL_SECRET=your_channel_secret
```

### 2. Google Sheets API設定
```bash
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
SHEETS_SPREADSHEET_ID=your_spreadsheet_id
SHEETS_RANGE=Videos!A2:O
```

### 3. 管理者設定
```bash
ADMIN_KEY=your_admin_key
```

### 4. パフォーマンス設定（オプション）
```bash
MAX_VIDEOS_PER_RESPONSE=8
CACHE_DURATION=300
ENABLE_ANALYTICS=false
```

## 設定方法

### Windows (PowerShell)
```powershell
$env:CHANNEL_ACCESS_TOKEN="your_token"
$env:CHANNEL_SECRET="your_secret"
$env:GOOGLE_CLIENT_EMAIL="your_email"
$env:GOOGLE_PRIVATE_KEY="your_key"
$env:SHEETS_SPREADSHEET_ID="your_sheet_id"
$env:ADMIN_KEY="your_admin_key"
```

### Windows (Command Prompt)
```cmd
set CHANNEL_ACCESS_TOKEN=your_token
set CHANNEL_SECRET=your_secret
set GOOGLE_CLIENT_EMAIL=your_email
set GOOGLE_PRIVATE_KEY=your_key
set SHEETS_SPREADSHEET_ID=your_sheet_id
set ADMIN_KEY=your_admin_key
```

### Linux/Mac
```bash
export CHANNEL_ACCESS_TOKEN="your_token"
export CHANNEL_SECRET="your_secret"
export GOOGLE_CLIENT_EMAIL="your_email"
export GOOGLE_PRIVATE_KEY="your_key"
export SHEETS_SPREADSHEET_ID="your_sheet_id"
export ADMIN_KEY="your_admin_key"
```

## テスト方法

環境変数設定後、以下のコマンドでテスト：

```bash
# スプレッドシート接続テスト
curl -X GET "http://localhost:3000/api/admin/sheets/test"

# リロードテスト
curl -X POST "http://localhost:3000/api/admin/sheets/reload" \
  -H "Content-Type: application/json" \
  -d '{"adminKey": "your_admin_key"}'

# 動画アップロードテスト
curl -X POST "http://localhost:3000/api/admin/sheets/video" \
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

## トラブルシューティング

### 1. スプレッドシート接続エラー
- Google Sheets APIが有効になっているか確認
- サービスアカウントの認証情報が正しいか確認
- スプレッドシートIDが正しいか確認

### 2. 認証エラー
- 環境変数が正しく設定されているか確認
- 管理者キーが正しいか確認

### 3. データ読み込みエラー
- スプレッドシートの範囲が正しいか確認
- データの形式が正しいか確認
