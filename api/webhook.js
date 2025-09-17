// 拡張可能な中学受験相談LINE Bot実装
const express = require('express');
const line = require('@line/bot-sdk');
const { videoDatabase, VideoManager, findRelevantVideos } = require('./video-database');

const app = express();

// 設定（コスト最適化）
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// パフォーマンス設定
const PERFORMANCE_CONFIG = {
  maxVideosPerResponse: parseInt(process.env.MAX_VIDEOS_PER_RESPONSE) || 8,
  cacheDuration: parseInt(process.env.CACHE_DURATION) || 300,
  enableAnalytics: process.env.ENABLE_ANALYTICS === 'true',
  maxDuration: 10 // Vercel無料プラン対応
};

const client = new line.Client(config);

// ユーザー状態管理
const userStates = new Map();

// 動的応答パターン（データベースから自動生成）
function generateResponsePatterns() {
  const patterns = {};
  
  // カテゴリベースのパターン生成
  Object.entries(videoDatabase.categories).forEach(([categoryId, categoryInfo]) => {
    const categoryVideos = VideoManager.getVideosByCategory(categoryId);
    if (categoryVideos.length > 0) {
      patterns[categoryId] = {
        keywords: [
          categoryId,
          categoryInfo.displayName,
          ...categoryInfo.subcategories,
          ...categoryVideos.flatMap(v => v.tags).slice(0, 10) // 上位10タグ
        ],
        response: `${categoryInfo.icon} ${categoryInfo.displayName}のお悩みですね\n\n${categoryInfo.description}\n\n専門家のアドバイス動画をご紹介します👇`,
        category: categoryId
      };
    }
  });

  // 講師ベースのパターン生成
  Object.entries(videoDatabase.educators).forEach(([educatorId, educatorInfo]) => {
    const educatorVideos = VideoManager.getVideosByEducator(educatorId);
    if (educatorVideos.length > 0) {
      patterns[`educator_${educatorId}`] = {
        keywords: [educatorId, educatorInfo.displayName, ...educatorInfo.specialties],
        response: `${educatorInfo.displayName}の動画をお探しですね✨\n\n${educatorInfo.description}\n\n${educatorInfo.displayName}のおすすめ動画をご紹介します👇`,
        educatorFilter: educatorId
      };
    }
  });

  return patterns;
}

// 固定応答パターン（頻出キーワード用）
const fixedPatterns = {
  "やる気": {
    keywords: ["やる気", "モチベーション", "勉強しない", "集中しない", "やりたがらない"],
    response: `😊 やる気アップでお悩みですね\n\n✨ やる気向上のポイント\n1️⃣ 小さな成功体験を積む\n2️⃣ 適切な声かけを心がける\n3️⃣ 子どもの気持ちに寄り添う\n4️⃣ メリハリのある環境作り\n\n専門家の具体的なアドバイスをご覧ください👇`,
    searchOptions: { categoryFilter: "保護者サポート" }
  },
  
  "感謝": {
    keywords: ["ありがと", "感謝", "助かり", "参考になった", "よかった"],
    response: `お役に立てて嬉しいです😊\n\n中学受験は大変な道のりですが、お子さまの成長にとって貴重な経験です。\n\n専門家のアドバイスが少しでもお力になれれば幸いです。\n\nまた何かございましたら、いつでもお気軽にご相談ください🌸`,
    showQuickReply: true
  },

  "挨拶": {
    keywords: ["こんにちは", "はじめまして", "よろしく", "おはよう", "こんばんは"],
    response: `こんにちは！中学受験相談AIです🌸\n\n${Object.keys(videoDatabase.educators).length}名の専門家による実践的なアドバイス動画をご紹介します。\n\nどんなお悩みでもお気軽にご相談ください✨`,
    showQuickReply: true
  }
};

// メイン処理
app.post('/api/webhook', line.middleware(config), async (req, res) => {
  try {
    const events = req.body.events;
    
    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const reply = await handleMessage(event.message.text, event.source.userId);
        await client.replyMessage(event.replyToken, reply);
      } else if (event.type === 'follow') {
        // 友だち追加時
        const reply = createWelcomeMessage();
        await client.replyMessage(event.replyToken, reply);
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 歓迎メッセージ
function createWelcomeMessage() {
  const verifiedEducators = Object.entries(videoDatabase.educators)
    .filter(([_, info]) => info.verified)
    .sort((a, b) => a[1].priority - b[1].priority);

  const educatorList = verifiedEducators
    .map(([_, info]) => `• ${info.displayName}`)
    .join('\n');

  return [{
    type: 'text',
    text: `🌸 中学受験相談AIへようこそ！\n\n【対応講師】\n${educatorList}\n\n【よくあるご相談】\n📚 学習方法・暗記法\n📅 スケジュール管理\n🎯 志望校・塾選び\n😊 やる気・モチベーション\n👨‍👩‍👧‍👦 保護者のお悩み\n\nお気軽にご相談ください✨`,
    quickReply: {
      items: createMainQuickReply()
    }
  }];
}

// メッセージ処理
async function handleMessage(text, userId) {
  // ユーザー状態管理
  let userState = userStates.get(userId) || {
    consultationHistory: [],
    preferences: {}
  };

  const messages = [];

  // 1. 固定パターンのマッチング
  const fixedMatch = findFixedPattern(text);
  if (fixedMatch) {
    messages.push({
      type: 'text',
      text: fixedMatch.response,
      quickReply: fixedMatch.showQuickReply ? { items: createMainQuickReply() } : undefined
    });

    if (fixedMatch.keywords.includes("ありがと") || fixedMatch.keywords.includes("感謝")) {
      userStates.set(userId, userState);
      return messages;
    }
  }

  // 2. 動的パターン生成・マッチング
  const dynamicPatterns = generateResponsePatterns();
  const dynamicMatch = findDynamicPattern(text, dynamicPatterns);

  // 3. 動画検索オプション設定（コスト最適化）
  const searchOptions = {
    maxResults: PERFORMANCE_CONFIG.maxVideosPerResponse,
    onlyVerified: true,
    ...((fixedMatch && fixedMatch.searchOptions) || {}),
    ...((dynamicMatch && dynamicMatch.educatorFilter) ? { educatorPreference: dynamicMatch.educatorFilter } : {}),
    ...((dynamicMatch && dynamicMatch.category) ? { categoryFilter: dynamicMatch.category } : {})
  };

  // 4. 関連動画検索
  const relevantVideos = findRelevantVideos(text, searchOptions);

  // 5. 動的パターンの応答追加
  if (dynamicMatch && !fixedMatch) {
    messages.push({
      type: 'text',
      text: dynamicMatch.response
    });
  }

  // 6. 基本応答（パターンにマッチしない場合）
  if (!fixedMatch && !dynamicMatch) {
    messages.push({
      type: 'text',
      text: `中学受験のお悩み、お聞かせいただきありがとうございます😊\n\nお子さまの状況に合わせて、専門家の実践的なアドバイス動画をご紹介しますね✨`
    });
  }

  // 7. 動画推薦
  if (relevantVideos.length > 0) {
    const videoMessage = createAdvancedVideoCarousel(relevantVideos);
    messages.push(videoMessage);

    // 追加情報メッセージ
    const educatorsInResults = [...new Set(relevantVideos.map(v => v.educator))];
    if (educatorsInResults.length > 1) {
      const educatorNames = educatorsInResults
        .map(e => videoDatabase.educators[e]?.displayName || e)
        .join('、');
      messages.push({
        type: 'text',
        text: `今回は ${educatorNames} の動画をご紹介しました👆\n\n他の講師の動画もご覧になりたい場合は、講師名でお聞かせください😊`
      });
    }
  } else {
    // 動画が見つからない場合の対応
    const availableCategories = Object.entries(videoDatabase.categories)
      .filter(([catId, _]) => VideoManager.getVideosByCategory(catId).length > 0)
      .slice(0, 4)
      .map(([_, catInfo]) => catInfo.displayName);

    messages.push({
      type: 'text',
      text: `申し訳ございません。お悩みに合った動画が見つかりませんでした😅\n\n以下のような内容でしたらお手伝いできます：\n${availableCategories.map(cat => `• ${cat}`).join('\n')}\n\n具体的なお悩みをお聞かせください✨`
    });
  }

  // 8. クイックリプライの提案
  messages.push({
    type: 'text',
    text: '他にもご相談がございましたら、お気軽にお聞かせください😊',
    quickReply: {
      items: createContextualQuickReply(relevantVideos, text)
    }
  });

  // 9. 相談履歴保存
  const educatorsInResults = [...new Set(relevantVideos.map(v => v.educator))];
  userState.consultationHistory.push({
    question: text,
    timestamp: new Date(),
    matchedPattern: (fixedMatch || dynamicMatch)?.keywords || [],
    recommendedVideos: relevantVideos.length,
    educators: educatorsInResults
  });
  userStates.set(userId, userState);

  return messages;
}

// パターンマッチング関数
function findFixedPattern(text) {
  for (const [key, pattern] of Object.entries(fixedPatterns)) {
    if (pattern.keywords.some(keyword => text.includes(keyword))) {
      return pattern;
    }
  }
  return null;
}

function findDynamicPattern(text, dynamicPatterns) {
  for (const [key, pattern] of Object.entries(dynamicPatterns)) {
    if (pattern.keywords.some(keyword => text.includes(keyword))) {
      return pattern;
    }
  }
  return null;
}

// 高度な動画カルーセル作成（コスト最適化）
function createAdvancedVideoCarousel(videos) {
  const columns = videos.slice(0, PERFORMANCE_CONFIG.maxVideosPerResponse).map(video => {
    const educator = videoDatabase.educators[video.educator];
    const videoId = extractVideoId(video.url);
    const thumbnailUrl = videoId ? 
      `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : 
      'https://via.placeholder.com/320x180?text=Video';

    // カテゴリアイコン取得
    const categoryIcon = videoDatabase.categories[video.category]?.icon || '📹';

    return {
      thumbnailImageUrl: thumbnailUrl,
      title: truncateText(video.title, 40),
      text: `${categoryIcon} ${video.category}\n👨‍🏫 ${educator?.displayName || video.educator}\n${truncateText(video.description, 45)}`,
      actions: [
        {
          type: 'uri',
          label: '📺 動画を見る',
          uri: video.url
        }
      ]
    };
  });

  return {
    type: 'template',
    altText: `おすすめ動画 ${videos.length}本`,
    template: {
      type: 'carousel',
      columns: columns
    }
  };
}

// コンテキストに応じたクイックリプライ
function createContextualQuickReply(recommendedVideos, originalText) {
  const items = [];

  // 基本アクション
  items.push(
    { type: 'action', action: { type: 'message', label: '別の相談', text: '他の悩みがあります' } }
  );

  // おすすめされた動画の講師をベースに追加提案
  if (recommendedVideos.length > 0) {
    const mainEducator = recommendedVideos[0].educator;
    const educatorInfo = videoDatabase.educators[mainEducator];
    
    if (educatorInfo) {
      items.push({
        type: 'action',
        action: {
          type: 'message',
          label: `${educatorInfo.displayName}他の動画`,
          text: `${educatorInfo.displayName}の他の動画を見たい`
        }
      });
    }
  }

  // カテゴリベースの提案
  const availableCategories = Object.entries(videoDatabase.categories)
    .filter(([catId, _]) => VideoManager.getVerifiedVideos().some(v => v.category === catId))
    .slice(0, 2);

  availableCategories.forEach(([catId, catInfo]) => {
    if (!originalText.includes(catId) && !originalText.includes(catInfo.displayName)) {
      items.push({
        type: 'action',
        action: {
          type: 'message',
          label: catInfo.displayName,
          text: `${catInfo.displayName}について教えて`
        }
      });
    }
  });

  // 最大4つまで
  return items.slice(0, 4);
}

// メインクイックリプライ
function createMainQuickReply() {
  const topCategories = Object.entries(videoDatabase.categories)
    .filter(([catId, _]) => VideoManager.getVerifiedVideos().some(v => v.category === catId))
    .sort((a, b) => {
      const aCount = VideoManager.getVideosByCategory(a[0]).length;
      const bCount = VideoManager.getVideosByCategory(b[0]).length;
      return bCount - aCount;
    })
    .slice(0, 4);

  return topCategories.map(([catId, catInfo]) => ({
    type: 'action',
    action: {
      type: 'message',
      label: catInfo.displayName,
      text: `${catInfo.displayName}について相談したい`
    }
  }));
}

// YouTube動画ID抽出（改良版）
function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    /(?:youtu\.be\/)([^&\n?#]+)/,
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
    /(?:youtube\.com\/v\/)([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

// テキスト切り取り
function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// 管理者向けAPI：新しい動画を追加
app.post('/api/admin/video', async (req, res) => {
  try {
    const { adminKey, videoData } = req.body;
    
    // 簡単な認証（本番ではより強固な認証を使用）
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const videoId = VideoManager.addVideo(videoData);
    res.json({ success: true, videoId, message: 'Video added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 管理者向けAPI：新しい講師を追加
app.post('/api/admin/educator', async (req, res) => {
  try {
    const { adminKey, educatorId, educatorData } = req.body;
    
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    VideoManager.addEducator(educatorId, educatorData);
    res.json({ success: true, educatorId, message: 'Educator added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 公開API：動画データベース情報
app.get('/api/database', (req, res) => {
  const stats = VideoManager.getStats();
  const categories = Object.entries(videoDatabase.categories).map(([id, info]) => ({
    id,
    displayName: info.displayName,
    description: info.description,
    icon: info.icon,
    videoCount: stats.byCategory[id] || 0
  }));

  const educators = Object.entries(videoDatabase.educators).map(([id, info]) => ({
    id,
    displayName: info.displayName,
    description: info.description,
    verified: info.verified,
    priority: info.priority,
    videoCount: stats.byEducator[id] || 0
  }));

  res.json({
    stats,
    categories,
    educators,
    lastUpdated: new Date().toISOString()
  });
});

// 統計情報API（拡張版）
app.get('/api/stats', (req, res) => {
  const dbStats = VideoManager.getStats();
  const userStats = {
    activeUsers: userStates.size,
    totalConsultations: Array.from(userStates.values())
      .reduce((sum, state) => sum + (state.consultationHistory?.length || 0), 0),
    consultationsToday: Array.from(userStates.values())
      .reduce((sum, state) => {
        const today = new Date().toDateString();
        const todayConsultations = (state.consultationHistory || [])
          .filter(h => new Date(h.timestamp).toDateString() === today);
        return sum + todayConsultations.length;
      }, 0)
  };

  res.json({
    database: dbStats,
    users: userStats,
    system: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    }
  });
});

// ヘルスチェック（詳細版）
app.get('/api/health', (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      database: VideoManager.getStats().totalVideos > 0 ? 'healthy' : 'warning',
      lineBot: process.env.CHANNEL_ACCESS_TOKEN ? 'healthy' : 'error',
      memory: process.memoryUsage().heapUsed / 1024 / 1024 < 100 ? 'healthy' : 'warning'
    }
  };

  const hasError = Object.values(health.services).includes('error');
  const statusCode = hasError ? 503 : 200;
  
  res.status(statusCode).json(health);
});

// エラーハンドリング
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// サーバー起動
const port = process.env.PORT || 3000;
app.listen(port, () => {
  const stats = VideoManager.getStats();
  console.log(`🚀 拡張可能中学受験相談Bot started on port ${port}`);
  console.log(`📺 動画データベース: ${stats.totalVideos}本 (verified: ${stats.verifiedVideos}本)`);
  console.log(`👨‍🏫 登録講師: ${stats.totalEducators}名 (verified: ${stats.verifiedEducators}名)`);
  console.log(`📂 カテゴリ: ${Object.keys(videoDatabase.categories).length}種類`);
  console.log(`📱 LINE Bot API ready!`);
  
  // 起動時の動画データベース検証
  if (stats.verifiedVideos < 5) {
    console.warn('⚠️  Warning: 検証済み動画が5本未満です');
  }
});

module.exports = app;