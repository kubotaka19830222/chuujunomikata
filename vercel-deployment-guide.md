# 🚀 Vercel デプロイガイド（コスト最適化版）

## 💰 コスト最適化設定

### Vercel無料プラン制限
- **月10万リクエスト**まで無料
- **100GB帯域幅**まで無料
- **サーバーレス関数実行時間**: 10秒まで
- **メモリ**: 1024MBまで

### 最適化ポイント
✅ **タイムアウト**: 10秒に設定（無料プラン対応）
✅ **メモリ**: 1024MBに設定（最小限）
✅ **動画表示数**: 最大8本に制限
✅ **リージョン**: 東京（nrt1）でレイテンシ最適化
✅ **キャッシュ**: 300秒でレスポンス高速化

## 🔧 環境変数設定

Vercelダッシュボードで以下の環境変数を設定してください：

### 必須設定
```
CHANNEL_ACCESS_TOKEN=your_line_channel_access_token_here
CHANNEL_SECRET=your_line_channel_secret_here
```

### 推奨設定（コスト最適化）
```
NODE_ENV=production
MAX_VIDEOS_PER_RESPONSE=8
CACHE_DURATION=300
ENABLE_ANALYTICS=false
ADMIN_KEY=admin123
```

## 📋 デプロイ手順

### 1. GitHubリポジトリ準備
```bash
# プロジェクトをGitHubにプッシュ
git init
git add .
git commit -m "Initial commit: 中学受験相談LINE Bot"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/chuugaku-juken-bot.git
git push -u origin main
```

### 2. Vercelデプロイ
1. [Vercel](https://vercel.com/) にアクセス
2. **「New Project」**をクリック
3. **GitHubリポジトリを選択**
4. **「Import」**をクリック

### 3. 環境変数設定
Vercelダッシュボードの「Settings」→「Environment Variables」で設定

### 4. デプロイ実行
**「Deploy」**ボタンをクリック → 2-3分で完了

## ✅ 動作確認

### ヘルスチェック
```
https://your-app.vercel.app/api/health
```
→ `{"status":"OK",...}` が表示されればOK

### 統計情報確認
```
https://your-app.vercel.app/api/stats
```
→ 動画データベースの情報が表示される

## 📊 コスト監視

### 月間使用量確認方法
1. Vercelダッシュボード → **「Usage」**
2. **「Functions」**タブで実行時間確認
3. **「Bandwidth」**タブで帯域幅確認

### コスト削減のポイント
- 動画表示数を8本以下に制限
- キャッシュを有効活用
- 不要なAPI呼び出しを避ける
- 画像最適化（YouTubeサムネイル使用）

## 🚨 よくある問題と解決

### ❌ タイムアウトエラー
- **原因**: 処理時間が10秒を超過
- **解決**: `MAX_VIDEOS_PER_RESPONSE=6`に設定

### ❌ メモリ不足エラー
- **原因**: メモリ使用量が1024MBを超過
- **解決**: 動画データの絞り込みを強化

### ❌ 帯域幅超過
- **原因**: 画像や動画の転送量が多い
- **解決**: サムネイル画像の最適化

## 📈 スケーリング戦略

### 無料プラン内での最適化
1. **動画表示数制限**: 6-8本
2. **キャッシュ活用**: 300秒
3. **レスポンス最適化**: 不要な処理を削除

### 有料プラン移行の目安
- 月間リクエスト数が8万を超える場合
- 帯域幅が80GBを超える場合
- より多くの動画表示が必要な場合

## 🔍 監視とメンテナンス

### 日常的な確認項目
- [ ] ヘルスチェックAPIの応答
- [ ] 月間使用量の確認
- [ ] エラーログの確認
- [ ] 動画データベースの更新

### 月次メンテナンス
- [ ] 動画URLの有効性確認
- [ ] 統計データの分析
- [ ] パフォーマンス最適化
- [ ] 新規動画の追加

---

**💡 ヒント**: 最初は少ない動画数で始めて、徐々に拡張していくことをお勧めします！
