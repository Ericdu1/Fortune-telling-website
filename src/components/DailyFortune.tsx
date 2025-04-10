import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Button, Tag, Card, Tabs, Typography, Badge, Row, Col, Divider, Modal, Rate } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftOutlined, 
  ShareAltOutlined, 
  CalendarOutlined, 
  StarOutlined, 
  BookOutlined,
  PlayCircleOutlined,
  HeartOutlined,
  FireOutlined,
  UserOutlined,
  DesktopOutlined,
  BulbOutlined,
  TeamOutlined,
  SyncOutlined,
  GiftOutlined,
  AimOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { formatDate } from '../utils/date';
import { DailyFortune as DailyFortuneType } from '../types/fortune';
import { getDailyFortune, clearDailyFortuneCache } from '../utils/cache';
import AnimeRecommendation from './AnimeRecommendation';
import DailyWallpaperComponent from './DailyWallpaper';
import StreakCounter from './StreakCounter';
import FortuneCardCollection from './FortuneCardCollection';
import FortuneGame from './FortuneGame';

const { Title: AntTitle, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
  color: white;
  
  @media (max-width: 768px) {
    padding: 1rem 0.8rem;
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: white;
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin-bottom: 1.5rem;
  
    &::before {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
  }
  
  .ant-tabs-tab {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1rem;
    padding: 0.5rem 1rem;
    transition: all 0.3s ease;
    
    &:hover {
      color: rgba(255, 255, 255, 0.9);
    }
    
    .ant-tabs-tab-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
  
  .ant-tabs-tab-active {
    .ant-tabs-tab-btn {
      color: #ffd700 !important;
    }
  }
  
  .ant-tabs-ink-bar {
    background: #ffd700;
  }
  
  @media (max-width: 768px) {
    .ant-tabs-tab {
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
      margin: 0 0.3rem 0 0;
    }
  }
`;

const FortuneCard = styled(motion.div)`
  background: linear-gradient(135deg, #6941C6, #3730A3);
  color: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 500px;
  margin: 0 auto 24px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
  }
`;

const DateDisplay = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
`;

const LuckMeter = styled.div`
  margin: 16px 0;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 8px;
`;

const LuckTitle = styled.div`
  font-size: 14px;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.9);
`;

const LuckStars = styled.div`
  font-size: 24px;
  color: gold;
  letter-spacing: 4px;
`;

const Content = styled.div`
  margin: 20px 0;
  font-size: 16px;
  line-height: 1.6;
  text-align: center;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  
  @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: 0.8rem;
  }
`;

const StyledButton = styled(Button)`
  background: linear-gradient(45deg, #6b6bff, #8e8eff);
  border: none;
  color: white;
  height: 40px;
  padding: 0 1.5rem;
  
  @media (max-width: 480px) {
    flex: 1;
    min-width: 30%;
  }
  
  &:hover {
    opacity: 0.9;
    color: white;
  }
`;

const CategoryCard = styled(FortuneCard)`
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1.2rem;
    margin-bottom: 1.2rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    margin-bottom: 1rem;
  }
`;

const CategoryTitle = styled.h3`
  color: #ffd700;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CategoryContent = styled.div`
  color: #e0e0e0;
  font-size: 1rem;
  line-height: 1.6;
`;

const LevelBadge = styled.span<{ level: 'SSR' | 'SR' | 'R' | 'N' }>`
  background: ${props => {
    switch (props.level) {
      case 'SSR': return 'linear-gradient(45deg, #FFD700, #FFA500)';
      case 'SR': return 'linear-gradient(45deg, #C0C0C0, #A0A0A0)';
      case 'R': return 'linear-gradient(45deg, #CD7F32, #8B4513)';
      case 'N': return 'linear-gradient(45deg, #808080, #696969)';
    }
  }};
  color: white;
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 12px;
  margin-left: 8px;
`;

const CategoryAdvice = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  border-left: 3px solid #ffd700;
`;

const TabContent = styled.div`
  padding: 0.5rem 0;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
  
  @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: 0.8rem;
  }
`;

const ActionButton = styled(Button)`
  background: linear-gradient(45deg, #6941C6, #3730A3);
  border: none;
  color: white;
  height: 40px;
  padding: 0 1.5rem;
  
  @media (max-width: 480px) {
    flex: 1;
    min-width: 45%;
    padding: 0 1rem;
  }
  
  &:hover {
    opacity: 0.9;
    color: white;
  }
`;

const RecommendGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 1.5rem 0;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const RecommendItem = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const RecommendTitle = styled.h4`
  color: #ffd700;
  font-size: 1.1rem;
  margin-bottom: 0.8rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
  padding-bottom: 0.5rem;
`;

const ArtworkContainer = styled.div`
  margin: 2rem 0;
  text-align: center;
`;

const ArtworkImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const ArtworkInfo = styled.div`
  color: #e0e0e0;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const CharacterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
  text-align: center;
`;

const CharacterImageContainer = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.1);
  padding: 10px;
`;

const CharacterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const CharacterName = styled.div`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 8px;
  font-weight: 500;
`;

const StatusList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const StatusItem = styled(motion.li)`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const StatusIcon = styled.span`
  margin-right: 0.5rem;
`;

const StatusText = styled.span`
  font-size: 1rem;
`;

interface DailyFortuneProps {
  onBack: () => void;
  onShare: (result: DailyFortuneType) => void;
}

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 }
  }
};

const getFortuneText = (fortune: string) => {
  const fortuneTexts: Record<string, string> = {
    '大吉': '今天是个超级幸运日！✨ 好运就像春天的樱花一样绽放，所有事情都会顺风顺水。记得把握机会，说不定会有意想不到的惊喜哦！',
    '吉': '今天运势不错呢！🌸 虽然可能不会有大惊喜，但小确幸会不断出现。保持积极的心态，好事自然会来敲门。',
    '中吉': '今天运势平稳，就像平静的湖面一样。🌊 虽然不会有太大波澜，但也不会有什么大问题。保持平常心，享受当下吧！',
    '小吉': '今天运势一般，但别担心！🌱 就像春天的嫩芽，虽然现在看起来不起眼，但未来可期。保持耐心，好运终会到来。',
    '末吉': '今天运势有点小波动，但别太在意！🌦️ 就像天气一样，阴晴不定是正常的。保持乐观，明天会更好！',
    '凶': '今天运势不太理想，但别灰心！🌪️ 就像暴风雨过后总会见到彩虹，困难只是暂时的。保持坚强，一切都会好起来的。',
    '大凶': '今天运势不太好，但请记住：🌧️ 雨过天晴，阳光总在风雨后。保持冷静，谨慎行事，一切都会过去的。'
  };
  return fortuneTexts[fortune] || '今天运势平稳，保持平常心。';
};

const getFortuneImage = (fortune: string) => {
  const fortuneImages: Record<string, string> = {
    '大吉': 'https://i.pixiv.re/img-original/img/2023/12/15/00/00/00/1145141919_p0.png',
    '吉': 'https://i.pixiv.re/img-original/img/2023/12/15/00/00/00/1145141920_p0.png',
    '中吉': 'https://i.pixiv.re/img-original/img/2023/12/15/00/00/00/1145141921_p0.png',
    '小吉': 'https://i.pixiv.re/img-original/img/2023/12/15/00/00/00/1145141922_p0.png',
    '末吉': 'https://i.pixiv.re/img-original/img/2023/12/15/00/00/00/1145141923_p0.png',
    '凶': 'https://i.pixiv.re/img-original/img/2023/12/15/00/00/00/1145141924_p0.png',
    '大凶': 'https://i.pixiv.re/img-original/img/2023/12/15/00/00/00/1145141925_p0.png'
  };
  return fortuneImages[fortune] || 'https://i.pixiv.re/img-original/img/2023/12/15/00/00/00/1145141926_p0.png';
};

const getFortuneColor = (fortune: string) => {
  const fortuneColors: Record<string, string> = {
    '大吉': '#FF6B6B', // 更鲜艳的红色
    '吉': '#FFB6C1', // 柔和的粉色
    '中吉': '#98FB98', // 清新的绿色
    '小吉': '#87CEEB', // 天空蓝
    '末吉': '#DDA0DD', // 淡紫色
    '凶': '#A9A9A9', // 灰色
    '大凶': '#696969' // 深灰色
  };
  return fortuneColors[fortune] || '#D3D3D3';
};

const getFortuneEmoji = (fortune: string) => {
  const fortuneEmojis: Record<string, string> = {
    '大吉': '✨', // 星星
    '吉': '🌸', // 樱花
    '中吉': '🌊', // 波浪
    '小吉': '🌱', // 嫩芽
    '末吉': '🌦️', // 多云
    '凶': '🌪️', // 龙卷风
    '大凶': '🌧️' // 下雨
  };
  return fortuneEmojis[fortune] || '🌤️';
};

const getFortuneAdvice = (fortune: string) => {
  const fortuneAdvice: Record<string, string> = {
    '大吉': '今天是个好日子，不妨尝试一些新事物，说不定会有意外收获！',
    '吉': '保持积极乐观的心态，好运自然会来敲门。',
    '中吉': '稳扎稳打，一步一个脚印，成功就在不远处。',
    '小吉': '保持耐心，好事多磨，终会迎来转机。',
    '末吉': '谨慎行事，三思而后行，避免冲动决定。',
    '凶': '保持冷静，遇事不慌，困难终会过去。',
    '大凶': '今天宜静不宜动，保持低调，等待时机。'
  };
  return fortuneAdvice[fortune] || '保持平常心，顺其自然。';
};

const getFortuneCharacter = (fortune: string) => {
  const fortuneCharacters: Record<string, { name: string, image: string, description: string }> = {
    '大吉': {
      name: '萃香',
      image: 'C:/Users/ericd/OneDrive/图片/网站图片/萃香祈祷中.gif',
      description: '萃香正在为你祈祷，带来好运和祝福！'
    },
    '吉': {
      name: '灵梦',
      image: 'https://i.pixiv.re/img-original/img/2023/12/15/00/00/00/1145141927_p0.png',
      description: '灵梦正在为你祈福，带来平安和喜乐！'
    },
    '中吉': {
      name: '魔理沙',
      image: 'https://i.pixiv.re/img-original/img/2023/12/15/00/00/00/1145141928_p0.png',
      description: '魔理沙正在施展魔法，为你带来好运！'
    },
    '小吉': {
      name: '咲夜',
      image: 'https://i.pixiv.re/img-original/img/2023/12/15/00/00/00/1145141929_p0.png',
      description: '咲夜正在为你准备幸运的茶点！'
    },
    '末吉': {
      name: '帕秋莉',
      image: 'https://i.pixiv.re/img-original/img/2023/12/15/00/00/00/1145141930_p0.png',
      description: '帕秋莉正在研究幸运的魔法！'
    },
    '凶': {
      name: '蕾米莉亚',
      image: 'https://i.pixiv.re/img-original/img/2023/12/15/00/00/00/1145141931_p0.png',
      description: '蕾米莉亚正在为你驱散厄运！'
    },
    '大凶': {
      name: '芙兰朵露',
      image: 'https://i.pixiv.re/img-original/img/2023/12/15/00/00/00/1145141932_p0.png',
      description: '芙兰朵露正在为你打破厄运的枷锁！'
    }
  };
  return fortuneCharacters[fortune] || {
    name: '神秘少女',
    image: 'https://i.pixiv.re/img-original/img/2023/12/15/00/00/00/1145141933_p0.png',
    description: '神秘少女正在为你祈祷！'
  };
};

const generateBasicFortuneContent = (categories: DailyFortuneType['categories']) => {
  let content = '今日运势：\n';

  Object.entries(categories).forEach(([key, category]) => {
    content += `• ${category.name}：${category.level}\n`;
  });

  content += '\n总结：今天的运势整体较为平稳，适合保持现状，谨慎行事。';

  return content;
};

const generateMysticMessage = (categories: DailyFortuneType['categories']) => {
  const messages = [
    '今天是个好日子，适合尝试新事物！',
    '保持积极乐观的心态，好运自然会来敲门。',
    '稳扎稳打，一步一个脚印，成功就在不远处。',
    '保持耐心，好事多磨，终会迎来转机。',
    '谨慎行事，三思而后行，避免冲动决定。',
    '保持冷静，遇事不慌，困难终会过去。',
    '今天宜静不宜动，保持低调，等待时机。'
  ];

  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};

// 添加函数将运势等级转换为文本显示
const getFortuneLevelText = (level: string): string => {
  switch(level) {
    case 'SSR':
      return '大吉';
    case 'SR':
      return '吉';
    case 'R':
      return '小凶';
    case 'N':
      return '凶';
    default:
      return '普通';
  }
};

const DiceIcon = SyncOutlined;

// 添加LuckyHint组件
const LuckyHint: React.FC = () => {
  // 生成随机幸运色
  const luckyColors = ['红色', '蓝色', '绿色', '黄色', '紫色', '粉色', '橙色', '金色', '银色', '白色'];
  const luckyColor = luckyColors[Math.floor(Math.random() * luckyColors.length)];
  
  // 生成随机幸运数字
  const luckyNumber = Math.floor(Math.random() * 100) + 1;
  
  // 幸运关键词
  const luckyKeywords = ['创新', '坚持', '冒险', '沉稳', '热情', '专注', '放松', '温暖', '谦虚', '果断'];
  const luckyKeyword = luckyKeywords[Math.floor(Math.random() * luckyKeywords.length)];
  
  // 今日宜忌
  const goodActivities = ['学习新技能', '户外活动', '社交聚会', '创作', '冥想', '阅读', '旅行', '购物', '运动', '娱乐'];
  const badActivities = ['熬夜', '冲动消费', '争执', '做重大决定', '复杂操作', '高风险活动', '拖延', '过度劳累', '暴饮暴食'];
  
  const goodActivity1 = goodActivities[Math.floor(Math.random() * goodActivities.length)];
  let goodActivity2 = goodActivities[Math.floor(Math.random() * goodActivities.length)];
  while (goodActivity2 === goodActivity1) {
    goodActivity2 = goodActivities[Math.floor(Math.random() * goodActivities.length)];
  }
  
  const badActivity1 = badActivities[Math.floor(Math.random() * badActivities.length)];
  let badActivity2 = badActivities[Math.floor(Math.random() * badActivities.length)];
  while (badActivity2 === badActivity1) {
    badActivity2 = badActivities[Math.floor(Math.random() * badActivities.length)];
  }
  
  // 行为引导
  const behaviors = [
    '适度挑战自我，不要给自己过大压力',
    '多与朋友交流，分享心情可以缓解压力',
    '尝试新事物，可能会有意外收获',
    '保持耐心，好事多磨',
    '今天是反思的好时机，回顾过去的得失',
    '保持乐观心态，积极面对挑战',
    '适当放松，不要给自己太大压力',
    '珍惜当下，感恩生活中的美好',
    '相信自己的直觉，大胆决策',
    '保持谦虚，向他人学习'
  ];
  const behavior = behaviors[Math.floor(Math.random() * behaviors.length)];
  
  return (
    <TabContent>
      <CategoryCard
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <CategoryTitle>今日幸运提示</CategoryTitle>
        <CategoryContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ color: '#ffd700', marginBottom: '5px' }}>🎨 幸运色：</div>
              <div>{luckyColor}</div>
            </div>
            
            <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ color: '#ffd700', marginBottom: '5px' }}>🔢 幸运数字：</div>
              <div>{luckyNumber}</div>
            </div>
            
            <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ color: '#ffd700', marginBottom: '5px' }}>🔑 幸运关键词：</div>
              <div>{luckyKeyword}</div>
            </div>
            
            <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ color: '#ffd700', marginBottom: '5px' }}>✅ 今日宜：</div>
              <div>{goodActivity1}、{goodActivity2}</div>
            </div>
            
            <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ color: '#ffd700', marginBottom: '5px' }}>❌ 今日忌：</div>
              <div>{badActivity1}、{badActivity2}</div>
            </div>
            
            <CategoryAdvice>
              <strong style={{ color: '#ffd700' }}>行为引导：</strong> {behavior}
            </CategoryAdvice>
          </div>
        </CategoryContent>
      </CategoryCard>
    </TabContent>
  );
};

const DailyFortune: React.FC<DailyFortuneProps> = ({ onBack, onShare }) => {
  const [fortune, setFortune] = useState<DailyFortuneType>({
    date: formatDate(),
    content: '正在加载今日运势...',
    luck: 0,
    tags: [],
    categories: {
      game: { name: '游戏运势', level: 'N', description: '加载中...', advice: '请稍候' },
      anime: { name: '动画运势', level: 'N', description: '加载中...', advice: '请稍候' },
      create: { name: '创作运势', level: 'N', description: '加载中...', advice: '请稍候' },
      social: { name: '社交运势', level: 'N', description: '加载中...', advice: '请稍候' }
    },
    dailyRecommend: {
      anime: undefined,
      game: undefined,
      music: undefined
    },
    events: {
      animeUpdates: [],
      gameEvents: [],
      birthdays: [],
      releases: [],
      list: []
    },
    dailyArtwork: {
      id: '',
      title: '加载中...',
      artistId: '',
      artistName: '加载中...',
      imageUrl: './images/artworks/127455493_p0.png'
    },
    mysticMessage: '加载中...'
  });

  const [loading, setLoading] = useState(true);
  const [activeTabKey, setActiveTabKey] = useState('1');
  const [showCollection, setShowCollection] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [streakDays, setStreakDays] = useState(0);
  const [lastCheckedDate, setLastCheckedDate] = useState('');
  const [coinsBalance, setCoinsBalance] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;  // 更新为4个标签页

  useEffect(() => {
    const fetchFortune = async () => {
      try {
        await clearDailyFortuneCache();
        const dailyFortune = await getDailyFortune();
        
        // 计算综合运势指数
        const levels = Object.values(dailyFortune.categories).map(category => {
          switch (category.level) {
            case 'SSR': return 5;
            case 'SR': return 4;
            case 'R': return 3;
            case 'N': return 2;
            default: return 1;
          }
        });
        const averageLuck = Math.round(levels.reduce((a, b) => a + b, 0) / levels.length);
        
        // 动态生成总结和神秘签文
        const summary = averageLuck >= 4 ? '今天的运势非常好，适合尝试新事物！' : averageLuck >= 3 ? '今天的运势不错，保持积极心态。' : '今天运势一般，谨慎行事。';
        const mysticMessage = generateMysticMessage(dailyFortune.categories);
        
        setFortune({ ...dailyFortune, luck: averageLuck, content: summary, mysticMessage });
        
        saveToHistory(dailyFortune);
      } catch (error) {
        console.error('获取运势失败：', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
    handleCheckin(); // 自动签到
    
    fetchFortune();
  }, []);

  const saveToHistory = (fortune: DailyFortuneType) => {
    try {
      const historyString = localStorage.getItem('fortune-history');
      let history: DailyFortuneType[] = [];
      
      if (historyString) {
        history = JSON.parse(historyString);
      }
      
      const existingIndex = history.findIndex(item => item.date === fortune.date);
      
      if (existingIndex === -1) {
        history.push(fortune);
        if (history.length > 30) {
          history = history.slice(history.length - 30);
        }
        localStorage.setItem('fortune-history', JSON.stringify(history));
      }
    } catch (error) {
      console.error('保存历史记录失败：', error);
    }
  };

  const loadUserData = () => {
    try {
      const lastChecked = localStorage.getItem('last-checkin-date') || '';
      setLastCheckedDate(lastChecked);
      
      const streak = parseInt(localStorage.getItem('checkin-streak') || '0');
      setStreakDays(streak);
      
      const coins = parseInt(localStorage.getItem('fortune-coins') || '0');
      setCoinsBalance(coins);
    } catch (error) {
      console.error('加载用户数据失败：', error);
    }
  };

  const handleCheckin = () => {
    const today = formatDate();
    
    localStorage.setItem('last-checkin-date', today);
    
    if (isConsecutiveDay(lastCheckedDate, today)) {
      const newStreak = streakDays + 1;
      setStreakDays(newStreak);
      localStorage.setItem('checkin-streak', newStreak.toString());
    } else {
      setStreakDays(1);
      localStorage.setItem('checkin-streak', '1');
    }
    
    setLastCheckedDate(today);
    
    const newBalance = coinsBalance + 5;
    setCoinsBalance(newBalance);
    localStorage.setItem('fortune-coins', newBalance.toString());
  };

  const isConsecutiveDay = (lastDate: string, currentDate: string): boolean => {
    if (!lastDate) return false;
    
    const lastDateObj = new Date(lastDate);
    const currentDateObj = new Date(currentDate);
    
    lastDateObj.setHours(0, 0, 0, 0);
    currentDateObj.setHours(0, 0, 0, 0);
    
    const diffTime = currentDateObj.getTime() - lastDateObj.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    return diffDays === 1;
  };

  const handleFavorite = () => {
    try {
      const favoritesString = localStorage.getItem('fortune-favorites');
      let favorites: DailyFortuneType[] = [];
      
      if (favoritesString) {
        favorites = JSON.parse(favoritesString);
      }
      
      const existingIndex = favorites.findIndex(item => item.date === fortune.date);
      
      if (existingIndex === -1) {
        favorites.push(fortune);
        localStorage.setItem('fortune-favorites', JSON.stringify(favorites));
      }
      
      setShowCollection(true);
    } catch (error) {
      console.error('收藏运势失败：', error);
    }
  };

  // 主要运势内容标签页
  const renderBasicFortune = () => (
    <TabContent>
      <FortuneCard
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <DateDisplay>
          <CalendarOutlined style={{ marginRight: '8px' }} />
          {fortune.date}
        </DateDisplay>
        
        <CharacterContainer>
          <CharacterImageContainer>
            <CharacterImage src="/images/suika-praying.gif" alt="少女祈祷中..." />
          </CharacterImageContainer>
          <CharacterName>少女祈祷中...</CharacterName>
        </CharacterContainer>
        
        <LuckMeter>
          <LuckTitle>今日综合运势</LuckTitle>
          <LuckStars>
            {'★'.repeat(fortune.luck)}{'☆'.repeat(5 - fortune.luck)}
          </LuckStars>
        </LuckMeter>
        
        <Content>
          <div>🎲 抽卡运势：{getFortuneLevelText(fortune.categories.game.level)}</div>
          <div>🗣 社交运势：{getFortuneLevelText(fortune.categories.social.level)}</div>
          <div>📦 财运运势：{getFortuneLevelText(fortune.categories.create.level)}</div>
          <div>🎯 直觉运势：{getFortuneLevelText(fortune.categories.anime.level)}</div>
          <div>🌟 今日综合运势：{'★'.repeat(fortune.luck)}{'☆'.repeat(5 - fortune.luck)}</div>
          <div>🔮 神秘签文：{fortune.mysticMessage}</div>
        </Content>
        
        <TagsContainer>
          {fortune.tags.map((tag, index) => (
            <Tag key={index} color="gold">{tag}</Tag>
          ))}
        </TagsContainer>
      </FortuneCard>
    </TabContent>
  );
  
  // 星座运势标签页
  const ZodiacFortune: React.FC = () => {
    const [birthday, setBirthday] = useState(localStorage.getItem('user-birthday') || '');
    const [showModal, setShowModal] = useState(!birthday);

    const handleBirthdaySubmit = (date) => {
      localStorage.setItem('user-birthday', date);
      setBirthday(date);
      setShowModal(false);
    };

    const resetBirthday = () => {
      localStorage.removeItem('user-birthday');
      setShowModal(true);
    };

    return (
      <TabContent>
        <Modal visible={showModal} onCancel={() => setShowModal(false)} footer={null}>
          <div style={{ textAlign: 'center' }}>
            <input type="date" onChange={(e) => handleBirthdaySubmit(e.target.value)} />
            <Button onClick={() => setShowModal(false)}>确认</Button>
            <div>系统将自动记住你，下次无需填写~✨</div>
          </div>
        </Modal>
        {!showModal && (
          <CategoryCard
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <CategoryTitle>
              星座运势 <LevelBadge level={fortune.categories.zodiac?.level}>{fortune.categories.zodiac?.level}</LevelBadge>
            </CategoryTitle>
            <CategoryContent>
              <Paragraph style={{ color: '#e0e0e0' }}>今天是个适合与人交流的日子，可能会有意外的惊喜。</Paragraph>
              <CategoryAdvice>
                <strong style={{ color: '#ffd700' }}>建议：</strong> 保持开放的心态，迎接新机会。
              </CategoryAdvice>
            </CategoryContent>
            <Button onClick={resetBirthday}>重新设置生日</Button>
          </CategoryCard>
        )}
      </TabContent>
    );
  };

  const AnimalFortune: React.FC = () => {
    const [showModal, setShowModal] = useState(true);

    const handleModalClose = () => {
      setShowModal(false);
    };

    return (
      <TabContent>
        <Modal visible={showModal} onCancel={handleModalClose} footer={null}>
          <div style={{ textAlign: 'center' }}>
            <input type="date" onChange={() => handleModalClose()} />
            <Button onClick={handleModalClose}>确认</Button>
            <div>系统将自动记住你，下次无需填写~✨</div>
          </div>
        </Modal>
        {!showModal && (
          <CategoryCard
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <CategoryTitle>
              生肖运势 <LevelBadge level={fortune.categories.animal?.level}>{fortune.categories.animal?.level}</LevelBadge>
            </CategoryTitle>
            <CategoryContent>
              <Paragraph style={{ color: '#e0e0e0' }}>今天可能会遇到一些挑战，但也有机会展现你的能力。</Paragraph>
              <CategoryAdvice>
                <strong style={{ color: '#ffd700' }}>建议：</strong> 勇敢面对，积极应对挑战。
              </CategoryAdvice>
            </CategoryContent>
          </CategoryCard>
        )}
      </TabContent>
    );
  };

  // 处理页面导航
  const handlePageChange = (direction: 'prev' | 'next') => {
    // 根据当前标签页计算下一个标签页
    const currentTab = parseInt(activeTabKey);
    let newTab: number;
    
    if (direction === 'prev') {
      newTab = currentTab > 1 ? currentTab - 1 : 4;  // 循环到最后一个标签页
    } else {
      newTab = currentTab < 4 ? currentTab + 1 : 1;  // 循环到第一个标签页
    }
    
    // 设置新的标签页
    setActiveTabKey(newTab.toString());
  };

  if (loading) {
    return (
      <Container>
        <Title>每日运势</Title>
        <div style={{ textAlign: 'center', color: '#ffd700', marginTop: '2rem' }}>
          正在为您抽取今日运势...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <StreakCounter 
        streakDays={streakDays} 
        lastCheckedDate={lastCheckedDate}
        onCheckin={handleCheckin}
      />
      
      <Title>每日运势</Title>
      
      <StyledTabs 
        defaultActiveKey="1" 
        activeKey={activeTabKey}
        onChange={setActiveTabKey}
        centered
      >
        <TabPane 
          tab={
            <span>
              <CalendarOutlined /> 基础运势
            </span>
          } 
          key="1"
        >
          <AnimatePresence mode="wait">
            {activeTabKey === '1' && renderBasicFortune()}
          </AnimatePresence>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <StarOutlined /> 星座
            </span>
          } 
          key="2"
        >
          <AnimatePresence mode="wait">
            {activeTabKey === '2' && <ZodiacFortune />}
          </AnimatePresence>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <UserOutlined /> 生肖
            </span>
          } 
          key="3"
        >
          <AnimatePresence mode="wait">
            {activeTabKey === '3' && <AnimalFortune />}
          </AnimatePresence>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <BulbOutlined /> 幸运提示
            </span>
          } 
          key="4"
        >
          <AnimatePresence mode="wait">
            {activeTabKey === '4' && <LuckyHint />}
          </AnimatePresence>
        </TabPane>
      </StyledTabs>

      <ButtonContainer>
        <StyledButton onClick={() => handlePageChange('prev')}>
          <ArrowLeftOutlined /> 上一页
        </StyledButton>
        
        <StyledButton icon={<HeartOutlined />} onClick={handleFavorite}>
          收藏运势
        </StyledButton>
        
        <StyledButton icon={<ShareAltOutlined />} onClick={() => onShare(fortune)}>
          分享运势
        </StyledButton>
        
        <StyledButton onClick={() => handlePageChange('next')}>
          下一页 <ArrowRightOutlined />
        </StyledButton>
      </ButtonContainer>
      
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <StyledButton onClick={onBack}>
          返回主页
        </StyledButton>
      </div>

      <FortuneCardCollection 
        visible={showCollection}
        onClose={() => setShowCollection(false)}
      />
      
      <FortuneGame
        visible={showGame}
        onClose={() => setShowGame(false)}
        dailyFortune={fortune}
      />
    </Container>
  );
};

export default DailyFortune; 