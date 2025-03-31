import React, { useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Button, message, Tag } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';
import { DailyFortune } from '../types/fortune';
import { TarotCardResult } from '../types/tarot';
import { formatDate } from '../utils/date';

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

const ShareCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
`;

const ShareContent = styled.div`
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 100%);
  border-radius: 15px;
  padding: 2rem;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/tarot-bg.jpg') center/cover;
    opacity: 0.1;
    z-index: -1;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
  padding-bottom: 1rem;
`;

const HeaderTitle = styled.h3`
  color: #ffd700;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
`;

const DateTime = styled.div`
  color: #e0e0e0;
  font-size: 1rem;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const CardItem = styled.div`
  text-align: center;
`;

const CardImage = styled.img<{ isReversed?: boolean }>`
  width: 100%;
  max-width: 150px;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  transform: ${props => props.isReversed ? 'rotate(180deg)' : 'none'};
  margin-bottom: 1rem;
`;

const CardName = styled.div`
  color: #ffd700;
  font-size: 1.1rem;
  margin-top: 0.5rem;
  text-align: center;
`;

const CardPosition = styled.div`
  color: #e0e0e0;
  font-size: 0.9rem;
  margin-top: 0.3rem;
  text-align: center;
`;

const InterpretationSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 215, 0, 0.3);
`;

const InterpretationTitle = styled.h4`
  color: #ffd700;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  
  &:before, &:after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 215, 0, 0.3);
    margin: 0 1rem;
  }
`;

const InterpretationText = styled.div`
  color: #e0e0e0;
  line-height: 1.8;
  margin-bottom: 1rem;
  text-indent: 2em;
`;

const GuidanceSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(255, 215, 0, 0.3);
`;

const GuidanceTitle = styled.h4`
  color: #ffd700;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  text-align: center;
`;

const GuidanceText = styled.p`
  color: #e0e0e0;
  line-height: 1.8;
  text-indent: 2em;
  margin: 0;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 215, 0, 0.3);
`;

const QRCodeContainer = styled.div`
  background: white;
  padding: 0.5rem;
  border-radius: 8px;
`;

const Watermark = styled.div`
  color: #ffd700;
  font-size: 0.9rem;
  text-align: right;
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

const DailyFortuneHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Date = styled.div`
  color: #ffd700;
  font-size: 1.4rem;
  margin-bottom: 1rem;
`;

const LuckMeter = styled.div`
  margin: 1.5rem 0;
`;

const LuckTitle = styled.div`
  color: #ffd700;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const LuckStars = styled.div`
  color: #ffd700;
  font-size: 2rem;
  letter-spacing: 0.5rem;
`;

const Content = styled.div`
  color: #e0e0e0;
  font-size: 1.1rem;
  line-height: 1.8;
  white-space: pre-wrap;
  margin-bottom: 2rem;
  text-align: left;
  padding: 0 1rem;
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  justify-content: center;
  margin: 2rem 0;
`;

const StandSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(255, 215, 0, 0.3);
`;

const StandTitle = styled.h4`
  color: #ffd700;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  text-align: center;
`;

const StandInfo = styled.div`
  margin-bottom: 1.5rem;
  text-align: center;
`;

const StandName = styled.div`
  color: #ffd700;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const StandAbility = styled.div`
  color: #e0e0e0;
  margin-bottom: 1rem;
`;

const StandDescription = styled.div`
  color: #e0e0e0;
  line-height: 1.8;
  text-indent: 2em;
  text-align: left;
`;

const StandStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-top: 1rem;
  text-align: center;
`;

const StatItem = styled.div`
  color: #e0e0e0;
`;

const StatValue = styled.span`
  color: #ffd700;
  margin-left: 0.5rem;
`;

const ArtworkSection = styled.div`
  margin-top: 2rem;
  text-align: center;
`;

const ArtworkTitle = styled.h4`
  color: #ffd700;
  margin-bottom: 1rem;
  font-size: 1.2rem;
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
  margin-bottom: 1rem;
`;

const CategoryCard = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 10px;
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;
`;

const CategoryName = styled.span`
  color: #ffd700;
  font-size: 1.1rem;
`;

const CategoryLevel = styled(Tag)<{ level: 'SSR' | 'SR' | 'R' | 'N' }>`
  margin-left: 0.8rem;
  background: ${props => {
    switch (props.level) {
      case 'SSR': return 'linear-gradient(45deg, #FFD700, #FFA500)';
      case 'SR': return 'linear-gradient(45deg, #C0C0C0, #A0A0A0)';
      case 'R': return 'linear-gradient(45deg, #CD7F32, #8B4513)';
      case 'N': return 'linear-gradient(45deg, #808080, #696969)';
    }
  }};
  border: none;
`;

const CategoryDescription = styled.div`
  color: #e0e0e0;
  margin-bottom: 0.5rem;
`;

const CategoryAdvice = styled.div`
  color: #a0a0a0;
  font-size: 0.9rem;
`;

const RecommendSection = styled.div`
  margin: 2rem 0;
`;

const RecommendTitle = styled.h4`
  color: #ffd700;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  
  &:before, &:after {
    content: '';
    display: inline-block;
    width: 50px;
    height: 1px;
    background: rgba(255, 215, 0, 0.3);
    margin: 0 1rem;
    vertical-align: middle;
  }
`;

const RecommendCard = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
`;

const RecommendHeader = styled.div`
  color: #ffd700;
  font-size: 1.1rem;
  margin-bottom: 0.8rem;
`;

const RecommendContent = styled.div`
  color: #e0e0e0;
`;

const EventsSection = styled.div`
  margin: 2rem 0;
`;

const EventsTitle = styled.h4`
  color: #ffd700;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  
  &:before, &:after {
    content: '';
    display: inline-block;
    width: 50px;
    height: 1px;
    background: rgba(255, 215, 0, 0.3);
    margin: 0 1rem;
    vertical-align: middle;
  }
`;

const EventList = styled.div`
  margin: 1rem 0;
`;

const EventItem = styled.div`
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const EventTitle = styled.div`
  color: #ffd700;
  margin-bottom: 0.3rem;
`;

const EventDescription = styled.div`
  color: #e0e0e0;
  font-size: 0.9rem;
`;

interface ShareResultProps {
  dailyFortune?: DailyFortune;
  tarotResult?: {
    cards: TarotCardResult[];
    interpretations?: {
      past: string;
      present: string;
      future: string;
      guidance: string;
    };
  };
  onBack: () => void;
}

const ShareResult: React.FC<ShareResultProps> = ({ dailyFortune, tarotResult, onBack }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const handleSaveImage = async () => {
    if (!contentRef.current) return;
    
    setLoading(true);
    try {
      const canvas = await html2canvas(contentRef.current, {
        background: 'transparent',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      } as any);

      const link = document.createElement('a');
      link.download = `二次元占卜屋_${formatDate()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      message.success('图片保存成功！');
    } catch (error) {
      console.error('保存图片失败:', error);
      message.error('保存图片失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const generateInterpretation = () => {
    if (!tarotResult?.cards) return null;

    const interpretations = {
      past: '',
      present: '',
      future: '',
      guidance: ''
    };

    tarotResult.cards.forEach((card) => {
      const cardEffect = card.isReversed ? card.reversedMeaning : card.meaning;
      
      switch (card.position) {
        case 'past':
          interpretations.past = cardEffect;
          break;
        case 'present':
          interpretations.present = cardEffect;
          break;
        case 'future':
          interpretations.future = cardEffect;
          break;
      }
    });

    const pastEffect = interpretations.past;
    const presentEffect = interpretations.present;
    const futureEffect = interpretations.future;

    interpretations.guidance = `根据塔罗牌的指引，你过去的${pastEffect}经历塑造了现在的你。目前你正处于${presentEffect}的状态，这为你带来了新的机遇和挑战。在未来，你将${futureEffect}，这预示着一段重要的转变期。建议你保持开放和谨慎的心态，相信自己的直觉，勇敢地面对即将到来的改变。每一个挑战都是成长的机会，保持耐心和乐观的心态，相信自己的目标和理想。`;

    return interpretations;
  };

  const renderTarotContent = () => {
    if (!tarotResult?.cards) return null;

    const interpretations = generateInterpretation();
    if (!interpretations) return null;

    return (
      <>
        <CardsContainer>
          {tarotResult.cards.map((card, index) => (
            <CardItem key={index}>
              <CardImage 
                src={card.image} 
                alt={card.name}
                style={{ transform: card.isReversed ? 'rotate(180deg)' : 'none' }}
              />
              <CardName>{card.name}</CardName>
              <CardPosition>{card.position}</CardPosition>
            </CardItem>
          ))}
        </CardsContainer>

        <InterpretationSection>
          <InterpretationTitle>塔罗解读</InterpretationTitle>
          <InterpretationText>
            <p><strong>过去：</strong>{interpretations.past}</p>
            <p><strong>现在：</strong>{interpretations.present}</p>
            <p><strong>未来：</strong>{interpretations.future}</p>
          </InterpretationText>
        </InterpretationSection>

        <GuidanceSection>
          <GuidanceTitle>整体指引</GuidanceTitle>
          <GuidanceText>{interpretations.guidance}</GuidanceText>
        </GuidanceSection>
      </>
    );
  };

  const renderDailyFortuneContent = () => {
    if (!dailyFortune) return null;

    return (
      <ShareContent>
        <DailyFortuneHeader>
          <Date>{dailyFortune.date}</Date>
          <LuckMeter>
            <LuckTitle>今日运势指数</LuckTitle>
            <LuckStars>{'★'.repeat(dailyFortune.luck)}{'☆'.repeat(5 - dailyFortune.luck)}</LuckStars>
          </LuckMeter>
        </DailyFortuneHeader>

        <Content>{dailyFortune.content}</Content>

        <TagsContainer>
          {dailyFortune.tags.map((tag, index) => (
            <Tag 
              key={index}
              color="gold"
              style={{ fontSize: '1rem', padding: '0.3rem 0.8rem' }}
            >
              {tag}
            </Tag>
          ))}
        </TagsContainer>

        {Object.entries(dailyFortune.categories).map(([key, category]) => (
          <CategoryCard key={key}>
            <CategoryHeader>
              <CategoryName>{category.name}</CategoryName>
              <CategoryLevel level={category.level}>{category.level}</CategoryLevel>
            </CategoryHeader>
            <CategoryDescription>{category.description}</CategoryDescription>
            <CategoryAdvice>{category.advice}</CategoryAdvice>
          </CategoryCard>
        ))}

        <RecommendSection>
          <RecommendTitle>今日推荐</RecommendTitle>
          {dailyFortune.dailyRecommend.anime && (
            <RecommendCard>
              <RecommendHeader>动画推荐</RecommendHeader>
              <RecommendContent>
                <div>{dailyFortune.dailyRecommend.anime.title}</div>
                <div>{dailyFortune.dailyRecommend.anime.episode}</div>
                <div style={{ color: '#a0a0a0', marginTop: '0.5rem' }}>
                  {dailyFortune.dailyRecommend.anime.reason}
                </div>
              </RecommendContent>
            </RecommendCard>
          )}
          
          {dailyFortune.dailyRecommend.game && (
            <RecommendCard>
              <RecommendHeader>游戏推荐</RecommendHeader>
              <RecommendContent>
                <div>{dailyFortune.dailyRecommend.game.title}</div>
                <div>{dailyFortune.dailyRecommend.game.type}</div>
                <div style={{ color: '#a0a0a0', marginTop: '0.5rem' }}>
                  {dailyFortune.dailyRecommend.game.reason}
                </div>
              </RecommendContent>
            </RecommendCard>
          )}
          
          {dailyFortune.dailyRecommend.music && (
            <RecommendCard>
              <RecommendHeader>音乐推荐</RecommendHeader>
              <RecommendContent>
                <div>{dailyFortune.dailyRecommend.music.title}</div>
                <div>{dailyFortune.dailyRecommend.music.artist}</div>
              </RecommendContent>
            </RecommendCard>
          )}
        </RecommendSection>

        <EventsSection>
          <EventsTitle>今日动态</EventsTitle>
          
          {dailyFortune.dailyEvents.animeUpdates.length > 0 && (
            <EventList>
              <RecommendHeader>今日更新</RecommendHeader>
              {dailyFortune.dailyEvents.animeUpdates.map((item, index) => (
                <EventItem key={index}>
                  <EventTitle>{item.title}</EventTitle>
                  <EventDescription>第{item.episode}话 - {item.time}</EventDescription>
                </EventItem>
              ))}
            </EventList>
          )}
          
          {dailyFortune.dailyEvents.gameEvents.length > 0 && (
            <EventList>
              <RecommendHeader>游戏活动</RecommendHeader>
              {dailyFortune.dailyEvents.gameEvents.map((item, index) => (
                <EventItem key={index}>
                  <EventTitle>{item.game}</EventTitle>
                  <EventDescription>{item.event} (截止: {item.endTime})</EventDescription>
                </EventItem>
              ))}
            </EventList>
          )}
          
          {dailyFortune.dailyEvents.birthdays.length > 0 && (
            <EventList>
              <RecommendHeader>角色生日</RecommendHeader>
              {dailyFortune.dailyEvents.birthdays.map((item, index) => (
                <EventItem key={index}>
                  <EventTitle>{item.character}</EventTitle>
                  <EventDescription>来自: {item.from}</EventDescription>
                </EventItem>
              ))}
            </EventList>
          )}
        </EventsSection>

        <Footer>
          <QRCodeContainer>
            <QRCodeSVG
              value={window.location.origin}
              size={64}
              level="L"
            />
          </QRCodeContainer>
          <Watermark>
            AI 二次元运势
            <br />
            {formatDate()}
          </Watermark>
        </Footer>
      </ShareContent>
    );
  };

  return (
    <Container>
      <Title>分享今日运势</Title>

      <ShareCard>
        <ShareContent ref={contentRef}>
          <Header>
            <HeaderTitle>二次元占卜屋</HeaderTitle>
            <DateTime>{formatDate()} 今日运势</DateTime>
          </Header>

          {renderTarotContent()}
          {renderDailyFortuneContent()}

          <Footer>
            <QRCodeContainer>
              <QRCodeSVG 
                value={window.location.href}
                size={80}
                level="H"
              />
            </QRCodeContainer>
            <Watermark>
              二次元占卜屋 · JOJO塔罗牌
              <br />
              扫描二维码获取你的占卜结果
            </Watermark>
          </Footer>
        </ShareContent>
      </ShareCard>

      <ButtonContainer>
        <StyledButton 
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
        >
          返回结果
        </StyledButton>
        <StyledButton 
          icon={<DownloadOutlined />}
          onClick={handleSaveImage}
          loading={loading}
        >
          保存图片
        </StyledButton>
      </ButtonContainer>
    </Container>
  );
};

export default ShareResult; 