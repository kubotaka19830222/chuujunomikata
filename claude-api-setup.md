# Claude API 設定ガイド

## 1. Anthropic API キーの取得

### 手順
1. [Anthropic Console](https://console.anthropic.com/) にアクセス
2. アカウントを作成（無料）
3. **「API Keys」** セクションに移動
4. **「Create Key」** をクリック
5. キー名を入力（例：`chuujubot-production`）
6. **「Create Key」** をクリック
7. 生成されたAPIキーをコピー（一度しか表示されません）

## 2. Vercel環境変数の設定

### 設定手順
1. [Vercel Dashboard](https://vercel.com/takahiro-kubos-projects-a7ef19ed) にアクセス
2. `chuujunomikata` プロジェクトを選択
3. **「Settings」** → **「Environment Variables」**
4. 以下の環境変数を追加：

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | 取得したAPIキー |

### 既存の環境変数
```
CHANNEL_ACCESS_TOKEN=78Dxv9hMeQypT/fkY0/XKRk6nXGwRj1oAD0xfbYW+emy8L2RSKHOaQKO58NDmLCeFxXItjvhbq3REhp9sU6IBEbEwCLS1KGQUfoqDqGX1Rygxry/cEdWv3v8Q8SUP7pCk5QXx7Nm00sbBm52GDso+wdB04t89/1O/w1cDnyilFU=
CHANNEL_SECRET=899d5abbea0ef375f9a38a3b10a80a01
ADMIN_KEY=admin123
NODE_ENV=production
MAX_VIDEOS_PER_RESPONSE=8
CACHE_DURATION=300
ENABLE_ANALYTICS=false
ANTHROPIC_API_KEY=sk-ant-api03-...（新規追加）
```

## 3. デプロイ

環境変数設定後、自動的に再デプロイが実行されます。

## 4. 動作確認

### テストメッセージ例
- 「こんにちは」
- 「やる気が出ません」
- 「西村先生の算数について教えて」
- 「佐藤ママのスケジュール管理のコツは？」

### 期待される動作
1. **固定パターン**にマッチする場合：従来通りの回答
2. **講師名**が含まれる場合：その講師の考え方で回答
3. **その他**の場合：AIが生成した自然な回答

## 5. コスト管理

### 無料枠
- **月5,000リクエスト**まで無料
- 1リクエスト = 1メッセージ

### 有料料金
- **$3/1M tokens**（約$0.003/1,000トークン）
- 月5,000リクエストを超える場合のみ課金

### 月間使用量の確認
1. [Anthropic Console](https://console.anthropic.com/) にログイン
2. **「Usage」** セクションで確認

## 6. トラブルシューティング

### よくある問題
- **401 Unauthorized**: APIキーが間違っている
- **429 Rate Limited**: リクエスト制限に達している
- **500 Internal Server Error**: Claude APIの一時的な問題

### ログ確認
Vercelダッシュボード → **「Functions」** → **「api/webhook」** でエラーログを確認

## 7. 機能のカスタマイズ

### 講師の知識ベースを編集
`api/ai-responder.js` の `educatorKnowledge` オブジェクトを編集

### 回答の長さを調整
`max_tokens` パラメータを変更（現在：500）

### 回答の温度を調整
`temperature` パラメータを変更（現在：0.7）

---

## 完了！

Claude APIの設定が完了すると、LINE Botが自然な会話で回答するようになります！
