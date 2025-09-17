// 拡張可能な中学受験YouTube動画データベース
const videoDatabase = {
    // 各講師の基本情報
    educators: {
      "佐藤亮子": {
        displayName: "佐藤ママ",
        description: "4人の子を東大理Ⅲに合格させた実体験ベースの家庭教育専門家",
        channelUrl: "https://youtube.com/@satomama", // 要確認
        specialties: ["家庭学習", "スケジュール管理", "生活習慣", "暗記法"],
        targetAudience: ["保護者"],
        verified: true,
        priority: 1 // 表示優先度
      },
      "西村創": {
        displayName: "西村先生",
        description: "指導歴28年、YouTubeチャンネル登録12万人の受験指導専門家",
        channelUrl: "https://youtube.com/@nishimurasensei",
        specialties: ["塾選び", "受験戦略", "やる気向上", "志望校選択"],
        targetAudience: ["保護者"],
        verified: true,
        priority: 1
      },
      "出口汪": {
        displayName: "出口汪先生",
        description: "現代文のカリスマ、論理的読解法の第一人者",
        channelUrl: "https://youtube.com/@deguchi_hiroshi", // 要確認
        specialties: ["国語", "論理的読解", "記述問題"],
        targetAudience: ["保護者", "受験生"],
        verified: true,
        priority: 2
      },
      "朝倉仁": {
        displayName: "朝倉算数",
        description: "算数専門塾「朝倉算数道場」代表、楽しい算数指導",
        channelUrl: "https://youtube.com/@asakura_sansu", // 要確認
        specialties: ["算数", "図形問題", "特殊算"],
        targetAudience: ["受験生", "保護者"],
        verified: false, // まだ詳細確認中
        priority: 2
      },
      "高濱正伸": {
        displayName: "高濱先生",
        description: "花まる学習会代表、思考力育成の専門家",
        channelUrl: "https://youtube.com/@hanamaru_official", // 要確認
        specialties: ["思考力", "低学年指導", "やる気引き出し"],
        targetAudience: ["保護者", "低学年"],
        verified: false,
        priority: 2
      }
    },
  
    // 動画データ（講師別・カテゴリ別で整理）
    videos: [
      // 佐藤ママの動画
      {
        id: "sato_001",
        title: "ママ友との付き合い方・総スカンされた時の対処法",
        educator: "佐藤亮子",
        url: "https://youtu.be/SeZ_7l43hms",
        duration: "15:00",
        category: "保護者サポート",
        subcategory: "人間関係",
        tags: ["ママ友", "人間関係", "メンタル", "保護者", "悩み相談"],
        target_audience: ["保護者"],
        grade: ["全学年"],
        difficulty: "実践的",
        description: "中学受験することで周囲から詮索・噂される時の心の持ち方",
        uploadDate: "2024-04-10",
        verified: true,
        score: 45,
        viewCount: "推定1万回以上" // 実際のデータが分かる場合は数値で
      },
      {
        id: "sato_002",
        title: "子どもの勉強スケジュール管理のコツ",
        educator: "佐藤亮子",
        url: "https://youtu.be/77_yj-Y1HWw",
        duration: "12:30",
        category: "学習管理",
        subcategory: "スケジュール",
        tags: ["スケジュール", "時間管理", "家庭学習", "計画", "試行錯誤"],
        target_audience: ["保護者"],
        grade: ["全学年"],
        difficulty: "基礎",
        description: "要領の悪い親でもできるスケジュール管理術",
        uploadDate: "2024-04-10",
        verified: true,
        score: 44
      },
      {
        id: "sato_003",
        title: "小6受験生の夏休みスケジュール実例",
        educator: "佐藤亮子",
        url: "https://youtu.be/0_WV88nNahA",
        duration: "18:00",
        category: "季節対策",
        subcategory: "夏休み",
        tags: ["夏休み", "スケジュール", "小6", "受験直前", "浜学園"],
        target_audience: ["保護者", "小6"],
        grade: ["小6"],
        difficulty: "応用",
        description: "浜学園のスケジュール表活用法と1日の流れ",
        uploadDate: "2024-04-10",
        verified: true,
        score: 43
      },
      {
        id: "sato_004",
        title: "暗記力を鍛える具体的方法",
        educator: "佐藤亮子",
        url: "https://youtu.be/1l_-eRLfCsw",
        duration: "20:00",
        category: "学習法",
        subcategory: "暗記",
        tags: ["暗記", "理科", "社会", "隙間時間", "アウトプット", "インプット"],
        target_audience: ["保護者", "小5", "小6"],
        grade: ["小5", "小6"],
        difficulty: "実践的",
        description: "1日15分の隙間時間活用、インプットからアウトプットへの転換法",
        uploadDate: "2024-04-10",
        verified: true,
        score: 44
      },
      {
        id: "sato_005",
        title: "テレビを見せたくない時の家族との向き合い方",
        educator: "佐藤亮子",
        url: "https://youtu.be/F4O1xulHwww",
        duration: "14:00",
        category: "家庭環境",
        subcategory: "生活習慣",
        tags: ["テレビ", "祖父母", "家族", "環境作り", "単身赴任"],
        target_audience: ["保護者"],
        grade: ["全学年"],
        difficulty: "実践的",
        description: "単身赴任家庭での祖父母との教育方針の調整",
        uploadDate: "2024-04-10",
        verified: true,
        score: 41
      },
  
      // 西村創先生の動画（チャンネル情報のみ、個別動画は後で追加）
      {
        id: "nishi_001",
        title: "中学受験のはじめ方・基本の心構え",
        educator: "西村創",
        url: "https://youtube.com/@nishimurasensei",
        duration: "15:00",
        category: "受験基礎",
        subcategory: "心構え",
        tags: ["受験準備", "心構え", "基本知識", "塾選び"],
        target_audience: ["保護者"],
        grade: ["小3", "小4", "小5"],
        difficulty: "基礎",
        description: "中学受験を考えた時にまず知っておくべきこと",
        uploadDate: "2024-01-01", // 推定
        verified: true,
        score: 44
      },
      {
        id: "nishi_002",
        title: "大手塾徹底比較・塾選びのポイント",
        educator: "西村創",
        url: "https://youtube.com/@nishimurasensei",
        duration: "20:00",
        category: "塾選び",
        subcategory: "塾比較",
        tags: ["塾選び", "SAPIX", "四谷大塚", "日能研", "早稲アカ", "比較"],
        target_audience: ["保護者"],
        grade: ["全学年"],
        difficulty: "重要",
        description: "各塾の特徴と子どもに合った塾の選び方",
        uploadDate: "2024-01-01",
        verified: true,
        score: 43
      },
  
      // 将来追加予定の動画（プレースホルダー）
      {
        id: "deguchi_001",
        title: "論理的読解の基本・国語力向上法",
        educator: "出口汪",
        url: "https://youtube.com/@deguchi_hiroshi", // 要確認
        duration: "18:00",
        category: "教科別",
        subcategory: "国語",
        tags: ["国語", "読解", "論理", "記述", "現代文"],
        target_audience: ["受験生", "保護者"],
        grade: ["小4", "小5", "小6"],
        difficulty: "基礎",
        description: "論理エンジンで有名な出口先生の読解力向上法",
        uploadDate: "2024-01-01", // 推定
        verified: false, // まだ詳細未確認
        score: 40
      }
    ],
  
    // カテゴリ定義（動画の分類用）
    categories: {
      "保護者サポート": {
        displayName: "保護者サポート",
        description: "親の心構えや悩み相談",
        icon: "👨‍👩‍👧‍👦",
        subcategories: ["人間関係", "メンタルサポート", "心構え"]
      },
      "学習管理": {
        displayName: "学習・時間管理", 
        description: "スケジュール管理や学習計画",
        icon: "📅",
        subcategories: ["スケジュール", "時間管理", "計画立案"]
      },
      "学習法": {
        displayName: "学習方法",
        description: "効果的な勉強法や暗記法",
        icon: "📚",
        subcategories: ["暗記", "復習", "予習", "ノート術"]
      },
      "教科別": {
        displayName: "教科別対策",
        description: "算数・国語・理科・社会の具体的指導",
        icon: "📝",
        subcategories: ["算数", "国語", "理科", "社会"]
      },
      "受験戦略": {
        displayName: "受験戦略",
        description: "志望校選択や受験テクニック",
        icon: "🎯",
        subcategories: ["志望校選択", "過去問対策", "模試対策"]
      },
      "塾選び": {
        displayName: "塾・学習環境",
        description: "塾選びや学習環境の整備",
        icon: "🏫",
        subcategories: ["塾比較", "家庭教師", "学習環境"]
      },
      "季節対策": {
        displayName: "季節・時期別対策",
        description: "夏休みや直前期などの時期別対策",
        icon: "🗓️",
        subcategories: ["夏休み", "冬休み", "直前期", "新学期"]
      },
      "家庭環境": {
        displayName: "家庭・生活環境",
        description: "家庭での環境づくりや生活習慣",
        icon: "🏠",
        subcategories: ["生活習慣", "環境作り", "家族関係"]
      }
    },
  
    // 学年・対象定義
    targets: {
      grades: ["小1", "小2", "小3", "小4", "小5", "小6", "全学年"],
      audiences: ["保護者", "受験生", "低学年", "高学年"],
      difficulties: ["基礎", "標準", "応用", "実践的", "重要", "上級"]
    }
  };
  
  // 拡張用の便利関数
  const VideoManager = {
    // 新しい講師を追加
    addEducator(id, educatorData) {
      videoDatabase.educators[id] = {
        verified: false,
        priority: 3, // デフォルトは低優先度
        ...educatorData
      };
    },
  
    // 新しい動画を追加
    addVideo(videoData) {
      const newVideo = {
        verified: false,
        score: 30, // デフォルトスコア
        uploadDate: new Date().toISOString().split('T')[0],
        ...videoData,
        id: videoData.id || `video_${Date.now()}`
      };
      
      videoDatabase.videos.push(newVideo);
      return newVideo.id;
    },
  
    // 講師の動画のみを取得
    getVideosByEducator(educatorId) {
      return videoDatabase.videos.filter(video => video.educator === educatorId);
    },
  
    // カテゴリ別の動画を取得
    getVideosByCategory(category, subcategory = null) {
      return videoDatabase.videos.filter(video => {
        if (subcategory) {
          return video.category === category && video.subcategory === subcategory;
        }
        return video.category === category;
      });
    },
  
    // 検証済み動画のみを取得
    getVerifiedVideos() {
      return videoDatabase.videos.filter(video => video.verified === true);
    },
  
    // 優先度の高い講師の動画を取得
    getPriorityVideos(priority = 1) {
      return videoDatabase.videos.filter(video => {
        const educator = videoDatabase.educators[video.educator];
        return educator && educator.priority <= priority;
      });
    },
  
    // 学年に適した動画を取得
    getVideosByGrade(grade) {
      return videoDatabase.videos.filter(video => 
        video.grade.includes(grade) || video.grade.includes("全学年")
      );
    },
  
    // 動画統計を取得
    getStats() {
      const videos = videoDatabase.videos;
      const educators = videoDatabase.educators;
      
      return {
        totalVideos: videos.length,
        verifiedVideos: videos.filter(v => v.verified).length,
        totalEducators: Object.keys(educators).length,
        verifiedEducators: Object.values(educators).filter(e => e.verified).length,
        byCategory: Object.keys(videoDatabase.categories).reduce((acc, cat) => {
          acc[cat] = videos.filter(v => v.category === cat).length;
          return acc;
        }, {}),
        byEducator: Object.keys(educators).reduce((acc, edu) => {
          acc[edu] = videos.filter(v => v.educator === edu).length;
          return acc;
        }, {})
      };
    }
  };
  
  // 高度な検索・マッチング機能（改良版）
  function findRelevantVideos(consultationText, options = {}) {
    const {
      maxResults = 5,
      educatorPreference = null, // 特定の講師を優先
      categoryFilter = null,     // 特定のカテゴリのみ
      gradeFilter = null,        // 特定の学年のみ
      onlyVerified = true,       // 検証済みのみ
      minRelevanceScore = 10     // 最小関連度スコア（新規追加）
    } = options;
  
    let videos = videoDatabase.videos;
  
    // フィルタ適用
    if (onlyVerified) {
      videos = videos.filter(v => v.verified === true);
    }
  
    if (categoryFilter) {
      videos = videos.filter(v => v.category === categoryFilter);
    }
  
    if (gradeFilter) {
      videos = videos.filter(v => 
        v.grade.includes(gradeFilter) || v.grade.includes("全学年")
      );
    }
  
    // 関連度スコア計算（改良版）
    const scoredVideos = videos.map(video => {
      let relevanceScore = 0;
      const educator = videoDatabase.educators[video.educator];
  
      // 基本品質スコア
      relevanceScore += video.score / 10;
  
      // 講師優先度
      if (educator && educator.priority === 1) {
        relevanceScore += 5;
      }
  
      // 特定講師の優先
      if (educatorPreference && video.educator === educatorPreference) {
        relevanceScore += 15;
      }
  
      // タグマッチング（重み調整）
      video.tags.forEach(tag => {
        if (consultationText.includes(tag)) {
          relevanceScore += 10; // 重みを増加
        }
      });

      // カテゴリマッチング
      if (consultationText.includes(video.category)) {
        relevanceScore += 8; // 重みを増加
      }

      // タイトルマッチング（部分一致も考慮）
      const titleWords = video.title.split(/\s+/);
      titleWords.forEach(word => {
        if (consultationText.includes(word)) {
          relevanceScore += 6; // 重みを増加
        }
        // 部分一致も考慮
        if (word.length > 2 && consultationText.includes(word.substring(0, 3))) {
          relevanceScore += 2;
        }
      });

      // 説明マッチング
      const descWords = video.description.split(/\s+/);
      descWords.forEach(word => {
        if (consultationText.includes(word)) {
          relevanceScore += 3; // 重みを増加
        }
      });

      // サブカテゴリマッチング
      if (video.subcategory && consultationText.includes(video.subcategory)) {
        relevanceScore += 5;
      }
  
      // 対象読者マッチング
      video.target_audience.forEach(audience => {
        if (consultationText.includes(audience)) {
          relevanceScore += 6;
        }
      });
  
      return {
        ...video,
        relevanceScore,
        educatorInfo: educator
      };
    });
  
    // スコア順でソート、上位を返す
    return scoredVideos
      .filter(video => video.relevanceScore >= minRelevanceScore) // 最小スコア以上のみ
      .sort((a, b) => {
        // まず関連度スコア、同じ場合は講師の優先度
        if (b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }
        return (a.educatorInfo?.priority || 999) - (b.educatorInfo?.priority || 999);
      })
      .slice(0, maxResults);
  }
  
  // 簡単な動画追加例
  console.log("=== 新しい講師と動画の追加例 ===");
  
  // 新しい講師追加
  VideoManager.addEducator("辻義夫", {
    displayName: "辻先生",
    description: "理科実験で有名な理科専門講師",
    channelUrl: "https://youtube.com/@tsuji_rika",
    specialties: ["理科", "実験", "観察"],
    targetAudience: ["受験生", "保護者"]
  });
  
  // 新しい動画追加
  VideoManager.addVideo({
    title: "理科実験で楽しく学ぶ中学受験理科",
    educator: "辻義夫",
    url: "https://youtube.com/watch?v=example",
    category: "教科別",
    subcategory: "理科",
    tags: ["理科", "実験", "観察", "楽しく学習"],
    target_audience: ["受験生"],
    grade: ["小4", "小5", "小6"],
    description: "実験を通して理科の面白さを伝える"
  });
  
  // 統計情報表示
  console.log("データベース統計:", VideoManager.getStats());
  
  module.exports = {
    videoDatabase,
    VideoManager,
    findRelevantVideos
  };