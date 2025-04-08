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
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 0.5rem;
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: white;
  font-size: 2rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
`;

const ShareCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 0.5rem;
    border-radius: 10px;
  }
`;

const ShareContent = styled.div`
  padding: 1.5rem;
  background: #1a1a2e;
  color: #ffffff;
  min-height: auto;
  height: auto;
  max-height: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  overflow: visible;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  border-radius: 0;
  
  @media (max-width: 600px) {
    padding: 1rem;
    gap: 0.8rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
  padding-bottom: 0.8rem;
`;

const HeaderTitle = styled.h3`
  color: #ffd700;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const DateTime = styled.div`
  color: #e0e0e0;
  font-size: 1rem;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 1.5rem 0;
  padding: 0;
  
  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const CardItem = styled.div`
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(255, 215, 0, 0.3);
  
  @media (max-width: 480px) {
    padding: 0.3rem;
    border-radius: 8px;
  }
`;

const CardImageWrapper = styled.div<{ isReversed?: boolean }>`
  width: 100%;
  margin: 0 auto;
  transform: ${props => props.isReversed ? 'rotate(180deg)' : 'none'};
`;

const CardImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 6px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

const CardName = styled.div`
  color: #ffd700;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  font-weight: bold;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-top: 0.3rem;
  }
`;

const CardPosition = styled.div`
  color: #e0e0e0;
  font-size: 0.8rem;
  margin-top: 0.2rem;
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
    margin-top: 0.1rem;
  }
`;

const CardDescription = styled.div`
  color: #e0e0e0;
  font-size: 0.9rem;
  margin-top: 0.3rem;
  text-align: center;
`;

const InterpretationSection = styled.div`
  margin: 1.5rem 0;
  padding: 0;
`;

const CategorySection = styled.div`
  margin: 1rem 0;
`;

const CategoryTitle = styled.h4`
  color: #ffd700;
  margin-bottom: 0.8rem;
  font-size: 1.1rem;
  text-align: center;
  position: relative;
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 0.6rem;
  }
  
  &:before, &:after {
    content: '';
    position: absolute;
    top: 50%;
    height: 1px;
    width: 30%;
    background: rgba(255, 215, 0, 0.3);
  }
  
  &:before {
    left: 0;
  }
  
  &:after {
    right: 0;
  }
`;

const CategoryContent = styled.p`
  color: #e0e0e0;
  line-height: 1.6;
  text-indent: 0;
  margin: 0;
  padding: 0.8rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  font-size: 0.9rem;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.6rem;
    line-height: 1.4;
  }
`;

const GuidanceSection = styled.div`
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  border: 1px solid rgba(255, 215, 0, 0.3);
`;

const GuidanceTitle = styled.h4`
  color: #ffd700;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  text-align: center;
`;

const GuidanceText = styled.p`
  color: #e0e0e0;
  line-height: 1.6;
  text-indent: 2em;
  margin: 0;
  padding: 0;
  font-size: 0.9rem;
`;

const Footer = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 480px) {
    margin-top: 1.5rem;
    padding-top: 0.8rem;
    flex-direction: column;
    gap: 1rem;
  }
`;

const QRCodeContainer = styled.div`
  background: white;
  padding: 4px;
  border-radius: 4px;
  
  @media (max-width: 480px) {
    margin: 0 auto;
  }
`;

const Watermark = styled.div`
  color: rgba(255, 255, 255, 0.5);
  text-align: right;
  font-size: 0.9rem;
  
  @media (max-width: 480px) {
    text-align: center;
    font-size: 0.8rem;
  }
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
    height: 38px;
    padding: 0 1rem;
  }
  
  &:hover {
    opacity: 0.9;
    color: white;
  }
`;

const DailyFortuneHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const Date = styled.div`
  color: #ffd700;
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const LuckMeter = styled.div`
  margin: 1rem 0;
`;

const LuckTitle = styled.div`
  color: #ffd700;
  margin-bottom: 0.5rem;
`;

const LuckStars = styled.div`
  color: #ffd700;
  font-size: 1.5rem;
`;

const Content = styled.div`
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 1.5rem 0;
  white-space: pre-wrap;
`;

const TagsContainer = styled.div`
  margin: 1rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
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
  margin: 1.5rem 0;
  
  @media (max-width: 480px) {
    margin: 1rem 0;
  }
`;

const RecommendTitle = styled.h4`
  color: #ffd700;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  text-align: center;
  position: relative;
  
  @media (max-width: 480px) {
    margin-bottom: 0.8rem;
    font-size: 1rem;
  }
  
  &:before, &:after {
    content: '';
    position: absolute;
    top: 50%;
    height: 1px;
    width: 30%;
    background: rgba(255, 215, 0, 0.3);
  }
  
  &:before {
    left: 0;
  }
  
  &:after {
    right: 0;
  }
`;

const RecommendCard = styled.div`
  margin-bottom: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  overflow: hidden;
  
  @media (max-width: 480px) {
    margin-bottom: 0.8rem;
  }
`;

const RecommendHeader = styled.div`
  background: rgba(255, 215, 0, 0.2);
  padding: 0.6rem;
  color: #ffd700;
  font-weight: bold;
  font-size: 0.9rem;
  
  @media (max-width: 480px) {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
`;

const RecommendContent = styled.div`
  padding: 0.8rem;
  color: #e0e0e0;
  font-size: 0.9rem;
  
  @media (max-width: 480px) {
    padding: 0.6rem;
    font-size: 0.8rem;
  }
`;

const DailyFortuneContent = styled.div`
  margin: 1.5rem 0;
  
  @media (max-width: 480px) {
    margin: 1rem 0;
  }
`;

const LuckLevelContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1rem 0;
  justify-content: center;
  
  @media (max-width: 480px) {
    gap: 0.6rem;
    margin: 0.8rem 0;
  }
`;

const LuckLevel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    gap: 0.3rem;
  }
`;

const LuckTag = styled(Tag)`
  font-size: 0.9rem;
  padding: 0.2rem 0.6rem;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.1rem 0.4rem;
  }
`;

const EventsSection = styled.div`
  margin: 1.5rem 0;
  
  @media (max-width: 480px) {
    margin: 1rem 0;
  }
`;

const EventsTitle = styled.h4`
  color: #ffd700;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  text-align: center;
  position: relative;
  
  @media (max-width: 480px) {
    margin-bottom: 0.8rem;
    font-size: 1rem;
  }
  
  &:before, &:after {
    content: '';
    position: absolute;
    top: 50%;
    height: 1px;
    width: 30%;
    background: rgba(255, 215, 0, 0.3);
  }
  
  &:before {
    left: 0;
  }
  
  &:after {
    right: 0;
  }
`;

const EventList = styled.div`
  margin: 1rem 0;
  
  @media (max-width: 480px) {
    margin: 0.8rem 0;
  }
`;

const EventItem = styled.div`
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 480px) {
    padding: 0.6rem 0;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const EventTitle = styled.div`
  color: #ffd700;
  margin-bottom: 0.3rem;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 0.2rem;
  }
`;

const EventDescription = styled.div`
  color: #e0e0e0;
  font-size: 0.9rem;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
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

  // 提取卡片意义的辅助函数
  const extractCardMeaning = (position: string) => {
    const card = tarotResult?.cards?.find(c => c.position === position);
    return card?.isReversed ? card.reversedMeaning : card?.meaning;
  };

  const handleSaveImage = async () => {
    if (!contentRef.current) return;
    
    setLoading(true);
    try {
      // 计算内容的实际高度
      const contentHeight = contentRef.current.scrollHeight;
      
      const canvas = await html2canvas(contentRef.current, {
        background: '#1a1a2e',
        scale: 2,
        height: contentHeight,
        windowHeight: contentHeight,
        logging: false,
        useCORS: true,
        allowTaint: true,
        onclone: (documentClone: Document) => {
          // 确保克隆的文档有正确的尺寸
          const clonedContent = documentClone.querySelector('.share-content');
          if (clonedContent) {
            (clonedContent as HTMLElement).style.height = `${contentHeight}px`;
            (clonedContent as HTMLElement).style.overflow = 'visible';
          }
        }
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

  return (
    <Container>
      <Title>分享今日运势</Title>

      <ShareCard>
        <ShareContent ref={contentRef} className="share-content">
          <Header>
            <HeaderTitle>二次元占卜屋</HeaderTitle>
            <DateTime>{formatDate()} 塔罗牌占卜</DateTime>
          </Header>

          {tarotResult && tarotResult.cards && tarotResult.cards.length > 0 && (
            <>
              <CardsContainer>
                {tarotResult.cards.map((card, index) => (
                  <CardItem key={index}>
                    <CardImageWrapper isReversed={card.isReversed}>
                      <CardImage 
                        src={card.image} 
                        alt={card.name}
                        onError={(e) => {
                          e.currentTarget.src = '/card-back.jpg';
                        }}
                      />
                    </CardImageWrapper>
                    <CardName>
                      {card.name} {card.isReversed ? '(逆位)' : '(正位)'}
                    </CardName>
                    <CardPosition>
                      {card.position}
                    </CardPosition>
                  </CardItem>
                ))}
              </CardsContainer>

              <InterpretationSection>
                <CategorySection>
                  <CategoryTitle>事业发展</CategoryTitle>
                  <CategoryContent>
                    目前{extractCardMeaning('现在') || '改变，机遇，命运'}的状态，未来将会{extractCardMeaning('未来') || '创造力受阻，依赖性，过度保护'}。
                  </CategoryContent>
                </CategorySection>

                <CategorySection>
                  <CategoryTitle>感情状况</CategoryTitle>
                  <CategoryContent>
                    在感情中{extractCardMeaning('现在') || '改变，机遇，命运'}，将会遇到{extractCardMeaning('未来') || '创造力受阻，依赖性，过度保护'}的情况。
                  </CategoryContent>
                </CategorySection>

                <CategorySection>
                  <CategoryTitle>心理指引</CategoryTitle>
                  <CategoryContent>
                    过去的{extractCardMeaning('过去') || '富裕，不负责任，过度冒险'}经历，这将帮助你{extractCardMeaning('未来') || '创造力受阻，依赖性，过度保护'}。
                  </CategoryContent>
                </CategorySection>
              </InterpretationSection>

              <GuidanceSection>
                <GuidanceTitle>塔罗指引</GuidanceTitle>
                <GuidanceText>
                  根据塔罗牌的指引，你过去的{extractCardMeaning('过去') || '富裕，不负责任，过度冒险'}经历塑造了现在的你。目前你正处于{extractCardMeaning('现在') || '改变，机遇，命运'}的状态，这为你带来了新的机遇和挑战。在未来，你将{extractCardMeaning('未来') || '创造力受阻，依赖性，过度保护'}，这预示着一段重要的转变期。建议你保持开放和善良的心态，相信自己的直觉，勇敢地面对即将到来的改变。每一个挑战都是成长的机会，保持耐心和乐观的心态，相信自己的目标和理想。
                </GuidanceText>
              </GuidanceSection>
            </>
          )}

          {dailyFortune && (
            <>
              <DailyFortuneHeader>
                <Date>{dailyFortune.date}</Date>
                <LuckMeter>
                  <LuckTitle>今日运势指数</LuckTitle>
                  <LuckStars>{'★'.repeat(dailyFortune.luck)}{'☆'.repeat(5 - dailyFortune.luck)}</LuckStars>
                </LuckMeter>
              </DailyFortuneHeader>

              <DailyFortuneContent>
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
              </DailyFortuneContent>

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
                
                {dailyFortune.events.animeUpdates.length > 0 && (
                  <EventList>
                    <RecommendHeader>今日更新</RecommendHeader>
                    {dailyFortune.events.animeUpdates.map((item, index) => (
                      <EventItem key={index}>
                        <EventTitle>{item.title}</EventTitle>
                        <EventDescription>第{item.episode}话 - {item.time}</EventDescription>
                      </EventItem>
                    ))}
                  </EventList>
                )}
                
                {dailyFortune.events.gameEvents.length > 0 && (
                  <EventList>
                    <RecommendHeader>游戏活动</RecommendHeader>
                    {dailyFortune.events.gameEvents.map((item, index) => (
                      <EventItem key={index}>
                        <EventTitle>{item.game}</EventTitle>
                        <EventDescription>{item.event} (截止: {item.endTime})</EventDescription>
                      </EventItem>
                    ))}
                  </EventList>
                )}
                
                {dailyFortune.events.birthdays.length > 0 && (
                  <EventList>
                    <RecommendHeader>角色生日</RecommendHeader>
                    {dailyFortune.events.birthdays.map((item, index) => (
                      <EventItem key={index}>
                        <EventTitle>{item.character}</EventTitle>
                        <EventDescription>来自: {item.from}</EventDescription>
                      </EventItem>
                    ))}
                  </EventList>
                )}
              </EventsSection>
            </>
          )}

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