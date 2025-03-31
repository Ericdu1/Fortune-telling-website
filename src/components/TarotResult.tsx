import React from 'react';
import styled from '@emotion/styled';
import { Button, message } from 'antd';
import { ArrowLeftOutlined, ShareAltOutlined, CopyOutlined } from '@ant-design/icons';
import { TarotCardResult } from '../types/tarot';

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

const ResultCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  
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
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const CardImage = styled.img<{ isReversed?: boolean }>`
  width: 120px;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
  transform: ${props => props.isReversed ? 'rotate(180deg)' : 'none'};
`;

const CardInfo = styled.div`
  flex: 1;
`;

const CardName = styled.h3`
  color: #ffd700;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const CardDescription = styled.p`
  color: #e0e0e0;
  margin-bottom: 0.5rem;
  line-height: 1.6;
`;

const InterpretationSection = styled.div`
  margin-top: 3rem;
`;

const DetailSection = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SummarySection = styled(DetailSection)`
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.2);
`;

const SectionTitle = styled.h3`
  color: #ffd700;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
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

const Interpretation = styled.p`
  color: #e0e0e0;
  line-height: 1.8;
  margin-bottom: 1rem;
  text-indent: 2em;
  font-size: 1.1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
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

      {cards.map((card, index) => (
        <ResultCard key={index}>
          <CardSection>
            <CardImage 
              src={card.image} 
              alt={card.name}
              isReversed={card.isReversed}
            />
            <CardInfo>
              <CardName>
                {card.name} ({card.isReversed ? '逆位' : '正位'})
              </CardName>
              <CardDescription>
                {card.isReversed 
                  ? (card.reversedMeaning || `${card.name}逆位表示你可能面临一些挑战，需要重新审视自己的处境。`) 
                  : (card.meaning || `${card.name}牌代表了改变和转机，这可能影响你的决策和行动。`)}
              </CardDescription>
            </CardInfo>
          </CardSection>
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
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
        >
          返回首页
        </StyledButton>
        <StyledButton 
          icon={<CopyOutlined />}
          onClick={copyInterpretation}
        >
          复制解读
        </StyledButton>
        <StyledButton 
          icon={<ShareAltOutlined />}
          onClick={onShare}
          type="primary"
        >
          分享结果
        </StyledButton>
      </ButtonContainer>
    </Container>
  );
};

export default TarotResult; 