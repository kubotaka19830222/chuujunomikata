// 動画管理・追加のための便利ツール
const fs = require('fs');
const path = require('path');

// 新しい講師・動画を簡単に追加するためのヘルパー関数
class VideoManagementTool {
  constructor() {
    this.databasePath = path.join(__dirname, 'video-database.js');
  }

  // 新しい講師を追加（対話形式のヘルパー）
  createEducatorTemplate(educatorId) {
    return {
      educatorId: educatorId,
      template: {
        displayName: `${educatorId}先生`, // 例: "田中太郎先生"
        description: "講師の詳細説明をここに記入",
        channelUrl: `https://youtube.com/@${educatorId.toLowerCase()}`,
        specialties: ["専門分野1", "専門分野2", "専門分野3"],
        targetAudience: ["保護者", "受験生"], // または ["保護者"] のみ
        verified: false, // 最初はfalse、確認後にtrueに変更
        priority: 3 // 1=最高優先度、2=高優先度、3=標準
      }
    };
  }

  // 新しい動画を追加（テンプレート生成）
  createVideoTemplate(educatorId, videoTitle) {
    const videoId = this.generateVideoId(educatorId);
    
    return {
      id: videoId,
      title: videoTitle,
      educator: educatorId,
      url: "https://youtu.be/VIDEO_ID_HERE", // 実際のYouTube URLに置換
      duration: "00:00", // "15:30" 形式
      category: "選択してください", // videoDatabase.categories から選択
      subcategory: "選択してください", // 上記カテゴリのsubcategories から選択
      tags: ["タグ1", "タグ2", "タグ3", "タグ4", "タグ5"], // 関連キーワード
      target_audience: ["保護者"], // または ["受験生", "保護者"]
      grade: ["全学年"], // または ["小4", "小5", "小6"]
      difficulty: "基礎", // 基礎/標準/応用/実践的/重要/上級
      description: "動画の内容を簡潔に説明（50文字程度）",
      uploadDate: new Date().toISOString().split('T')[0], // 今日の日付
      verified: false, // 内容確認後にtrueに変更
      score: 35 // 30-50の範囲で設定
    };
  }

  // 動画ID自動生成
  generateVideoId(educatorId) {
    const prefix = educatorId.substring(0, 5).toLowerCase();
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}_${timestamp}`;
  }

  // バッチで複数の講師を追加
  addMultipleEducators(educatorList) {
    const templates = {};
    
    educatorList.forEach(educator => {
      if (typeof educator === 'string') {
        templates[educator] = this.createEducatorTemplate(educator);
      } else {
        templates[educator.id] = {
          educatorId: educator.id,
          template: {
            ...this.createEducatorTemplate(educator.id).template,
            ...educator
          }
        };
      }
    });

    return templates;
  }

  // YouTube URLからvideoIDを抽出
  extractVideoId(url) {
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

  // 動画URLの検証
  validateVideoUrl(url) {
    const videoId = this.extractVideoId(url);
    return {
      isValid: !!videoId,
      videoId: videoId,
      thumbnailUrl: videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null,
      embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : null
    };
  }

  // カテゴリと講師の適合性チェック
  checkEducatorCategoryMatch(educatorId, category) {
    // この関数は videoDatabase をimportして使用
    const { videoDatabase } = require('./video-database');
    const educator = videoDatabase.educators[educatorId];
    
    if (!educator) return { match: false, reason: '講師が見つかりません' };
    
    const categoryInfo = videoDatabase.categories[category];
    if (!categoryInfo) return { match: false, reason: 'カテゴリが見つかりません' };

    const specialtyMatch = educator.specialties.some(specialty => 
      categoryInfo.subcategories.includes(specialty) ||
      specialty.includes(category)
    );

    return {
      match: specialtyMatch,
      reason: specialtyMatch ? '専門分野とマッチしています' : '専門分野が一致しない可能性があります',
      suggestions: categoryInfo.subcategories
    };
  }

  // データベース整合性チェック
  validateDatabase() {
    const { videoDatabase, VideoManager } = require('./video-database');
    const issues = [];

    // 1. 講師の存在チェック
    videoDatabase.videos.forEach(video => {
      if (!videoDatabase.educators[video.educator]) {
        issues.push({
          type: 'missing_educator',
          videoId: video.id,
          message: `動画 ${video.id} の講師 ${video.educator} が見つかりません`
        });
      }
    });

    // 2. カテゴリの存在チェック
    videoDatabase.videos.forEach(video => {
      if (!videoDatabase.categories[video.category]) {
        issues.push({
          type: 'missing_category',
          videoId: video.id,
          message: `動画 ${video.id} のカテゴリ ${video.category} が見つかりません`
        });
      }
    });

    // 3. URL形式チェック
    videoDatabase.videos.forEach(video => {
      const validation = this.validateVideoUrl(video.url);
      if (!validation.isValid) {
        issues.push({
          type: 'invalid_url',
          videoId: video.id,
          message: `動画 ${video.id} のURLが無効です: ${video.url}`
        });
      }
    });

    // 4. 必須フィールドチェック
    const requiredFields = ['id', 'title', 'educator', 'url', 'category', 'tags', 'target_audience', 'grade'];
    videoDatabase.videos.forEach(video => {
      requiredFields.forEach(field => {
        if (!video[field] || (Array.isArray(video[field]) && video[field].length === 0)) {
          issues.push({
            type: 'missing_field',
            videoId: video.id,
            message: `動画 ${video.id} の必須フィールド ${field} が不足しています`
          });
        }
      });
    });

    return {
      isValid: issues.length === 0,
      issues: issues,
      summary: {
        totalVideos: videoDatabase.videos.length,
        totalEducators: Object.keys(videoDatabase.educators).length,
        totalIssues: issues.length
      }
    };
  }

  // サンプル動画データ生成（テスト用）
  generateSampleVideos(educatorId, count = 3) {
    const sampleTitles = [
      "効果的な学習方法について",
      "やる気アップの秘訣",
      "家庭学習のコツ",
      "志望校選択のポイント",
      "時間管理の重要性",
      "暗記のテクニック"
    ];

    const samples = [];
    for (let i = 0; i < count; i++) {
      const title = sampleTitles[i % sampleTitles.length] + (i >= sampleTitles.length ? ` (${Math.floor(i / sampleTitles.length) + 1})` : '');
      samples.push(this.createVideoTemplate(educatorId, title));
    }

    return samples;
  }

  // レポート生成
  generateReport() {
    const { videoDatabase, VideoManager } = require('./video-database');
    const stats = VideoManager.getStats();
    const validation = this.validateDatabase();

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalVideos: stats.totalVideos,
        verifiedVideos: stats.verifiedVideos,
        totalEducators: stats.totalEducators,
        verifiedEducators: stats.verifiedEducators,
        categories: Object.keys(videoDatabase.categories).length,
        healthScore: Math.round((1 - validation.issues.length / stats.totalVideos) * 100)
      },
      byCategory: stats.byCategory,
      byEducator: stats.byEducator,
      issues: validation.issues,
      recommendations: this.generateRecommendations(stats, validation)
    };

    return report;
  }

  // 改善提案生成
  generateRecommendations(stats, validation) {
    const recommendations = [];

    // 検証済み動画が少ない場合
    if (stats.verifiedVideos < stats.totalVideos * 0.8) {
      recommendations.push({
        priority: 'high',
        type: 'verification',
        message: `検証済み動画が ${stats.verifiedVideos}/${stats.totalVideos} と少ないです。動画の内容を確認してverified: trueに変更してください。`
      });
    }

    // カテゴリの偏りチェック
    const maxVideos = Math.max(...Object.values(stats.byCategory));
    const minVideos = Math.min(...Object.values(stats.byCategory));
    if (maxVideos > minVideos * 3) {
      recommendations.push({
        priority: 'medium',
        type: 'balance',
        message: 'カテゴリ間の動画数に大きな偏りがあります。少ないカテゴリの動画を追加することを検討してください。'
      });
    }

    // エラーがある場合
    if (validation.issues.length > 0) {
      recommendations.push({
        priority: 'high',
        type: 'data_integrity',
        message: `${validation.issues.length} 件のデータ整合性の問題があります。修正をお勧めします。`
      });
    }

    return recommendations;
  }
}

// 使用例とテンプレート
const videoTool = new VideoManagementTool();

// 新しい講師追加の例
console.log('=== 新しい講師追加テンプレート ===');
const newEducators = videoTool.addMultipleEducators([
  '辻義夫',
  '栗原毅', 
  '野島博之',
  '畠山創',
  {
    id: '石田勝紀',
    displayName: '石田勝紀先生',
    description: '心理学ベースの子育て論・学習意欲向上の専門家',
    specialties: ['やる気向上', '親子関係', '学習習慣']
  }
]);

console.log('講師テンプレート:', JSON.stringify(newEducators, null, 2));

// 新しい動画追加の例
console.log('\n=== 新しい動画追加テンプレート ===');
const sampleVideo = videoTool.createVideoTemplate('辻義夫', '理科実験で楽しく学ぶ中学受験');
console.log('動画テンプレート:', JSON.stringify(sampleVideo, null, 2));

// データベース検証
console.log('\n=== データベース検証結果 ===');
const validation = videoTool.validateDatabase();
console.log('検証結果:', validation.summary);
if (validation.issues.length > 0) {
  console.log('問題点:', validation.issues);
}

// レポート生成
console.log('\n=== 総合レポート ===');
const report = videoTool.generateReport();
console.log('レポート:', JSON.stringify(report, null, 2));

module.exports = {
  VideoManagementTool,
  videoTool
};