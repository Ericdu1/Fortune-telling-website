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

// 添加TabType类型定义
type TabType = 'overall' | 'zodiac' | 'animal' | 'lucky';

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
  background: linear-gradient(135deg, rgba(105, 65, 198, 0.3), rgba(55, 48, 163, 0.3));
  color: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
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

const CategoryTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  h3 {
    margin: 0;
    color: #ffd700;
    font-size: 20px;
  }
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

const ZodiacAnalysis = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
`;

const AnalysisTitle = styled.h3`
  color: #ffd700;
  margin-bottom: 15px;
  font-size: 18px;
`;

const AnalysisContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

const AnalysisItem = styled(motion.div)`
  background: rgba(0, 0, 0, 0.2);
  padding: 20px;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    background: rgba(0, 0, 0, 0.3);
  }
`;

const AnalysisLabel = styled.div`
  color: #ffd700;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
`;

const AnalysisValue = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
`;

const StarRating = styled.div`
  display: flex;
  gap: 4px;
  color: #ffd700;
  font-size: 18px;
`;

const ContentText = styled(Text)`
  display: block;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: 12px;
  white-space: pre-line;
`;

const AdviceText = styled(Text)`
  display: block;
  color: #ffd700;
  font-size: 14px;
  line-height: 1.6;
  padding: 10px;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 6px;
  border-left: 3px solid #ffd700;
`;

const TrendChart = styled.div`
  height: 200px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
`;

const AnimalAnalysis = styled(ZodiacAnalysis)`
  background: rgba(255, 255, 255, 0.1);
`;

const Star = styled.span<{ filled: boolean }>`
  color: ${props => props.filled ? '#ffd700' : 'rgba(255, 255, 255, 0.3)'};
  font-size: 18px;
`;

const ResetButton = styled(Button)`
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  padding: 4px 12px;
  height: 28px;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    color: #ffd700;
    border-color: #ffd700;
    background: rgba(255, 215, 0, 0.1);
  }

  .anticon {
    font-size: 12px;
  }
`;

const MainContent = styled.div`
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  margin: 20px 0;
  position: relative;
`;

const Description = styled(Text)`
  display: block;
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  line-height: 1.6;
  margin: 16px 0;
  text-align: center;
`;

const DetailedAnalysis = styled.div`
  margin-top: 15px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

const AnalysisSection = styled.div`
  margin-bottom: 15px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const TabNav = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const TabButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? '#ffd700' : 'transparent'};
  border: none;
  color: ${props => props.active ? '#1a1a1a' : 'rgba(255, 255, 255, 0.7)'};
  font-size: 1rem;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? '#ffd700' : 'rgba(255, 255, 255, 0.1)'};
    color: ${props => props.active ? '#1a1a1a' : 'rgba(255, 255, 255, 0.9)'};
  }
`;

const renderStars = (rating: string) => {
  const stars = [];
  const filledStars = rating.split('★').length - 1;
  const emptyStars = 5 - filledStars;

  for (let i = 0; i < filledStars; i++) {
    stars.push(<Star key={`filled-${i}`} filled>★</Star>);
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Star key={`empty-${i}`} filled={false}>☆</Star>);
  }

  return <StarRating>{stars}</StarRating>;
};

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
  const [activeTab, setActiveTab] = useState<TabType>('overall');
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

    const handleModalClose = () => {
      localStorage.removeItem('user-birthday');
      setShowModal(true);
    };

    const renderZodiacAnalysis = (zodiac: string) => {
      const analysis = {
        overall: '★★★★☆',
        love: '★★★☆☆',
        career: '★★★★☆',
        wealth: '★★★☆☆',
        health: '★★★★☆',
        luck: '★★★☆☆'
      };

      const detailedAnalysis = {
        overall: {
          title: '整体运势',
          content: '今天的整体运势不错，适合处理重要事务。保持积极乐观的心态，会有意外的惊喜。',
          advice: '把握机会，相信自己的判断。'
        },
        love: {
          title: '爱情运势',
          content: '单身者可能会遇到心动的对象，已有伴侣的要注意沟通方式。',
          advice: '保持真诚，表达自己的感受。'
        },
        career: {
          title: '事业运势',
          content: '工作上会遇到新的挑战，但这也是展现能力的好机会。团队合作会带来不错的成果。',
          advice: '主动承担责任，展现领导力。'
        },
        wealth: {
          title: '财运运势',
          content: '财运稳定，可能有意外收获。投资理财需要谨慎，避免冲动消费。',
          advice: '合理规划支出，关注长期投资。'
        },
        health: {
          title: '健康运势',
          content: '身体状况良好，但要注意作息规律。适当的运动能提升精神状态。',
          advice: '保持规律作息，注意饮食均衡。'
        },
        luck: {
          title: '幸运指数',
          content: '今日幸运颜色：蓝色\n幸运数字：6、8\n吉利方位：东南方',
          advice: '佩戴蓝色饰品能增添好运。'
        }
      };

      return (
        <ZodiacAnalysis>
          <AnalysisTitle>深度运势分析</AnalysisTitle>
          <AnalysisContent>
            {Object.entries(analysis).map(([key, value], index) => (
              <AnalysisItem
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AnalysisLabel>{detailedAnalysis[key].title}</AnalysisLabel>
                <AnalysisValue>{renderStars(value)}</AnalysisValue>
                <DetailedAnalysis>
                  <AnalysisSection>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      {detailedAnalysis[key].content}
                    </Text>
                  </AnalysisSection>
                  <AnalysisSection>
                    <AnalysisTitle>
                      <BulbOutlined />
                      建议
                    </AnalysisTitle>
                    <Text style={{ color: '#ffd700' }}>
                      {detailedAnalysis[key].advice}
                    </Text>
                  </AnalysisSection>
                </DetailedAnalysis>
              </AnalysisItem>
            ))}
          </AnalysisContent>
          <TrendChart>
            运势趋势图表（待实现）
          </TrendChart>
        </ZodiacAnalysis>
      );
    };

    return (
      <TabContent>
        <MainContent>
          <ResetButton onClick={() => setShowModal(true)}>
            <SyncOutlined /> 重设生日
          </ResetButton>
          <Description>
            今天是个适合与人交流的日子，可能会有意外的惊喜。
          </Description>
          <div style={{ 
            background: 'rgba(255, 215, 0, 0.1)',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <Text style={{ color: '#ffd700' }}>
              <BulbOutlined style={{ marginRight: 8 }} />
              建议：保持开放的心态，迎接新机会。
            </Text>
          </div>
        </MainContent>
        {renderZodiacAnalysis(fortune.categories.zodiac?.name || '')}
        <Modal 
          visible={showModal} 
          onCancel={handleModalClose} 
          footer={null}
          width={300}
          style={{ 
            textAlign: 'center',
            borderRadius: '12px',
            overflow: 'hidden'
          }}
          bodyStyle={{
            padding: '24px'
          }}
        >
          <div>
            <h3 style={{ 
              color: '#1a1a1a', 
              marginBottom: '20px',
              fontSize: '18px'
            }}>
              设置生日
            </h3>
            <input 
              type="date" 
              onChange={handleBirthdaySubmit}
              style={{ 
                width: '100%',
                padding: '8px',
                marginBottom: '16px',
                borderRadius: '6px',
                border: '1px solid #d9d9d9'
              }}
            />
            <Button 
              type="primary" 
              onClick={handleModalClose}
              style={{ 
                width: '100%',
                height: '36px',
                borderRadius: '6px',
                background: 'linear-gradient(45deg, #6b6bff, #8e8eff)'
              }}
            >
              确认
            </Button>
            <div style={{ 
              marginTop: '12px',
              fontSize: '12px',
              color: 'rgba(0, 0, 0, 0.45)'
            }}>
              系统将自动记住你的选择 ✨
            </div>
          </div>
        </Modal>
      </TabContent>
    );
  };

  const AnimalFortune: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [fortune, setFortune] = useState<DailyFortuneType>({
      date: new Date().toISOString(),
      content: '',
      luck: 0,
      tags: [],
      dailyRecommend: {
        anime: undefined,
        game: undefined,
        music: undefined
      },
      mysticMessage: '',
      categories: {
        animal: {
          name: '',
          level: 'N',
          description: ''
        },
        game: {
          name: '',
          level: 'N',
          description: ''
        },
        anime: {
          name: '',
          level: 'N',
          description: ''
        },
        create: {
          name: '',
          level: 'N',
          description: ''
        },
        social: {
          name: '',
          level: 'N',
          description: ''
        }
      }
    });

    const handleModalClose = () => {
      setShowModal(false);
    };

    const renderAnimalAnalysis = (animal: string) => {
      const analysis = {
        overall: '★★★★☆',
        career: '★★★☆☆',
        wealth: '★★★★☆',
        love: '★★★☆☆',
        health: '★★★★☆',
        compatibility: '★★★☆☆'
      };

      const detailedAnalysis = {
        overall: {
          title: '整体运势',
          content: '今日运势平稳，适合规划和执行重要计划。保持冷静理性的态度，会有不错的收获。',
          advice: '把握当下，循序渐进。'
        },
        career: {
          title: '事业运势',
          content: '职场上可能会遇到新的机遇，团队协作顺利。注意把握细节，展现专业能力。',
          advice: '保持专注，注重细节。'
        },
        wealth: {
          title: '财运运势',
          content: '财运较好，可能有额外收入。投资方面要保持谨慎，避免冒险。',
          advice: '稳健理财，适度消费。'
        },
        love: {
          title: '感情运势',
          content: '感情生活平稳，与伴侣沟通顺畅。单身者可能会遇到有趣的人。',
          advice: '保持真诚，珍惜缘分。'
        },
        health: {
          title: '健康运势',
          content: '身体状况良好，但要注意劳逸结合。适当运动能提升身心状态。',
          advice: '规律作息，适度运动。'
        },
        compatibility: {
          title: '贵人运势',
          content: '今日贵人星座：金牛座、天蝎座\n相配生肖：兔、猴\n有利方位：西北方',
          advice: '主动社交，结识贵人。'
        }
      };

      return (
        <AnimalAnalysis>
          <AnalysisTitle>生肖运势分析</AnalysisTitle>
          <AnalysisContent>
            {Object.entries(analysis).map(([key, value], index) => (
              <AnalysisItem
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AnalysisLabel>{detailedAnalysis[key].title}</AnalysisLabel>
                <AnalysisValue>{renderStars(value)}</AnalysisValue>
                <DetailedAnalysis>
                  <AnalysisSection>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                      {detailedAnalysis[key].content}
                    </Text>
                  </AnalysisSection>
                  <AnalysisSection>
                    <AnalysisTitle>
                      <BulbOutlined />
                      建议
                    </AnalysisTitle>
                    <Text style={{ color: '#ffd700' }}>
                      {detailedAnalysis[key].advice}
                    </Text>
                  </AnalysisSection>
                </DetailedAnalysis>
              </AnalysisItem>
            ))}
          </AnalysisContent>
          <TrendChart>
            运势趋势图表（待实现）
          </TrendChart>
        </AnimalAnalysis>
      );
    };

    return (
      <TabContent>
        <MainContent>
          <ResetButton onClick={() => setShowModal(true)}>
            <SyncOutlined /> 重设生日
          </ResetButton>
          <Description>
            今天可能会遇到一些挑战，但也有机会展现你的能力。
          </Description>
          <div style={{ 
            background: 'rgba(255, 215, 0, 0.1)',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <Text style={{ color: '#ffd700' }}>
              <BulbOutlined style={{ marginRight: 8 }} />
              建议：勇敢面对，积极应对挑战。
            </Text>
          </div>
        </MainContent>
        {renderAnimalAnalysis(fortune.categories.animal?.name || '')}
        <Modal 
          visible={showModal} 
          onCancel={handleModalClose} 
          footer={null}
          width={300}
          style={{ 
            textAlign: 'center',
            borderRadius: '12px',
            overflow: 'hidden'
          }}
          bodyStyle={{
            padding: '24px'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <input type="date" onChange={() => handleModalClose()} />
            <Button onClick={handleModalClose}>确认</Button>
            <div>系统将自动记住你，下次无需填写~✨</div>
          </div>
        </Modal>
      </TabContent>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overall':
        return renderBasicFortune();
      case 'zodiac':
        return <ZodiacFortune />;
      case 'animal':
        return <AnimalFortune />;
      case 'lucky':
        return <LuckyHint />;
      default:
        return null;
    }
  };

  return (
    <Container>
      <Title>今日运势</Title>
      <TabNav>
        <TabButton
          active={activeTab === 'overall'} 
          onClick={() => setActiveTab('overall')}
        >
          综合运势
        </TabButton>
        <TabButton
          active={activeTab === 'zodiac'} 
          onClick={() => setActiveTab('zodiac')}
        >
          星座运势
        </TabButton>
        <TabButton
          active={activeTab === 'animal'} 
          onClick={() => setActiveTab('animal')}
        >
          生肖运势
        </TabButton>
        <TabButton
          active={activeTab === 'lucky'} 
          onClick={() => setActiveTab('lucky')}
        >
          幸运提示
        </TabButton>
      </TabNav>
      
      {renderTabContent()}
      
      <ButtonContainer>
        <ActionButton onClick={onBack} icon={<ArrowLeftOutlined />}>
          返回首页
        </ActionButton>
        <ActionButton onClick={() => onShare(fortune)} icon={<ShareAltOutlined />}>
          分享运势
        </ActionButton>
      </ButtonContainer>
    </Container>
  );
};

export default DailyFortune; 