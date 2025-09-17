# Google Sheets 連携設定ガイド

## 1. Google Cloud Console 設定

### 手順
1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成（例：`chuujubot-sheets`）
3. **「APIとサービス」** → **「ライブラリ」**
4. **「Google Sheets API」** を検索して有効化
5. **「認証情報」** → **「認証情報を作成」** → **「サービスアカウント」**
6. サービスアカウント名を入力（例：`chuujubot-service`）
7. **「作成して続行」** → **「完了」**
8. 作成されたサービスアカウントをクリック
9. **「キー」** タブ → **「鍵を追加」** → **「新しい鍵を作成」**
10. **「JSON」** を選択してダウンロード

## 2. スプレッドシートの作成

### スプレッドシート作成
1. [Google Sheets](https://sheets.google.com/) で新しいスプレッドシートを作成
2. スプレッドシート名：`中学受験Bot動画データベース`
3. スプレッドシートIDをコピー（URLの `/d/` と `/edit` の間）

### シート構成

#### Videos シート（動画データ）
| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| id | title | educator | url | duration | category | subcategory | tags | target_audience | grade | difficulty | description | summary | uploadDate | verified | score |

**ヘッダー行（1行目）:**
```
id,title,educator,url,duration,category,subcategory,tags,target_audience,grade,difficulty,description,summary,uploadDate,verified,score
```

**サンプルデータ（2行目）:**
```
sato_001,ママ友との付き合い方,佐藤亮子,https://youtu.be/SeZ_7l43hms,15:00,保護者サポート,人間関係,ママ友 人間関係 メンタル,保護者,全学年,実践的,中学受験することで周囲から詮索・噂される時の心の持ち方,ママ友関係で悩む保護者向けの実践的アドバイス。周囲の目を気にせず、お子さんの成長を第一に考える重要性を解説,2024-04-10,TRUE,45
```

#### Educators シート（講師データ）
| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| id | displayName | description | channelUrl | specialties | targetAudience | verified | priority |

**ヘッダー行（1行目）:**
```
id,displayName,description,channelUrl,specialties,targetAudience,verified,priority
```

## 3. 権限設定

### サービスアカウントに編集権限を付与
1. スプレッドシートを開く
2. **「共有」** ボタンをクリック
3. サービスアカウントのメールアドレスを追加
   - 例：`chuujubot-service@chuujubot-sheets.iam.gserviceaccount.com`
4. 権限：**「編集者」**
5. **「送信」** をクリック

## 4. Vercel環境変数の設定

### 設定手順
1. [Vercel Dashboard](https://vercel.com/takahiro-kubos-projects-a7ef19ed) にアクセス
2. `chuujunomikata` プロジェクトを選択
3. **「Settings」** → **「Environment Variables」**
4. 以下の環境変数を追加：

| Name | Value |
|------|-------|
| `GOOGLE_CLIENT_EMAIL` | サービスアカウントのclient_email |
| `GOOGLE_PRIVATE_KEY` | サービスアカウントのprivate_key（改行を\nに変換） |
| `SHEETS_SPREADSHEET_ID` | スプレッドシートのID |
| `SHEETS_RANGE` | Videos!A2:O |

### 既存の環境変数
```
CHANNEL_ACCESS_TOKEN=78Dxv9hMeQypT/fkY0/XKRk6nXGwRj1oAD0xfbYW+emy8L2RSKHOaQKO58NDmLCeFxXItjvhbq3REhp9sU6IBEbEwCLS1KGQUfoqDqGX1Rygxry/cEdWv3v8Q8SUP7pCk5QXx7Nm00sbBm52GDso+wdB04t89/1O/w1cDnyilFU=
CHANNEL_SECRET=899d5abbea0ef375f9a38a3b10a80a01
ADMIN_KEY=admin123
NODE_ENV=production
MAX_VIDEOS_PER_RESPONSE=8
CACHE_DURATION=300
ENABLE_ANALYTICS=false
ANTHROPIC_API_KEY=sk-ant-api03-...
GOOGLE_CLIENT_EMAIL=chuujubot-service@chuujubot-sheets.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n
SHEETS_SPREADSHEET_ID=1ABC123DEF456GHI789JKL012MNO345PQR678STU
SHEETS_RANGE=Videos!A2:O
```

## 5. 動作確認

### 接続テスト
```
GET https://chuujunomikata.vercel.app/api/admin/sheets/test
```

### データリロード
```
POST https://chuujunomikata.vercel.app/api/admin/sheets/reload
Content-Type: application/json

{
  "adminKey": "admin123"
}
```

### 動画追加
```
POST https://chuujunomikata.vercel.app/api/admin/sheets/video
Content-Type: application/json

{
  "adminKey": "admin123",
  "videoData": {
    "id": "test_001",
    "title": "テスト動画",
    "educator": "佐藤亮子",
    "url": "https://youtu.be/test",
    "duration": "10:00",
    "category": "保護者サポート",
    "subcategory": "テスト",
    "tags": ["テスト", "動画"],
    "target_audience": ["保護者"],
    "grade": ["全学年"],
    "difficulty": "基礎",
    "description": "テスト用の動画です",
    "summary": "テスト用動画の簡単なまとめ",
    "verified": true,
    "score": 30
  }
}
```

## 6. 動画の簡単なまとめについて

### まとめフィールドの活用
- **summary** フィールドに動画の要点を事前に記入
- AI回答生成時のトークン消費を削減
- より正確で一貫した回答を提供

### まとめの書き方例
```
「やる気向上の具体的な方法を3つのポイントで解説。小さな成功体験の積み重ね、適切な声かけのタイミング、環境作りの重要性について実体験を交えて説明」
```

## 7. メリット

### 管理面
- **簡単な動画追加**: スプレッドシートで直感的に管理
- **リアルタイム更新**: 変更が即座に反映
- **複数人での編集**: チームで動画データを管理

### コスト面
- **トークン消費削減**: 事前にまとめを用意
- **API呼び出し削減**: スプレッドシートから直接読み込み
- **無料枠内で運用**: Google Sheets APIは無料枠が充実

---

## 完了！

スプレッドシート連携により、動画データの管理が格段に簡単になります！
