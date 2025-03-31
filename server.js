const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 确保缓存目录存在
const cacheDir = path.join(__dirname, 'cache');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}

// 二次元API源列表
const ANIME_API_SOURCES = [
  {
    name: 'waifu.pics',
    url: 'https://api.waifu.pics/sfw/waifu',
    getImageUrl: (data) => data.url
  },
  {
    name: 'nekos.best-neko',
    url: 'https://nekos.best/api/v2/neko',
    getImageUrl: (data) => data.results[0].url
  },
  {
    name: 'nekos.best-kitsune',
    url: 'https://nekos.best/api/v2/kitsune',
    getImageUrl: (data) => data.results[0].url
  },
  {
    name: 'nekos.best-husbando',
    url: 'https://nekos.best/api/v2/husbando',
    getImageUrl: (data) => data.results[0].url
  },
  {
    name: 'catboys',
    url: 'https://api.catboys.com/img',
    getImageUrl: (data) => data.url
  },
  {
    name: 'picsum',
    url: 'https://picsum.photos/400/600',
    getImageUrl: () => `https://picsum.photos/seed/${Math.random().toString(36).substring(7)}/400/600`
  },
  {
    name: 'unsplash-anime',
    url: 'https://source.unsplash.com/300x400/?anime,manga',
    getImageUrl: () => `https://source.unsplash.com/300x400/?anime,manga&sig=${Date.now()}`
  },
  {
    name: 'unsplash-japan',
    url: 'https://source.unsplash.com/300x400/?japan,tokyo',
    getImageUrl: () => `https://source.unsplash.com/300x400/?japan,tokyo&sig=${Date.now()}`
  }
];

// 本地备份图片库
const LOCAL_IMAGES = [
  { path: '/placeholder-image.jpg', title: '默认动漫图片', author: '本地库' }
  // 可以添加更多本地图片...
];

// API：获取推荐动漫图片
app.get('/api/anime-recommendations', async (req, res) => {
  try {
    // 获取图片数量，默认5张
    const count = parseInt(req.query.count) || 5;
    
    // 检查是否有缓存
    const cacheFile = path.join(cacheDir, `recommendations-${count}.json`);
    const currentTime = Date.now();
    const cacheMaxAge = 60 * 60 * 1000; // 1小时缓存
    
    if (fs.existsSync(cacheFile)) {
      const cacheStats = fs.statSync(cacheFile);
      const cacheAge = currentTime - cacheStats.mtimeMs;
      
      // 如果缓存未过期，直接返回缓存内容
      if (cacheAge < cacheMaxAge) {
        try {
          const cachedData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
          console.log('使用缓存的推荐图片');
          return res.json(cachedData);
        } catch (err) {
          console.error('读取缓存文件失败:', err);
          // 继续获取新数据
        }
      }
    }
    
    // 获取多张图片
    const imagePromises = [];
    const usedSources = [];
    
    // 复制并打乱API源列表
    const shuffledSources = [...ANIME_API_SOURCES].sort(() => 0.5 - Math.random());
    
    for (let i = 0; i < count; i++) {
      // 选择API源，确保不重复
      let source;
      if (shuffledSources.length > i) {
        source = shuffledSources[i];
      } else {
        // 如果API源不够，随机选择
        source = shuffledSources[Math.floor(Math.random() * shuffledSources.length)];
      }
      
      usedSources.push(source.name);
      imagePromises.push(getAnimeImage(source));
    }
    
    console.log('使用API源:', usedSources.join(', '));
    
    // 等待所有图片请求完成
    const images = await Promise.all(imagePromises);
    
    // 缓存结果
    fs.writeFileSync(cacheFile, JSON.stringify(images));
    
    res.json(images);
  } catch (error) {
    console.error('获取推荐图片失败:', error);
    
    // 尝试使用本地图片
    try {
      const localImages = getRandomItems(LOCAL_IMAGES, 5).map(img => ({
        id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
        title: img.title,
        imageUrl: img.path,
        author: img.author,
        source: 'local'
      }));
      
      res.json(localImages);
    } catch (backupError) {
      res.status(500).json({ error: '获取推荐图片失败', details: error.message });
    }
  }
});

// 从指定源获取动漫图片
async function getAnimeImage(source) {
  try {
    const response = await axios.get(source.url, { 
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const imageUrl = source.getImageUrl(response.data);
    
    return {
      id: `${source.name}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      title: `${source.name} 二次元图片`,
      imageUrl: imageUrl,
      author: source.name,
      source: source.url
    };
  } catch (error) {
    console.error(`从 ${source.name} 获取图片失败:`, error.message);
    
    // 尝试使用备选API
    try {
      // 随机选择一个不同的API源
      const backupSources = ANIME_API_SOURCES.filter(s => s.name !== source.name);
      const backupSource = backupSources[Math.floor(Math.random() * backupSources.length)];
      
      console.log(`使用备选API: ${backupSource.name}`);
      
      const response = await axios.get(backupSource.url, { 
        timeout: 3000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      const imageUrl = backupSource.getImageUrl(response.data);
      
      return {
        id: `${backupSource.name}-backup-${Date.now()}`,
        title: `${backupSource.name} 二次元图片 (备选)`,
        imageUrl: imageUrl,
        author: backupSource.name,
        source: backupSource.url
      };
    } catch (backupError) {
      // 如果备选API也失败，返回占位图片
      console.error('备选API也失败:', backupError.message);
      return {
        id: `error-${Date.now()}`,
        title: "获取图片失败",
        imageUrl: "/placeholder-image.jpg",
        author: "系统",
        source: ""
      };
    }
  }
}

// API：获取特定类型的动漫图片
app.get('/api/anime-images/:type', async (req, res) => {
  try {
    const { type } = req.params;
    
    // 检查缓存
    const cacheFile = path.join(cacheDir, `image-type-${type}.json`);
    const currentTime = Date.now();
    const cacheMaxAge = 30 * 60 * 1000; // 30分钟缓存
    
    if (fs.existsSync(cacheFile)) {
      const cacheStats = fs.statSync(cacheFile);
      const cacheAge = currentTime - cacheStats.mtimeMs;
      
      if (cacheAge < cacheMaxAge) {
        try {
          const cachedData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
          console.log(`使用缓存的${type}类型图片`);
          return res.json(cachedData);
        } catch (err) {
          console.error('读取缓存文件失败:', err);
          // 继续获取新数据
        }
      }
    }
    
    let apiUrl = 'https://api.waifu.pics/sfw/waifu'; // 默认
    
    // 根据类型选择API
    if (type === 'neko') {
      apiUrl = 'https://nekos.best/api/v2/neko';
    } else if (type === 'kitsune') {
      apiUrl = 'https://nekos.best/api/v2/kitsune';
    } else if (type === 'husbando') {
      apiUrl = 'https://nekos.best/api/v2/husbando';
    }
    
    const response = await axios.get(apiUrl, { timeout: 5000 });
    
    let imageData = {};
    if (apiUrl.includes('nekos.best')) {
      imageData = {
        id: `nekos-${Date.now()}`,
        title: `${type} 图片`,
        imageUrl: response.data.results[0].url,
        artist: response.data.results[0].artist_name || '未知',
        source: response.data.results[0].source_url || apiUrl
      };
    } else {
      imageData = {
        id: `waifu-${Date.now()}`,
        title: `${type} 图片`,
        imageUrl: response.data.url,
        artist: 'waifu.pics',
        source: apiUrl
      };
    }
    
    // 缓存结果
    fs.writeFileSync(cacheFile, JSON.stringify(imageData));
    
    res.json(imageData);
  } catch (error) {
    console.error('获取图片失败:', error);
    res.status(500).json({ 
      error: '获取图片失败',
      imageUrl: '/placeholder-image.jpg'
    });
  }
});

// API：获取每日壁纸
app.get('/api/daily-wallpaper', async (req, res) => {
  try {
    // 获取今天的日期字符串作为缓存键
    const today = new Date().toISOString().split('T')[0];
    const cacheFile = path.join(cacheDir, `wallpaper-${today}.json`);
    
    // 检查是否有缓存
    if (fs.existsSync(cacheFile)) {
      const cachedData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
      console.log('使用缓存的每日壁纸');
      return res.json(cachedData);
    }
    
    // 基于日期字符串选择API源（确保每天都是同一个源，但每天会变化）
    const sourceIndex = parseInt(today.replace(/-/g, '')) % ANIME_API_SOURCES.length;
    const source = ANIME_API_SOURCES[sourceIndex];
    
    console.log(`今日壁纸使用 ${source.name} API`);
    
    const image = await getAnimeImage(source);
    
    const result = {
      ...image,
      title: `今日二次元壁纸 (${today})`,
      date: today
    };
    
    // 缓存结果
    fs.writeFileSync(cacheFile, JSON.stringify(result));
    
    res.json(result);
  } catch (error) {
    console.error('获取每日壁纸失败:', error);
    
    // 返回备用壁纸
    res.json({ 
      id: `local-${Date.now()}`,
      title: `今日二次元壁纸 (${new Date().toISOString().split('T')[0]})`,
      imageUrl: '/placeholder-image.jpg',
      author: '系统',
      date: new Date().toISOString().split('T')[0]
    });
  }
});

// API：获取本地图片库
app.get('/api/local-images', (req, res) => {
  // 随机选择指定数量的图片
  const count = parseInt(req.query.count) || 5;
  const randomImages = getRandomItems(LOCAL_IMAGES, count).map(img => ({
    id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
    title: img.title,
    imageUrl: img.path,
    author: img.author,
    source: 'local'
  }));
  
  res.json(randomImages);
});

// 辅助函数：从数组中随机获取指定数量的元素
function getRandomItems(array, count) {
  if (array.length <= count) return [...array];
  
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// 定期清理过期的缓存文件
function cleanupCache() {
  try {
    const files = fs.readdirSync(cacheDir);
    const currentTime = Date.now();
    const oneDay = 24 * 60 * 60 * 1000; // 24小时
    
    for (const file of files) {
      const filePath = path.join(cacheDir, file);
      const stats = fs.statSync(filePath);
      const fileAge = currentTime - stats.mtimeMs;
      
      // 删除超过一天的缓存文件
      if (fileAge > oneDay) {
        fs.unlinkSync(filePath);
        console.log(`删除过期缓存文件: ${file}`);
      }
    }
  } catch (error) {
    console.error('清理缓存失败:', error);
  }
}

// 每6小时清理一次缓存
setInterval(cleanupCache, 6 * 60 * 60 * 1000);

// 启动服务器
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
}); 