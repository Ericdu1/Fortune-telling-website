import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Button, Tag, Card, Tabs, Typography, Badge, Row, Col, Divider } from 'antd';
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
  TeamOutlined
} from '@ant-design/icons';
import { formatDate } from '../utils/date';
import { DailyFortune as DailyFortuneType } from '../types/fortune';
import { getDailyFortune } from '../utils/cache';
import AnimeRecommendation from './AnimeRecommendation';
import DailyWallpaperComponent from './DailyWallpaper';
import FortuneCharacter from './FortuneCharacter';
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
    flex-direction: column;
    gap: 1rem;
  }
`;

const StyledButton = styled(Button)`
  background: linear-gradient(45deg, #6b6bff, #8e8eff);
  border: none;
  color: white;
  height: 40px;
  padding: 0 2rem;
  
  @media (max-width: 480px) {
    width: 100%;
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

interface DailyFortuneProps {
  onBack: () => void;
  onShare: (result: DailyFortuneType) => void;
}

const characters = [
  {
    id: 'energetic',
    name: '元气少女',
    avatar: '/images/characters/energetic.jpg',
    personality: 'energetic',
    style: {
      primaryColor: '#FF6B6B',
      secondaryColor: '#FFFFFF',
      accent: '#FFD93D'
    }
  },
  {
    id: 'mysterious',
    name: '少女祈祷中...',
    avatar: '/images/suika-praying.gif',
    personality: 'mysterious',
    style: {
      primaryColor: '#6A67CE',
      secondaryColor: '#FFFFFF',
      accent: '#9681EB'
    }
  },
  {
    id: 'shy',
    name: '害羞书生',
    avatar: '/images/characters/shy.jpg',
    personality: 'shy',
    style: {
      primaryColor: '#98DDCA',
      secondaryColor: '#FFFFFF',
      accent: '#D5ECC2'
    }
  },
  {
    id: 'arrogant',
    name: '高傲贵族',
    avatar: '/images/characters/arrogant.jpg',
    personality: 'arrogant',
    style: {
      primaryColor: '#884A39',
      secondaryColor: '#FFFFFF',
      accent: '#C38154'
    }
  }
];

const getRandomCharacter = () => {
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters[randomIndex];
};

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
    }
  });

  const [loading, setLoading] = useState(true);
  const [activeTabKey, setActiveTabKey] = useState('1');
  const [showCollection, setShowCollection] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(getRandomCharacter());
  const [streakDays, setStreakDays] = useState(0);
  const [lastCheckedDate, setLastCheckedDate] = useState('');
  const [coinsBalance, setCoinsBalance] = useState(0);

  useEffect(() => {
    const fetchFortune = async () => {
      try {
        const dailyFortune = await getDailyFortune();
        setFortune(dailyFortune);
        
        saveToHistory(dailyFortune);
      } catch (error) {
        console.error('获取运势失败：', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
    
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
        
        <LuckMeter>
          <LuckTitle>今日运势指数</LuckTitle>
          <LuckStars>
            {'★'.repeat(fortune.luck)}{'☆'.repeat(5 - fortune.luck)}
          </LuckStars>
        </LuckMeter>
        
        <Content>{getFortuneText(fortune.content)}</Content>
        
        <TagsContainer>
          {fortune.tags.map((tag, index) => (
            <Tag key={index} color="gold">{tag}</Tag>
          ))}
        </TagsContainer>
      </FortuneCard>
      
      <FortuneCharacter 
        character={selectedCharacter} 
        fortune={fortune.content} 
      />
      
      <ActionsContainer>
        <ActionButton icon={<HeartOutlined />} onClick={handleFavorite}>
          收藏运势
        </ActionButton>
        <ActionButton icon={<ShareAltOutlined />} onClick={() => onShare(fortune)}>
          分享运势
        </ActionButton>
      </ActionsContainer>
    </TabContent>
  );
  
  // 二次元运势标签页
  const renderAnimeFortune = () => (
    <TabContent>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <CategoryCard
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <CategoryTitle>
              动画运势 <LevelBadge level={fortune.categories.anime.level}>{fortune.categories.anime.level}</LevelBadge>
            </CategoryTitle>
            <CategoryContent>
              <Paragraph style={{ color: '#e0e0e0' }}>{fortune.categories.anime.description}</Paragraph>
              {fortune.categories.anime.advice && (
                <CategoryAdvice>
                  <strong style={{ color: '#ffd700' }}>建议：</strong> {fortune.categories.anime.advice}
                </CategoryAdvice>
              )}
            </CategoryContent>
          </CategoryCard>
        </Col>
        
        <Col xs={24} sm={12}>
          <CategoryCard
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <CategoryTitle>
              游戏运势 <LevelBadge level={fortune.categories.game.level}>{fortune.categories.game.level}</LevelBadge>
            </CategoryTitle>
            <CategoryContent>
              <Paragraph style={{ color: '#e0e0e0' }}>{fortune.categories.game.description}</Paragraph>
              {fortune.categories.game.advice && (
                <CategoryAdvice>
                  <strong style={{ color: '#ffd700' }}>建议：</strong> {fortune.categories.game.advice}
                </CategoryAdvice>
              )}
            </CategoryContent>
          </CategoryCard>
        </Col>
      </Row>
      
      <FortuneCard
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <CategoryTitle>今日推荐</CategoryTitle>
        <RecommendGrid>
          {fortune.dailyRecommend?.anime && (
            <RecommendItem>
              <RecommendTitle>动画推荐</RecommendTitle>
              <div style={{ fontWeight: 'bold' }}>{fortune.dailyRecommend.anime.title}</div>
              <div>{fortune.dailyRecommend.anime.episode}</div>
              <div style={{ color: '#a0a0a0', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                {fortune.dailyRecommend.anime.reason}
              </div>
            </RecommendItem>
          )}
          
          {fortune.dailyRecommend?.game && (
            <RecommendItem>
              <RecommendTitle>游戏推荐</RecommendTitle>
              <div style={{ fontWeight: 'bold' }}>{fortune.dailyRecommend.game.title}</div>
              <div>{fortune.dailyRecommend.game.type}</div>
              <div style={{ color: '#a0a0a0', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                {fortune.dailyRecommend.game.reason}
              </div>
            </RecommendItem>
          )}
        </RecommendGrid>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <ActionButton 
            icon={<PlayCircleOutlined />} 
            onClick={() => setShowGame(true)}
          >
            运势小游戏
          </ActionButton>
        </div>
      </FortuneCard>
    </TabContent>
  );
  
  // 社交运势标签页
  const renderSocialFortune = () => (
    <TabContent>
      <CategoryCard
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <CategoryTitle>
          社交运势 <LevelBadge level={fortune.categories.social.level}>{fortune.categories.social.level}</LevelBadge>
        </CategoryTitle>
        <CategoryContent>
          <Paragraph style={{ color: '#e0e0e0', fontSize: '1.1rem', lineHeight: '1.8' }}>
            {fortune.categories.social.description}
          </Paragraph>
          {fortune.categories.social.advice && (
            <CategoryAdvice>
              <strong style={{ color: '#ffd700' }}>建议：</strong> {fortune.categories.social.advice}
            </CategoryAdvice>
          )}
        </CategoryContent>
      </CategoryCard>
      
      {fortune.events?.list && fortune.events.list.length > 0 && (
        <FortuneCard
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <CategoryTitle>今日活动</CategoryTitle>
          <div>
            {fortune.events.list.map((event, index) => (
              <div 
                key={index} 
                style={{ 
                  marginBottom: '1rem', 
                  padding: '0.8rem', 
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '8px'
                }}
              >
                <div style={{ color: '#ffd700', marginBottom: '0.5rem' }}>{event.title}</div>
                <div>{event.description}</div>
                {event.time && <div style={{ color: '#a0a0a0', fontSize: '0.9rem', marginTop: '0.5rem' }}>{event.time}</div>}
              </div>
            ))}
          </div>
        </FortuneCard>
      )}
    </TabContent>
  );
  
  // 创作运势标签页
  const renderCreativeFortune = () => (
    <TabContent>
      <CategoryCard
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <CategoryTitle>
          创作运势 <LevelBadge level={fortune.categories.create.level}>{fortune.categories.create.level}</LevelBadge>
        </CategoryTitle>
        <CategoryContent>
          <Paragraph style={{ color: '#e0e0e0', fontSize: '1.1rem', lineHeight: '1.8' }}>
            {fortune.categories.create.description}
          </Paragraph>
          {fortune.categories.create.advice && (
            <CategoryAdvice>
              <strong style={{ color: '#ffd700' }}>建议：</strong> {fortune.categories.create.advice}
            </CategoryAdvice>
          )}
        </CategoryContent>
      </CategoryCard>
      
      <ArtworkContainer>
        <CategoryTitle>今日美图</CategoryTitle>
        <ArtworkImage 
          src={fortune.dailyArtwork?.imageUrl} 
          alt={fortune.dailyArtwork?.title}
        />
        <ArtworkInfo>
          <div style={{ fontWeight: 'bold' }}>{fortune.dailyArtwork?.title}</div>
          <div>画师：{fortune.dailyArtwork?.artistName}</div>
          <div>Pixiv ID: {fortune.dailyArtwork?.id}</div>
        </ArtworkInfo>
      </ArtworkContainer>
      
      {fortune.dailyRecommend?.music && (
        <CategoryCard
          variants={fadeInVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <CategoryTitle>音乐推荐</CategoryTitle>
          <div style={{ fontWeight: 'bold' }}>{fortune.dailyRecommend.music.title}</div>
          <div>{fortune.dailyRecommend.music.artist}</div>
          {fortune.dailyRecommend.music.link && (
            <Button 
              type="link" 
              href={fortune.dailyRecommend.music.link} 
              target="_blank" 
              style={{ paddingLeft: 0, color: '#85a5ff' }}
            >
              在网易云音乐中收听
            </Button>
          )}
        </CategoryCard>
      )}
    </TabContent>
  );

  if (loading) {
    return (
      <Container>
        <Title>今日运势</Title>
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
              <DesktopOutlined /> 二次元
            </span>
          } 
          key="2"
        >
          <AnimatePresence mode="wait">
            {activeTabKey === '2' && renderAnimeFortune()}
          </AnimatePresence>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <TeamOutlined /> 社交
            </span>
          } 
          key="3"
        >
          <AnimatePresence mode="wait">
            {activeTabKey === '3' && renderSocialFortune()}
          </AnimatePresence>
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <BulbOutlined /> 创作
            </span>
          } 
          key="4"
        >
          <AnimatePresence mode="wait">
            {activeTabKey === '4' && renderCreativeFortune()}
          </AnimatePresence>
        </TabPane>
      </StyledTabs>

      <ButtonContainer>
        <StyledButton onClick={onBack}>
          <ArrowLeftOutlined /> 返回
        </StyledButton>
      </ButtonContainer>

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