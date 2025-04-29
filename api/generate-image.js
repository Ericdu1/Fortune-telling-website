const fetch = require('node-fetch');

// 每张图像的价格约为$0.02-$0.04，需要限制使用
const MAX_IMAGES_PER_SESSION = 5;

// 图像缓存系统
// 注意：生产环境应使用Redis或其他持久化存储
const imageCache = {};

// 校验请求率和图像数量
const sessionTracker = {};

module.exports = async (req, res) => {
  try {
    // 只允许POST方法
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { sceneType, worldType, talent, event, userId = 'anonymous' } = req.body;

    if (!sceneType || !worldType) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // 限制每个用户会话的图像生成数量
    if (!sessionTracker[userId]) {
      sessionTracker[userId] = { count: 0, lastReset: Date.now() };
    }

    // 每24小时重置计数
    const ONE_DAY = 24 * 60 * 60 * 1000;
    if (Date.now() - sessionTracker[userId].lastReset > ONE_DAY) {
      sessionTracker[userId] = { count: 0, lastReset: Date.now() };
    }

    // 检查是否超过每会话限制
    if (sessionTracker[userId].count >= MAX_IMAGES_PER_SESSION) {
      return res.status(429).json({ 
        error: 'Image generation limit reached', 
        message: '已达到图像生成上限，请24小时后再试。'
      });
    }

    // 构建缓存键
    const cacheKey = `${sceneType}_${worldType}_${talent || 'none'}_${event || 'none'}`;

    // 检查缓存
    if (imageCache[cacheKey]) {
      return res.status(200).json({ 
        url: imageCache[cacheKey],
        cached: true
      });
    }

    // 构建提示词
    const prompt = await buildImagePrompt(sceneType, worldType, talent, event);

    // 调用OpenAI API生成图像
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024"
      })
    });

    const data = await openaiResponse.json();

    if (data.error) {
      console.error('OpenAI API Error:', data.error);
      return res.status(500).json({ error: data.error.message });
    }

    // 从响应中提取图像URL
    const imageUrl = data.data[0].url;
    
    // 存入缓存
    imageCache[cacheKey] = imageUrl;
    
    // 更新计数器
    sessionTracker[userId].count += 1;

    return res.status(200).json({ 
      url: imageUrl,
      cached: false,
      remainingImages: MAX_IMAGES_PER_SESSION - sessionTracker[userId].count
    });

  } catch (error) {
    console.error('Error generating image:', error);
    return res.status(500).json({ error: 'Failed to generate image' });
  }
};

// 使用提示词工程构建优质图像生成提示词
async function buildImagePrompt(sceneType, worldType, talent, event) {
  // 基础场景映射
  const scenePrompts = {
    'isekai-moment': `A dramatic scene showing a person being transported to another world. The scene shows the exact moment of transition between worlds.`,
    'ability-awakening': `A character discovering and awakening their hidden powers for the first time, with magical energy surrounding them.`,
    'world-environment': `A breathtaking landscape view of a fantasy world, showing the unique environment and atmosphere.`,
    'life-choice': `A character at a crossroads in their journey, making an important decision that will change their fate.`,
    'final-form': `A powerful character who has reached the pinnacle of their abilities, showing mastery of their powers.`
  };

  // 世界类型细节映射
  const worldDetails = {
    '修真/仙侠世界': `ancient Chinese cultivation world with floating mountains, spirit energy in the air, majestic temples, and people practicing martial arts and meditation.`,
    '魔法奇幻世界': `high fantasy magical world with castles, magical creatures, glowing runes, and wizards casting spells.`,
    '未来科技世界': `advanced sci-fi cityscape with neon lights, holographic displays, flying vehicles, and advanced technology.`,
    '诡异神秘世界': `dark mysterious world with eldritch elements, reality distortions, cosmic horror influences, and strange phenomena.`
  };

  // 能力类型视觉效果
  const talentVisuals = {
    '元素操控': `swirling elemental energy (fire, water, earth, air) surrounding the character's hands and body.`,
    '精神力量': `glowing energy emanating from the character's head, with floating objects and telepathic waves.`,
    '身体强化': `muscular physique with a subtle aura of power, extraordinary physical capabilities shown in mid-action.`,
    '时空掌控': `distorted space-time around the character, with clock-like patterns, portals, or frozen time elements.`
  };

  // 构建基础提示词
  let basePrompt = scenePrompts[sceneType] || scenePrompts['world-environment'];
  
  // 添加世界类型细节
  if (worldType && worldDetails[worldType]) {
    basePrompt += ` Set in a ${worldDetails[worldType]}`;
  }
  
  // 添加能力视觉效果
  if (talent && talentVisuals[talent]) {
    basePrompt += ` The character possesses ${talentVisuals[talent]}`;
  }
  
  // 添加事件描述（如果有）
  if (event) {
    basePrompt += ` The current situation shows: ${event}`;
  }
  
  // 添加风格指导
  const styleGuide = `Highly detailed, dramatic lighting, vibrant colors, epic fantasy style, photorealistic quality.`;
  
  return `${basePrompt} ${styleGuide}`;
} 