import React from 'react';
import styled from '@emotion/styled';
import { Button as AntdButton, message } from 'antd';
import { ArrowLeftOutlined, ShareAltOutlined, CopyOutlined } from '@ant-design/icons';
import { TarotCardResult } from '../types/tarot';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 0.8rem;
    padding-bottom: 5rem;
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #ffd700;
  font-size: 2.2rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1.2rem;
    font-size: 1.6rem;
  }
`;

const ResultGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const ResultCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  max-width: 900px;
  width: 100%;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 215, 0, 0.15);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    margin-bottom: 1.2rem;
    border-radius: 10px;
  }
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    animation: shine 3s infinite;
  }

  @keyframes shine {
    0% { left: -100%; }
    50% { left: 100%; }
    100% { left: 100%; }
  }
`;

const CardSection = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 220px;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    max-width: 180px;
  }
  
  @media (max-width: 480px) {
    max-width: 150px;
  }
`;

const Card = styled.div<{ isReversed?: boolean }>`
  width: 180px;
  height: 280px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    width: 150px;
    height: 230px;
  }
  
  @media (max-width: 480px) {
    width: 120px;
    height: 190px;
    margin-bottom: 0.7rem;
  }
`;

const CardImage = styled.img<{ isReversed?: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: ${props => props.isReversed ? 'rotate(180deg)' : 'none'};
`;

const CardInfo = styled.div`
  text-align: center;
  
  @media (max-width: 480px) {
    flex: 1;
    text-align: left;
  }
`;

const CardName = styled.h3`
  color: #ffd700;
  margin-bottom: 0.7rem;
  font-size: 1.3rem;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 0.6rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
`;

const CardDescription = styled.p`
  color: #e0e0e0;
  margin: 0.8rem 0;
  line-height: 1.6;
  font-size: 1.1rem;
  text-align: center;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
    padding: 0.5rem 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    line-height: 1.4;
    padding: 0.4rem 0.6rem;
  }
`;

const InterpretationSection = styled.div`
  margin-top: 3rem;
  width: 100%;
  
  @media (max-width: 768px) {
    margin-top: 2.5rem;
  }
  
  @media (max-width: 480px) {
    margin-top: 2rem;
  }
`;

const DetailSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2.5rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 768px) {
    padding: 2rem;
    margin-bottom: 2rem;
    border-radius: 14px;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border-radius: 12px;
  }
`;

const SummarySection = styled(DetailSection)`
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.2);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent,
      rgba(255, 215, 0, 0.05),
      transparent
    );
    animation: shimmer 5s infinite;
  }
  
  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
`;

const SectionTitle = styled.h3`
  color: #ffd700;
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 1.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
  
  &:before, &:after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255, 215, 0, 0.3);
    margin: 0 1rem;
  }
`;

const Interpretation = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2.5rem;
  color: #e0e0e0;
  font-size: 1.1rem;
  line-height: 1.7;
  text-align: justify;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 2rem;
    font-size: 1rem;
    line-height: 1.6;
    border-radius: 10px;
  }
  
  @media (max-width: 480px) {
    padding: 1.2rem;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
    line-height: 1.5;
    border-radius: 8px;
    text-align: left;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 3rem;
  width: 100%;
  
  @media (max-width: 768px) {
    margin-top: 2.5rem;
  }
  
  @media (max-width: 480px) {
    flex-direction: row;
    gap: 0.5rem;
    margin-top: 2rem;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: rgba(26, 26, 46, 0.9);
    padding: 0.8rem;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  }
`;

const StyledButton = styled.button`
  background: linear-gradient(45deg, #6b6bff, #8e8eff);
  border: none;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 0.9rem 1.8rem;
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    flex: 1;
    justify-content: center;
    padding: 0.8rem 0.5rem;
    font-size: 0.9rem;
    gap: 0.3rem;
  }
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

interface TarotResultProps {
  cards: TarotCardResult[];
  onBack: () => void;
  onShare: () => void;
}

const TarotResult: React.FC<TarotResultProps> = ({ cards, onBack, onShare }) => {
  // 生成各个方面的解读
  const generateDetailedInterpretation = () => {
    const interpretations = {
      career: '',
      love: '',
      mental: ''
    };

    // 根据卡牌组合生成解读
    cards.forEach(card => {
      const cardEffect = card.isReversed ? card.reversedMeaning : card.meaning;
      
      if (card.position === '过去') {
        interpretations.mental += `过去的${cardEffect}经历，`;
      } else if (card.position === '现在') {
        interpretations.career += `目前${cardEffect}的状态，`;
        interpretations.love += `在感情中${cardEffect}，`;
      } else if (card.position === '未来') {
        interpretations.career += `未来将会${cardEffect}。`;
        interpretations.love += `将会遇到${cardEffect}的情况。`;
        interpretations.mental += `这将帮助你${cardEffect}。`;
      }
    });

    return interpretations;
  };

  // 生成总体建议
  const generateSummary = () => {
    const pastCard = cards.find(card => card.position === '过去');
    const presentCard = cards.find(card => card.position === '现在');
    const futureCard = cards.find(card => card.position === '未来');

    if (!pastCard || !presentCard || !futureCard) return '';

    const pastEffect = pastCard.isReversed ? pastCard.reversedMeaning : pastCard.meaning;
    const presentEffect = presentCard.isReversed ? presentCard.reversedMeaning : presentCard.meaning;
    const futureEffect = futureCard.isReversed ? futureCard.reversedMeaning : futureCard.meaning;

    return `根据塔罗牌的指引，让我们一起解读您的人生轨迹。在过去的经历中，${pastEffect}的状态影响着您的决策和行动。这段经历为您积累了宝贵的经验，也在您的内心留下了深刻的印记。

目前，您正处于${presentEffect}的阶段。这个时期需要您保持清晰的判断力，在各个方面都保持积极向上的态度。

展望未来，${futureEffect}的征兆预示着即将到来的变化和机遇。记住，每一次的挫折都是成长的机会，每一个选择都在塑造您的未来。

建议您在这个时期保持内心的平静，相信自己的判断，同时也要适时寻求他人的建议和支持。机会总是青睐有准备的人，保持耐心和信心，您一定能够实现自己的目标。`;
  };

  const interpretations = generateDetailedInterpretation();

  const copyInterpretation = () => {
    const pastCard = cards.find(card => card.position === '过去');
    const presentCard = cards.find(card => card.position === '现在');
    const futureCard = cards.find(card => card.position === '未来');

    if (!pastCard || !presentCard || !futureCard) {
      message.error('无法复制解读文本，卡片数据不完整');
      return;
    }

    const textToCopy = `
二次元占卜屋·JOJO塔罗牌占卜结果

过去：${pastCard.name}${pastCard.isReversed ? '（逆位）' : ''}
${pastCard.isReversed ? pastCard.reversedMeaning : pastCard.meaning}

现在：${presentCard.name}${presentCard.isReversed ? '（逆位）' : ''}
${presentCard.isReversed ? presentCard.reversedMeaning : presentCard.meaning}

未来：${futureCard.name}${futureCard.isReversed ? '（逆位）' : ''}
${futureCard.isReversed ? futureCard.reversedMeaning : futureCard.meaning}

塔罗指引：
${generateSummary()}
    `;

    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        message.success('解读文本已复制到剪贴板');
      })
      .catch(() => {
        message.error('复制失败，请手动复制');
      });
  };

  return (
    <Container>
      <Title>塔罗牌解读</Title>

      <ResultGrid>
        {cards.map((card, index) => (
          <CardContainer key={index}>
            <Card isReversed={card.isReversed}>
              <CardImage 
                src={card.image} 
                alt={card.name}
                isReversed={card.isReversed}
              />
            </Card>
            <CardName>
              {card.name} ({card.position})
              <br />
              {card.isReversed ? '(逆位)' : '(正位)'}
            </CardName>
          </CardContainer>
        ))}
      </ResultGrid>

      {cards.map((card, index) => (
        <ResultCard key={index}>
          <SectionTitle>{card.position}: {card.name} {card.isReversed ? '(逆位)' : '(正位)'}</SectionTitle>
          <CardDescription>
            {card.isReversed 
              ? (card.reversedMeaning || `${card.name}逆位表示你可能面临一些挑战，需要重新审视自己的处境。`) 
              : (card.meaning || `${card.name}牌代表了改变和转机，这可能影响你的决策和行动。`)}
          </CardDescription>
        </ResultCard>
      ))}

      <InterpretationSection>
        <DetailSection>
          <SectionTitle>事业发展</SectionTitle>
          <Interpretation>{interpretations.career || '根据塔罗牌的指引，你的事业正在经历一个转变期。保持开放的心态，寻找新的机会和可能性。'}</Interpretation>

          <SectionTitle>感情状况</SectionTitle>
          <Interpretation>{interpretations.love || '在感情方面，塔罗牌显示你需要更多的自我认知和沟通。无论是否有伴侣，关键是保持真实和坦诚。'}</Interpretation>

          <SectionTitle>心理指引</SectionTitle>
          <Interpretation>{interpretations.mental || '在心理层面，塔罗牌建议你寻找内心的平静和平衡。通过冥想、反思或艺术创作来探索你的情感世界。'}</Interpretation>
        </DetailSection>

        <SummarySection>
          <SectionTitle>塔罗指引</SectionTitle>
          <Interpretation>
            {generateSummary() || '塔罗牌的整体指引是关注当下，接受变化，并相信自己内心的指引。每张牌都代表你生命旅程中的一个阶段或面向，通过理解它们，你可以更好地掌握自己的命运。'}
          </Interpretation>
        </SummarySection>
      </InterpretationSection>

      <ButtonContainer>
        <StyledButton 
          onClick={onBack}
        >
          <ArrowLeftOutlined />
          返回首页
        </StyledButton>
        <StyledButton 
          onClick={copyInterpretation}
        >
          <CopyOutlined />
          复制解读
        </StyledButton>
        <StyledButton 
          onClick={onShare}
          style={{ background: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)' }}
        >
          <ShareAltOutlined />
          分享结果
        </StyledButton>
      </ButtonContainer>
    </Container>
  );
};

export default TarotResult; 