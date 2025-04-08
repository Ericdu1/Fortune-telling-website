import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Button, Tag, Card, List, Typography } from 'antd';
import { 
  ArrowLeftOutlined, 
  ShareAltOutlined, 
  CalendarOutlined, 
  StarOutlined, 
  NotificationOutlined,
  PlayCircleOutlined,
  HeartOutlined,
  FireOutlined
} from '@ant-design/icons';
import { formatDate } from '../utils/date';
import { DailyFortune as DailyFortuneType } from '../types/fortune';
import { getDailyFortune } from '../utils/cache';
import AnimeRecommendation from './AnimeRecommendation';
import DailyWallpaperComponent from './DailyWallpaper';
import InteractiveFortuneCard from './InteractiveFortuneCard';
import FortuneCharacter from './FortuneCharacter';
import StreakCounter from './StreakCounter';
import FortuneCardCollection from './FortuneCardCollection';
import FortuneGame from './FortuneGame';

const { Title: AntTitle, Text } = Typography;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  color: white;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: white;
`;

const FortuneCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 215, 0, 0.3);
`;

const DateDisplay = styled.div`
  color: #ffd700;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const Content = styled.div`
  color: #e0e0e0;
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  white-space: pre-wrap;
`;

const LuckMeter = styled.div`
  margin: 2rem 0;
  text-align: center;
`;

const LuckTitle = styled.div`
  color: #ffd700;
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const LuckStars = styled.div`
  color: #ffd700;
  font-size: 1.5rem;
  letter-spacing: 0.5rem;
`;

const TagsContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const StyledButton = styled(Button)`
  background: linear-gradient(45deg, #6b6bff, #8e8eff);
  border: none;
  color: white;
  height: 40px;
  padding: 0 2rem;
  
  &:hover {
    opacity: 0.9;
    color: white;
  }
`;

const ArtworkSection = styled.div`
  margin-top: 2rem;
  text-align: center;
`;

const ArtworkTitle = styled.h3`
  color: #ffd700;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
`;

const ArtworkImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 1rem;
`;

const ArtworkInfo = styled.div`
  color: #e0e0e0;
  font-size: 0.9rem;
  
  a {
    color: #ffd700;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const CategoryCard = styled(Card)`
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  
  .ant-card-head {
    border-bottom: 1px solid rgba(255, 215, 0, 0.3);
    min-height: auto;
    
    .ant-card-head-title {
      color: #ffd700;
      padding: 8px 0;
    }
  }
  
  .ant-card-body {
    padding: 12px;
    color: #e0e0e0;
  }
`;

const RecommendSection = styled.div`
  margin-top: 2rem;
`;

const RecommendTitle = styled.h3`
  color: #ffd700;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
`;

const RecommendCard = styled(Card)`
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  .ant-card-head {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    .ant-card-head-title {
      color: #ffd700;
    }
  }
  
  .ant-card-body {
    color: #e0e0e0;
  }
  
  img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 8px;
  }
`;

const EventsSection = styled.div`
  margin-top: 2rem;
`;

const EventsTitle = styled.h3`
  color: #ffd700;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
`;

const EventListWrapper = styled.div`
  .event-list {
    .ant-list-item {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding: 8px 0;
      
      &:last-child {
        border-bottom: none;
      }
    }
    
    .ant-list-item-meta-title {
      color: #ffd700;
      margin-bottom: 4px;
    }
    
    .ant-list-item-meta-description {
      color: #e0e0e0;
    }
  }
`;

const LevelTag = styled(Tag)<{ level: 'SSR' | 'SR' | 'R' | 'N' }>`
  background: ${props => {
    switch (props.level) {
      case 'SSR': return 'linear-gradient(45deg, #FFD700, #FFA500)';
      case 'SR': return 'linear-gradient(45deg, #C0C0C0, #A0A0A0)';
      case 'R': return 'linear-gradient(45deg, #CD7F32, #8B4513)';
      case 'N': return 'linear-gradient(45deg, #808080, #696969)';
    }
  }};
  border: none;
  margin-left: 8px;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
`;

const ActionButton = styled(Button)`
  background: linear-gradient(45deg, #6941C6, #3730A3);
  border: none;
  color: white;
  height: 40px;
  padding: 0 15px;
  
  &:hover {
    opacity: 0.9;
    color: white;
  }
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 30px 0;
  flex-wrap: wrap;
`;

interface AnimeUpdate {
  title: string;
  episode: number;
  time: string;
}

interface GameEvent {
  game: string;
  event: string;
  endTime: string;
}

interface Birthday {
  character: string;
  from: string;
}

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
    name: '神秘法师',
    avatar: '/images/characters/mysterious.jpg',
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
  const [showCollection, setShowCollection] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(getRandomCharacter());
  const [flippedCards, setFlippedCards] = useState<{ [key: string]: boolean }>({});
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

  const handleCardFlip = (key: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
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
      
      <CardContainer>
        <InteractiveFortuneCard
          isFlipped={flippedCards['fortune'] || false}
          onFlip={() => handleCardFlip('fortune')}
          frontContent={
            <div>
              <h3 style={{ marginBottom: '10px' }}>今日运势</h3>
              <div style={{ fontSize: '18px', color: '#FFD700' }}>
                {formatDate()}
              </div>
              <div style={{ marginTop: '30px' }}>
                点击翻开查看
              </div>
            </div>
          }
          backContent={
            <div>
              <h3 style={{ color: '#ffd700', marginBottom: '15px' }}>今日运势指数</h3>
              <div style={{ marginBottom: '10px', fontSize: '24px' }}>
                {'★'.repeat(fortune.luck)}{'☆'.repeat(5 - fortune.luck)}
              </div>
              <p style={{ marginBottom: '15px', whiteSpace: 'pre-wrap' }}>{fortune.content}</p>
              <div>
                {fortune.tags.map((tag, idx) => (
                  <span key={idx} style={{ 
                    background: 'rgba(255,215,0,0.2)', 
                    padding: '2px 8px', 
                    borderRadius: '12px',
                    margin: '0 4px 4px 0',
                    display: 'inline-block',
                    fontSize: '12px'
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          }
        />
        
        {Object.entries(fortune.categories).slice(0, 2).map(([key, category]) => (
          <InteractiveFortuneCard
            key={key}
            isFlipped={flippedCards[key] || false}
            onFlip={() => handleCardFlip(key)}
            frontContent={
              <div>
                <h3 style={{ marginBottom: '10px' }}>{category.name}</h3>
                <div style={{ 
                  background: 'rgba(255,215,0,0.2)', 
                  padding: '3px 10px', 
                  borderRadius: '12px',
                  margin: '10px auto',
                  display: 'inline-block'
                }}>
                  {category.level}
                </div>
                <div style={{ marginTop: '30px' }}>
                  点击翻开查看
                </div>
              </div>
            }
            backContent={
              <div>
                <h3 style={{ color: '#ffd700', marginBottom: '15px' }}>{category.name}</h3>
                <div style={{ 
                  background: 'rgba(255,215,0,0.2)', 
                  padding: '3px 10px', 
                  borderRadius: '12px',
                  margin: '0 auto 15px',
                  display: 'inline-block'
                }}>
                  {category.level}
                </div>
                <p style={{ marginBottom: '15px' }}>{category.description}</p>
                {category.advice && (
                  <div>
                    <h4 style={{ color: '#ffd700', marginBottom: '5px' }}>建议</h4>
                    <p>{category.advice}</p>
                  </div>
                )}
              </div>
            }
          />
        ))}
      </CardContainer>
      
      <FortuneCharacter 
        character={selectedCharacter} 
        fortune={fortune.content} 
      />
      
      <ActionsContainer>
        <ActionButton icon={<HeartOutlined />} onClick={handleFavorite}>
          收藏运势
        </ActionButton>
        <ActionButton icon={<PlayCircleOutlined />} onClick={() => setShowGame(true)}>
          运势小游戏
        </ActionButton>
        <ActionButton icon={<ShareAltOutlined />} onClick={() => onShare(fortune)}>
          分享运势
        </ActionButton>
      </ActionsContainer>
      
      <div>
        {Object.entries(fortune.categories).map(([key, category]) => (
          <CategoryCard 
            key={key}
            title={
              <div>
                {category.name}
                <LevelTag level={category.level}>{category.level}</LevelTag>
              </div>
            }
          >
            {category.description}
          </CategoryCard>
        ))}
      </div>

      <DailyWallpaperComponent />
      
      <AnimeRecommendation />
      
      <RecommendSection>
        <RecommendTitle>今日推荐</RecommendTitle>
        {fortune.dailyRecommend?.anime && (
          <RecommendCard title="动画推荐">
            {fortune.dailyRecommend.anime.image && (
              <img src={fortune.dailyRecommend.anime.image} alt={fortune.dailyRecommend.anime.title} />
            )}
            <AntTitle level={4}>{fortune.dailyRecommend.anime.title}</AntTitle>
            <Text>{fortune.dailyRecommend.anime.episode}</Text>
            <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
              {fortune.dailyRecommend.anime.reason}
            </Text>
          </RecommendCard>
        )}
        
        {fortune.dailyRecommend?.game && (
          <RecommendCard title="游戏推荐">
            {fortune.dailyRecommend.game.image && (
              <img src={fortune.dailyRecommend.game.image} alt={fortune.dailyRecommend.game.title} />
            )}
            <AntTitle level={4}>{fortune.dailyRecommend.game.title}</AntTitle>
            <Text>{fortune.dailyRecommend.game.type}</Text>
            <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
              {fortune.dailyRecommend.game.reason}
            </Text>
          </RecommendCard>
        )}
        
        {fortune.dailyRecommend?.music && (
          <RecommendCard title="音乐推荐">
            <AntTitle level={4}>{fortune.dailyRecommend.music.title}</AntTitle>
            <Text>{fortune.dailyRecommend.music.artist}</Text>
            {fortune.dailyRecommend.music.link && (
              <Button type="link" href={fortune.dailyRecommend.music.link} target="_blank">
                在网易云音乐中收听
              </Button>
            )}
          </RecommendCard>
        )}
      </RecommendSection>

      <EventsSection>
        <EventsTitle>今日动态</EventsTitle>
        
        <EventListWrapper>
          {fortune.events?.list?.length > 0 && (
            <List
              className="event-list"
              header={<AntTitle level={4} style={{ color: '#ffd700' }}>今日事件</AntTitle>}
              dataSource={fortune.events?.list || []}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<CalendarOutlined style={{ color: '#ffd700' }} />}
                    title={item.title}
                    description={`${item.description}${item.time ? ` - ${item.time}` : ''}`}
                  />
                </List.Item>
              )}
            />
          )}
        </EventListWrapper>
      </EventsSection>

      <ArtworkSection>
        <ArtworkTitle>今日美图</ArtworkTitle>
        <ArtworkImage src={fortune.dailyArtwork?.imageUrl} alt={fortune.dailyArtwork?.title} />
        <ArtworkInfo>
          {fortune.dailyArtwork?.title}
          <br />
          画师：{fortune.dailyArtwork?.artistName}
          <br />
          Pixiv ID: {fortune.dailyArtwork?.id}
        </ArtworkInfo>
      </ArtworkSection>

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