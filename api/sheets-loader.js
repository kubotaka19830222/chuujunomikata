// Google Sheets 連携で動画データベースを管理
const { google } = require('googleapis');

class SheetsLoader {
  constructor() {
    this.sheets = google.sheets({ version: 'v4' });
    this.auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  }

  // スプレッドシートから動画データを読み込み
  async loadVideosFromSheet() {
    try {
      const spreadsheetId = process.env.SHEETS_SPREADSHEET_ID;
      const range = process.env.SHEETS_RANGE || 'Videos!A2:O'; // ヘッダー行を除く

      const response = await this.sheets.spreadsheets.values.get({
        auth: this.auth,
        spreadsheetId: spreadsheetId,
        range: range,
      });

      const rows = response.data.values || [];
      const videos = [];

      rows.forEach((row, index) => {
        if (row.length >= 10) { // 最低限の必須フィールドがあるかチェック
          const video = {
            id: row[0] || `video_${Date.now()}_${index}`,
            title: row[1] || '',
            educator: row[2] || '',
            url: row[3] || '',
            duration: row[4] || '',
            category: row[5] || '',
            subcategory: row[6] || '',
            tags: row[7] ? row[7].split(',').map(tag => tag.trim()) : [],
            target_audience: row[8] ? row[8].split(',').map(aud => aud.trim()) : [],
            grade: row[9] ? row[9].split(',').map(g => g.trim()) : [],
            difficulty: row[10] || '基礎',
            description: row[11] || '',
            summary: row[12] || '', // 動画のまとめ（新規追加）
            uploadDate: row[13] || new Date().toISOString().split('T')[0],
            verified: row[14] === 'TRUE' || row[14] === 'true' || row[14] === '1',
            score: parseInt(row[15]) || 30
          };

          // 必須フィールドの検証
          if (video.title && video.educator && video.url) {
            videos.push(video);
          }
        }
      });

      console.log(`📊 スプレッドシートから ${videos.length} 本の動画を読み込みました`);
      return videos;

    } catch (error) {
      console.error('スプレッドシート読み込みエラー:', error);
      return [];
    }
  }

  // スプレッドシートから講師データを読み込み
  async loadEducatorsFromSheet() {
    try {
      const spreadsheetId = process.env.SHEETS_SPREADSHEET_ID;
      const range = 'Educators!A2:H'; // ヘッダー行を除く

      const response = await this.sheets.spreadsheets.values.get({
        auth: this.auth,
        spreadsheetId: spreadsheetId,
        range: range,
      });

      const rows = response.data.values || [];
      const educators = {};

      rows.forEach((row, index) => {
        if (row.length >= 6) {
          const educator = {
            displayName: row[1] || '',
            description: row[2] || '',
            channelUrl: row[3] || '',
            specialties: row[4] ? row[4].split(',').map(s => s.trim()) : [],
            targetAudience: row[5] ? row[5].split(',').map(a => a.trim()) : [],
            verified: row[6] === 'TRUE' || row[6] === 'true' || row[6] === '1',
            priority: parseInt(row[7]) || 3
          };

          if (row[0] && educator.displayName) {
            educators[row[0]] = educator;
          }
        }
      });

      console.log(`👨‍🏫 スプレッドシートから ${Object.keys(educators).length} 名の講師を読み込みました`);
      return educators;

    } catch (error) {
      console.error('講師データ読み込みエラー:', error);
      return {};
    }
  }

  // 動画データをスプレッドシートに追加
  async addVideoToSheet(videoData) {
    try {
      const spreadsheetId = process.env.SHEETS_SPREADSHEET_ID;
      const range = 'Videos!A:O';

      // 新しい動画の行データを作成
      const newRow = [
        videoData.id || `video_${Date.now()}`,
        videoData.title || '',
        videoData.educator || '',
        videoData.url || '',
        videoData.duration || '',
        videoData.category || '',
        videoData.subcategory || '',
        videoData.tags ? videoData.tags.join(', ') : '',
        videoData.target_audience ? videoData.target_audience.join(', ') : '',
        videoData.grade ? videoData.grade.join(', ') : '',
        videoData.difficulty || '基礎',
        videoData.description || '',
        videoData.summary || '', // 動画のまとめ
        videoData.uploadDate || new Date().toISOString().split('T')[0],
        videoData.verified ? 'TRUE' : 'FALSE',
        videoData.score || 30
      ];

      await this.sheets.spreadsheets.values.append({
        auth: this.auth,
        spreadsheetId: spreadsheetId,
        range: range,
        valueInputOption: 'RAW',
        resource: {
          values: [newRow]
        }
      });

      console.log(`✅ 動画 "${videoData.title}" をスプレッドシートに追加しました`);
      return true;

    } catch (error) {
      console.error('動画追加エラー:', error);
      return false;
    }
  }

  // 講師データをスプレッドシートに追加
  async addEducatorToSheet(educatorId, educatorData) {
    try {
      const spreadsheetId = process.env.SHEETS_SPREADSHEET_ID;
      const range = 'Educators!A:H';

      const newRow = [
        educatorId,
        educatorData.displayName || '',
        educatorData.description || '',
        educatorData.channelUrl || '',
        educatorData.specialties ? educatorData.specialties.join(', ') : '',
        educatorData.targetAudience ? educatorData.targetAudience.join(', ') : '',
        educatorData.verified ? 'TRUE' : 'FALSE',
        educatorData.priority || 3
      ];

      await this.sheets.spreadsheets.values.append({
        auth: this.auth,
        spreadsheetId: spreadsheetId,
        range: range,
        valueInputOption: 'RAW',
        resource: {
          values: [newRow]
        }
      });

      console.log(`✅ 講師 "${educatorData.displayName}" をスプレッドシートに追加しました`);
      return true;

    } catch (error) {
      console.error('講師追加エラー:', error);
      return false;
    }
  }

  // スプレッドシートの設定をテスト
  async testConnection() {
    try {
      const spreadsheetId = process.env.SHEETS_SPREADSHEET_ID;
      const range = 'Videos!A1:O1'; // ヘッダー行のみ

      const response = await this.sheets.spreadsheets.values.get({
        auth: this.auth,
        spreadsheetId: spreadsheetId,
        range: range,
      });

      const headers = response.data.values?.[0] || [];
      console.log('📋 スプレッドシートヘッダー:', headers);
      
      return {
        success: true,
        headers: headers,
        message: 'スプレッドシート接続成功'
      };

    } catch (error) {
      console.error('スプレッドシート接続テストエラー:', error);
      return {
        success: false,
        error: error.message,
        message: 'スプレッドシート接続失敗'
      };
    }
  }
}

module.exports = { SheetsLoader };
