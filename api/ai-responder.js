// Claude API を使ったAI回答生成
const Anthropic = require('@anthropic-ai/sdk');

// 講師の知識ベース
const educatorKnowledge = {
  "佐藤亮子": {
    displayName: "佐藤ママ",
    philosophy: "4人の子を東大理Ⅲに合格させた実体験ベースの家庭教育専門家",
    specialties: ["家庭学習", "スケジュール管理", "生活習慣", "暗記法"],
    approach: "実践的で具体的なアドバイスを提供",
    keyPoints: [
      "要領の悪い親でもできる方法を重視",
      "隙間時間の有効活用",
      "子どもの気持ちに寄り添う",
      "小さな成功体験を積み重ねる",
      "家族全員で受験を支える"
    ],
    commonAdvice: [
      "1日15分の隙間時間でも効果的",
      "スケジュール管理は親の役割",
      "テレビやゲームとの向き合い方",
      "ママ友との関係性の築き方",
      "子どものやる気を引き出す声かけ"
    ]
  },
  "西村創": {
    displayName: "西村先生",
    philosophy: "指導歴28年、YouTubeチャンネル登録12万人の受験指導専門家",
    specialties: ["塾選び", "受験戦略", "やる気向上", "志望校選択"],
    approach: "戦略的で論理的な指導",
    keyPoints: [
      "子どもに合った塾選びが最重要",
      "データに基づいた志望校選択",
      "長期的な視点での受験戦略",
      "保護者の心構えと準備",
      "効率的な学習方法の提案"
    ],
    commonAdvice: [
      "大手塾の特徴を理解して選択",
      "模試の結果を正しく読み取る",
      "志望校の過去問分析の重要性",
      "子どもの性格に合った指導法",
      "受験までのスケジュール管理"
    ]
  },
  "出口汪": {
    displayName: "出口汪先生",
    philosophy: "現代文のカリスマ、論理的読解法の第一人者",
    specialties: ["国語", "論理的読解", "記述問題"],
    approach: "論理的思考力を重視した指導",
    keyPoints: [
      "論理エンジンで読解力を向上",
      "記述問題の書き方指導",
      "文章の構造を理解する",
      "設問の意図を読み取る",
      "国語力は全教科の基礎"
    ],
    commonAdvice: [
      "文章の論理構造を理解する",
      "記述問題は型を覚える",
      "読解力は練習で必ず向上",
      "国語は暗記科目ではない",
      "論理的思考力を養う"
    ]
  }
};

class AIResponder {
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    });
  }

  // 講師の考え方に基づいた回答生成
  async generateEducatorResponse(educatorName, userQuestion, context = {}) {
    const knowledge = educatorKnowledge[educatorName];
    if (!knowledge) {
      return this.generateGeneralResponse(userQuestion, context);
    }

    const prompt = this.buildEducatorPrompt(knowledge, userQuestion, context);
    
    try {
      const response = await this.anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 500,
        temperature: 0.7,
        messages: [{
          role: "user",
          content: prompt
        }]
      });

      return response.content[0].text;
    } catch (error) {
      console.error('Claude API Error:', error);
      return this.generateFallbackResponse(educatorName, userQuestion);
    }
  }

  // 一般的な回答生成（講師指定なし）
  async generateGeneralResponse(userQuestion, context = {}) {
    const prompt = this.buildGeneralPrompt(userQuestion, context);
    
    try {
      const response = await this.anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 400,
        temperature: 0.7,
        messages: [{
          role: "user",
          content: prompt
        }]
      });

      return response.content[0].text;
    } catch (error) {
      console.error('Claude API Error:', error);
      return "申し訳ございません。現在回答を生成できません。別の方法でお手伝いさせていただきます。";
    }
  }

  // 講師用プロンプト構築
  buildEducatorPrompt(knowledge, userQuestion, context) {
    return `あなたは${knowledge.displayName}です。

【あなたの基本情報】
- 専門分野: ${knowledge.specialties.join('、')}
- 指導方針: ${knowledge.approach}
- 基本理念: ${knowledge.philosophy}

【重要なポイント】
${knowledge.keyPoints.map(point => `・${point}`).join('\n')}

【よくあるアドバイス】
${knowledge.commonAdvice.map(advice => `・${advice}`).join('\n')}

【ユーザーの質問】
${userQuestion}

【コンテキスト】
${context.previousVideos ? `関連動画: ${context.previousVideos.length}本` : ''}
${context.userHistory ? `相談履歴: ${context.userHistory.length}回` : ''}

【回答の指示】
1. ${knowledge.displayName}の考え方で回答してください
2. 実践的で具体的なアドバイスを心がけてください
3. 温かみのある、親しみやすい口調で書いてください
4. 200文字以内で簡潔にまとめてください
5. 絵文字を適度に使用してください

回答:`;
  }

  // 一般用プロンプト構築
  buildGeneralPrompt(userQuestion, context) {
    return `あなたは中学受験の専門家です。

【ユーザーの質問】
${userQuestion}

【コンテキスト】
${context.previousVideos ? `関連動画: ${context.previousVideos.length}本` : ''}
${context.userHistory ? `相談履歴: ${context.userHistory.length}回` : ''}

【回答の指示】
1. 中学受験の専門家として回答してください
2. 実践的で具体的なアドバイスを心がけてください
3. 温かみのある、親しみやすい口調で書いてください
4. 200文字以内で簡潔にまとめてください
5. 絵文字を適度に使用してください

回答:`;
  }

  // フォールバック回答
  generateFallbackResponse(educatorName, userQuestion) {
    const knowledge = educatorKnowledge[educatorName];
    if (!knowledge) {
      return "申し訳ございません。現在回答を生成できません。別の方法でお手伝いさせていただきます。";
    }

    return `${knowledge.displayName}の考え方では、${userQuestion}について、${knowledge.approach}を心がけています。具体的なアドバイスについては、関連動画をご覧いただくことをお勧めします。`;
  }

  // 講師名を抽出
  extractEducatorName(text) {
    const educators = Object.keys(educatorKnowledge);
    for (const educator of educators) {
      const knowledge = educatorKnowledge[educator];
      if (text.includes(educator) || text.includes(knowledge.displayName)) {
        return educator;
      }
    }
    return null;
  }

  // 利用可能な講師一覧を取得
  getAvailableEducators() {
    return Object.keys(educatorKnowledge).map(key => ({
      id: key,
      ...educatorKnowledge[key]
    }));
  }
}

module.exports = { AIResponder, educatorKnowledge };
