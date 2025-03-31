import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Button, Tag, Card, List, Typography } from 'antd';
import { ArrowLeftOutlined, ShareAltOutlined, CalendarOutlined, StarOutlined, NotificationOutlined } from '@ant-design/icons';
import { formatDate } from '../utils/date';
import { DailyFortune as DailyFortuneType } from '../types/fortune';
import { getDailyFortune } from '../utils/cache';

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

const Date = styled.div`
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
    dailyEvents: {
      animeUpdates: [],
      gameEvents: [],
      birthdays: [],
      releases: []
    },
    dailyArtwork: {
      id: '',
      title: '加载中...',
      artistId: '',
      artistName: '加载中...',
      imageUrl: '/placeholder.jpg'
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFortune = async () => {
      try {
        const dailyFortune = await getDailyFortune();
        setFortune(dailyFortune);
      } catch (error) {
        console.error('获取运势失败：', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFortune();
  }, []);

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
      <Title>今日运势</Title>

      <FortuneCard>
        <Date>{fortune.date}</Date>
        <Content>{fortune.content}</Content>

        <LuckMeter>
          <LuckTitle>今日运势指数</LuckTitle>
          <LuckStars>{'★'.repeat(fortune.luck)}{'☆'.repeat(5 - fortune.luck)}</LuckStars>
        </LuckMeter>

        <TagsContainer>
          {fortune.tags.map((tag, index) => (
            <Tag 
              key={index}
              color="gold"
              style={{ fontSize: '1rem', padding: '0.3rem 0.8rem' }}
            >
              {tag}
            </Tag>
          ))}
        </TagsContainer>
      </FortuneCard>

      {fortune.categories && Object.entries(fortune.categories).map(([key, category]) => (
        <CategoryCard
          key={key}
          title={
            <span>
              {category.name}
              <LevelTag level={category.level}>{category.level}</LevelTag>
            </span>
          }
        >
          <div>{category.description}</div>
          <Text type="secondary" style={{ marginTop: '8px', display: 'block' }}>
            {category.advice}
          </Text>
        </CategoryCard>
      ))}

      <RecommendSection>
        <RecommendTitle>今日推荐</RecommendTitle>
        {fortune.dailyRecommend?.anime && (
          <RecommendCard title="动画推荐">
            {fortune.dailyRecommend.anime.imageUrl && (
              <img src={fortune.dailyRecommend.anime.imageUrl} alt={fortune.dailyRecommend.anime.title} />
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
            {fortune.dailyRecommend.game.imageUrl && (
              <img src={fortune.dailyRecommend.game.imageUrl} alt={fortune.dailyRecommend.game.title} />
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
            {fortune.dailyRecommend.music.url && (
              <Button type="link" href={fortune.dailyRecommend.music.url} target="_blank">
                在网易云音乐中收听
              </Button>
            )}
          </RecommendCard>
        )}
      </RecommendSection>

      <EventsSection>
        <EventsTitle>今日动态</EventsTitle>
        
        <EventListWrapper>
          {fortune.dailyEvents?.animeUpdates?.length > 0 && (
            <List<AnimeUpdate>
              className="event-list"
              header={<AntTitle level={4} style={{ color: '#ffd700' }}>今日更新</AntTitle>}
              dataSource={fortune.dailyEvents.animeUpdates}
              renderItem={(item: AnimeUpdate) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<CalendarOutlined style={{ color: '#ffd700' }} />}
                    title={item.title}
                    description={`第${item.episode}话 - ${item.time}`}
                  />
                </List.Item>
              )}
            />
          )}
          
          {fortune.dailyEvents?.gameEvents?.length > 0 && (
            <List<GameEvent>
              className="event-list"
              header={<AntTitle level={4} style={{ color: '#ffd700' }}>游戏活动</AntTitle>}
              dataSource={fortune.dailyEvents.gameEvents}
              renderItem={(item: GameEvent) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<NotificationOutlined style={{ color: '#ffd700' }} />}
                    title={item.game}
                    description={`${item.event} (截止: ${item.endTime})`}
                  />
                </List.Item>
              )}
            />
          )}
          
          {fortune.dailyEvents?.birthdays?.length > 0 && (
            <List<Birthday>
              className="event-list"
              header={<AntTitle level={4} style={{ color: '#ffd700' }}>角色生日</AntTitle>}
              dataSource={fortune.dailyEvents.birthdays}
              renderItem={(item: Birthday) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<StarOutlined style={{ color: '#ffd700' }} />}
                    title={item.character}
                    description={`来自: ${item.from}`}
                  />
                </List.Item>
              )}
            />
          )}
        </EventListWrapper>
      </EventsSection>

      <ArtworkSection>
        <ArtworkTitle>今日美图</ArtworkTitle>
        <ArtworkImage src={fortune.dailyArtwork.imageUrl} alt={fortune.dailyArtwork.title} />
        <ArtworkInfo>
          {fortune.dailyArtwork.title}
          <br />
          画师：{fortune.dailyArtwork.artistName}
          <br />
          Pixiv ID: {fortune.dailyArtwork.id}
        </ArtworkInfo>
      </ArtworkSection>

      <ButtonContainer>
        <StyledButton 
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
        >
          返回首页
        </StyledButton>
        <StyledButton 
          icon={<ShareAltOutlined />}
          onClick={() => onShare(fortune)}
        >
          分享运势
        </StyledButton>
      </ButtonContainer>
    </Container>
  );
};

export default DailyFortune; 