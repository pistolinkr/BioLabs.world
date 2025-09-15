const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

const app = express();
const PORT = 3001;

// CORS 설정
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// AI API 프록시 엔드포인트 (Hugging Face만 사용)
app.post('/api/ai', async (req, res) => {
  try {
    const { content, max_tokens = 4000 } = req.body;
    
    // Hugging Face API 사용 (무료)
    const huggingfaceKey = process.env.HUGGINGFACE_API_KEY;
    if (!huggingfaceKey) {
      return res.status(500).json({ error: 'Hugging Face API 키가 설정되지 않았습니다.' });
    }
    
    // 텍스트만 추출 (이미지는 제외)
    const textContent = content.filter(item => item.type === 'text').map(item => item.text).join(' ');
    
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${huggingfaceKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: textContent,
        parameters: {
          max_length: max_tokens,
          temperature: 0.7
        }
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hugging Face API 오류: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    // Hugging Face 응답 형식을 표준 형식으로 변환
    res.json({
      content: [{
        text: data[0]?.generated_text || 'AI 응답을 생성할 수 없습니다.'
      }]
    });
    
  } catch (error) {
    console.error('프록시 서버 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

// 기존 Anthropic 엔드포인트 제거 (하위 호환성 없음)

// 서버 상태 확인
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '프록시 서버가 정상 작동 중입니다.' });
});

app.listen(PORT, () => {
  console.log(`프록시 서버가 http://localhost:${PORT}에서 실행 중입니다.`);
  console.log('Hugging Face AI API 프록시 엔드포인트: /api/ai');
});
