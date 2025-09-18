// APIエンドポイントのテストスクリプト
const http = require('http');

// テスト用の設定
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  adminKey: 'test_admin_key',
  testVideo: {
    id: 'test_001',
    title: 'テスト動画',
    educator: 'テスト講師',
    url: 'https://youtu.be/test',
    duration: '10:00',
    category: 'テスト',
    subcategory: 'テスト',
    tags: ['テスト', 'API'],
    target_audience: ['保護者'],
    grade: ['全学年'],
    difficulty: '基礎',
    description: 'APIテスト用の動画です',
    summary: 'テスト用',
    uploadDate: '2024-01-01',
    verified: false,
    score: 30
  }
};

// HTTPリクエストを送信するヘルパー関数
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve({ status: res.statusCode, data: result });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// テスト関数
async function runTests() {
  console.log('🧪 APIエンドポイントテスト開始\n');

  try {
    // 1. スプレッドシート接続テスト
    console.log('1️⃣ スプレッドシート接続テスト');
    const testOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/sheets/test',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };

    const testResult = await makeRequest(testOptions);
    console.log('結果:', testResult.status, testResult.data);
    console.log('');

    // 2. リロードテスト
    console.log('2️⃣ スプレッドシートリロードテスト');
    const reloadOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/sheets/reload',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };

    const reloadResult = await makeRequest(reloadOptions, { adminKey: TEST_CONFIG.adminKey });
    console.log('結果:', reloadResult.status, reloadResult.data);
    console.log('');

    // 3. 動画アップロードテスト
    console.log('3️⃣ 動画アップロードテスト');
    const uploadOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/sheets/video',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };

    const uploadData = {
      adminKey: TEST_CONFIG.adminKey,
      videoData: TEST_CONFIG.testVideo
    };

    const uploadResult = await makeRequest(uploadOptions, uploadData);
    console.log('結果:', uploadResult.status, uploadResult.data);
    console.log('');

    // 4. ヘルスチェック
    console.log('4️⃣ ヘルスチェック');
    const healthOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/health',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };

    const healthResult = await makeRequest(healthOptions);
    console.log('結果:', healthResult.status, healthResult.data);
    console.log('');

    console.log('✅ テスト完了');

  } catch (error) {
    console.error('❌ テストエラー:', error.message);
    console.log('\n💡 解決方法:');
    console.log('1. サーバーが起動しているか確認: npm start');
    console.log('2. 環境変数が設定されているか確認: env-setup-guide.md を参照');
    console.log('3. ポート3000が使用可能か確認');
  }
}

// サーバーが起動しているかチェック
async function checkServer() {
  try {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/health',
      method: 'GET'
    };
    
    await makeRequest(options);
    return true;
  } catch (error) {
    return false;
  }
}

// メイン実行
async function main() {
  console.log('🔍 サーバー接続確認中...');
  
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log('❌ サーバーに接続できません');
    console.log('💡 まずサーバーを起動してください: npm start');
    return;
  }
  
  console.log('✅ サーバー接続確認完了\n');
  await runTests();
}

// スクリプト実行
if (require.main === module) {
  main();
}

module.exports = { runTests, checkServer };
