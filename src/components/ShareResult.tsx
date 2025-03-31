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
  padding: 2rem;
  background: #1a1a2e;
  color: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 2rem;
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
  gap: 2rem;
  margin: 2rem 0;
  padding: 0 1rem;
`;

const CardItem = styled.div`
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  min-width: 200px;
`;

const CardImageWrapper = styled.div<{ isReversed?: boolean }>`
  width: 100%;
  max-width: 200px;
  margin: 0 auto;
  transform: ${props => props.isReversed ? 'rotate(180deg)' : 'none'};
  transition: transform 0.3s ease;
`;

const CardImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  object-fit: contain;
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

const CardDescription = styled.div`
  color: #e0e0e0;
  font-size: 0.9rem;
  margin-top: 0.3rem;
  text-align: center;
`;

const InterpretationSection = styled.div`
  margin: 2rem 0;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
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
  margin: 1.5rem 0;

  p {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 8px;
  }

  strong {
    color: #ffd700;
    margin-right: 1rem;
    display: inline-block;
  }
`;

const GuidanceSection = styled.div`
  margin: 2rem 0;
  padding: 2rem;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 15px;
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
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
`;

const Footer = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const QRCodeContainer = styled.div`
  background: white;
  padding: 4px;
  border-radius: 4px;
`;

const Watermark = styled.div`
  color: rgba(255, 255, 255, 0.5);
  text-align: right;
  font-size: 0.9rem;
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

  console.log('ShareResult render:', {
    dailyFortune,
    tarotResult,
    cards: tarotResult?.cards
  });

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

  return (
    <Container>
      <Title>分享今日运势</Title>

      <ShareCard>
        <ShareContent ref={contentRef}>
          <Header>
            <HeaderTitle>二次元占卜屋</HeaderTitle>
            <DateTime>{formatDate()} 今日运势</DateTime>
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
                          console.error('Image load error:', e);
                          e.currentTarget.src = '/Fortune-telling-website/card-back.jpg';
                        }}
                      />
                    </CardImageWrapper>
                    <CardName>{card.name}</CardName>
                    <CardPosition>
                      {card.position}
                    </CardPosition>
                  </CardItem>
                ))}
              </CardsContainer>

              <InterpretationSection>
                <InterpretationTitle>塔罗解读</InterpretationTitle>
                <div style={{border: '1px solid #ffd700', padding: '20px', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '8px'}}>
                  {/* 显示调试信息 */}
                  <p style={{color: '#aaa', fontSize: '12px', marginBottom: '10px'}}>卡片数量: {tarotResult?.cards?.length}</p>
                  
                  {/* 过去 */}
                  <div style={{marginBottom: '20px', padding: '15px', backgroundColor: '#222', border: '2px solid #ffd700', borderRadius: '8px'}}>
                    <h3 style={{color: '#ffd700', marginBottom: '10px'}}>过去: {tarotResult.cards.find(c => c.position === '过去')?.name || '星星'}</h3>
                    <p style={{color: 'white', lineHeight: '1.6'}}>
                      {tarotResult.cards.find(c => c.position === '过去')?.isReversed 
                        ? (tarotResult.cards.find(c => c.position === '过去')?.reversedMeaning || '星星牌（逆位）表示你可能失去了一些希望和信念。在过去，你曾经经历过迷茫和失落，但这些挑战也是成长的一部分。') 
                        : (tarotResult.cards.find(c => c.position === '过去')?.meaning || '星星牌代表希望和信念。在过去，你曾拥有明确的目标和希望，指引着你前进的方向。')}
                    </p>
                  </div>
                  
                  {/* 现在 */}
                  <div style={{marginBottom: '20px', padding: '15px', backgroundColor: '#222', border: '2px solid #ffd700', borderRadius: '8px'}}>
                    <h3 style={{color: '#ffd700', marginBottom: '10px'}}>现在: {tarotResult.cards.find(c => c.position === '现在')?.name || '命运之轮'}</h3>
                    <p style={{color: 'white', lineHeight: '1.6'}}>
                      {tarotResult.cards.find(c => c.position === '现在')?.isReversed 
                        ? (tarotResult.cards.find(c => c.position === '现在')?.reversedMeaning || '命运之轮（逆位）表示你可能正在抵抗变化。现在，你需要接受生活中的不确定性，学会放手，让事情自然发展。') 
                        : (tarotResult.cards.find(c => c.position === '现在')?.meaning || '命运之轮表示情况正在变化。现在，你正处于转变的阶段，生活中正在发生一些非你所能控制的变化。')}
                    </p>
                  </div>
                  
                  {/* 未来 */}
                  <div style={{marginBottom: '20px', padding: '15px', backgroundColor: '#222', border: '2px solid #ffd700', borderRadius: '8px'}}>
                    <h3 style={{color: '#ffd700', marginBottom: '10px'}}>未来: {tarotResult.cards.find(c => c.position === '未来')?.name || '恶魔'}</h3>
                    <p style={{color: 'white', lineHeight: '1.6'}}>
                      {tarotResult.cards.find(c => c.position === '未来')?.isReversed 
                        ? (tarotResult.cards.find(c => c.position === '未来')?.reversedMeaning || '恶魔牌（逆位）暗示着你将能够挣脱某种束缚。在未来，你会认识到自己内心的恐惧和执着，并找到超越它们的方法。') 
                        : (tarotResult.cards.find(c => c.position === '未来')?.meaning || '恶魔牌提醒你关注内心的束缚。在未来，你需要审视自己的执着和欲望，寻找真正的自由。')}
                    </p>
                  </div>
                </div>
              </InterpretationSection>

              <GuidanceSection>
                <GuidanceTitle>整体指引</GuidanceTitle>
                <GuidanceText>
                  根据塔罗牌的指引，让我们一起解读您的人生轨迹。在过去的经历中，
                  <span style={{color: '#ffd700', fontWeight: 'bold'}}>
                    {tarotResult.cards.find(c => c.position === '过去')?.isReversed 
                      ? (tarotResult.cards.find(c => c.position === '过去')?.reversedMeaning || '星星牌（逆位）表示你可能失去了一些希望和信念') 
                      : (tarotResult.cards.find(c => c.position === '过去')?.meaning || '星星牌代表希望和信念')}
                  </span>
                  的状态影响着您的决策和行动。目前，您正处于
                  <span style={{color: '#ffd700', fontWeight: 'bold'}}>
                    {tarotResult.cards.find(c => c.position === '现在')?.isReversed 
                      ? (tarotResult.cards.find(c => c.position === '现在')?.reversedMeaning || '命运之轮（逆位）表示你可能正在抵抗变化') 
                      : (tarotResult.cards.find(c => c.position === '现在')?.meaning || '命运之轮表示情况正在变化')}
                  </span>
                  的阶段。展望未来，
                  <span style={{color: '#ffd700', fontWeight: 'bold'}}>
                    {tarotResult.cards.find(c => c.position === '未来')?.isReversed 
                      ? (tarotResult.cards.find(c => c.position === '未来')?.reversedMeaning || '恶魔牌（逆位）暗示着你将能够挣脱某种束缚') 
                      : (tarotResult.cards.find(c => c.position === '未来')?.meaning || '恶魔牌提醒你关注内心的束缚')}
                  </span>
                  的征兆预示着即将到来的变化和机遇。保持开放和谨慎的心态，相信自己的直觉，勇敢地面对即将到来的改变。
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