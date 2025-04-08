import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { TarotCardResult } from '../types/tarot';
import { tarotCards } from '../data/tarotCards';

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background: #1a1a2e;
  color: #ffffff;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
`;

const Title = styled.h2`
  color: white;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Description = styled.p`
  color: #e0e0e0;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  max-width: 800px;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 1rem;
    padding: 0 1rem;
  }
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  padding: 2rem;
  margin: 2rem 0;
  justify-items: center;
  
  @media (max-width: 1024px) {
    gap: 1.5rem;
    padding: 1.5rem;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    padding: 1rem;
    margin: 1rem 0;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
    padding: 0.5rem;
  }
  
  &.fade-out {
    animation: fadeOut 0.6s ease-in-out forwards;
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.95);
    }
  }
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 200px;
  perspective: 1000px;
  
  @media (max-width: 1024px) {
    width: 180px;
  }
  
  @media (max-width: 768px) {
    width: 160px;
    gap: 0.5rem;
  }
  
  @media (max-width: 480px) {
    width: 130px;
  }
`;

const Card = styled.div<{ isSelected?: boolean; isRevealed?: boolean; isReversed?: boolean }>`
  width: 100%;
  height: 300px;
  position: relative;
  cursor: pointer;
  transform-style: preserve-3d;
  border-radius: 15px;
  box-shadow: ${props => props.isSelected 
    ? '0 0 30px rgba(255, 107, 107, 0.7)' 
    : '0 8px 20px rgba(0, 0, 0, 0.3)'};
  transition: transform 0.6s, box-shadow 0.3s;
  transform: ${props => props.isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)'};
  
  @media (max-width: 1024px) {
    height: 270px;
  }
  
  @media (max-width: 768px) {
    height: 240px;
  }
  
  @media (max-width: 480px) {
    height: 200px;
    border-radius: 10px;
  }
  
  &:hover {
    box-shadow: ${props => props.isSelected 
      ? '0 0 30px rgba(255, 107, 107, 0.7)' 
      : '0 12px 25px rgba(0, 0, 0, 0.4)'};
  }
  
  ${props => props.isSelected && !props.isRevealed && `
    transform: scale(1.1);
  `}
`;

// 添加位置标签样式
const PositionLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  color: #ffd700;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  z-index: 10;
  pointer-events: none;
  border: 1px solid rgba(255, 215, 0, 0.5);
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  
  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.9rem;
    border-radius: 15px;
  }
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 15px;
  overflow: hidden;
  
  @media (max-width: 480px) {
    border-radius: 10px;
  }
`;

const CardBack = styled(CardFace)`
  background-color: #000;
`;

const CardFront = styled(CardFace)`
  transform: rotateY(180deg);
`;

const positions = ['过去', '现在', '未来'];

interface TarotReadingProps {
  displayCards: TarotCardResult[];
  onComplete: (selectedCards: TarotCardResult[]) => void;
}

const TarotReading: React.FC<TarotReadingProps> = ({ displayCards, onComplete }) => {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [revealedCards, setRevealedCards] = useState<string[]>([]);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isCardRevealed, setIsCardRevealed] = useState<boolean[]>([]);

  const handleCardClick = (cardId: string) => {
    if (isRevealing) return;
    
    if (selectedCards.includes(cardId)) {
      // 如果卡片已选中，则取消选择
      setSelectedCards(prev => prev.filter(id => id !== cardId));
    } else if (selectedCards.length < 3) {
      // 如果卡片未选中且选中的卡片少于3张，则选择卡片
      setSelectedCards(prev => [...prev, cardId]);
    }
  };

  const handleRevealCards = async () => {
    if (selectedCards.length === 3) {
      setIsRevealing(true);
      
      // 依次翻开每张卡片
      for (let i = 0; i < selectedCards.length; i++) {
        const cardId = selectedCards[i];
        await new Promise(resolve => setTimeout(resolve, 800));
        setRevealedCards(prev => [...prev, cardId]);
        setIsCardRevealed(prev => [...prev, false]);
      }

      // 等待所有卡片翻开后的额外延迟，用于渐变效果
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // 添加渐变效果后跳转
      const container = document.querySelector('.cards-container');
      if (container) {
        container.classList.add('fade-out');
        await new Promise(resolve => setTimeout(resolve, 600));
      }
      
      setIsRevealing(false);
      // 将选中的卡片ID转换为完整的卡片对象
      const selectedCardObjects = selectedCards
        .map(id => displayCards.find(card => card.id === id))
        .filter((card): card is TarotCardResult => card !== undefined);
      onComplete(selectedCardObjects);
    }
  };

  return (
    <Container>
      <Title>塔罗牌占卜</Title>
      <Description>
        请选择三张塔罗牌。每张牌将分别代表你的过去、现在和未来。
        选择完成后，点击"揭示结果"按钮查看解读。
        点击已选中的卡片可以取消选择。
      </Description>
      
      <CardsContainer className="cards-container">
        {displayCards.map((card, index) => {
          const isSelected = selectedCards.includes(card.id);
          const isRevealed = revealedCards.includes(card.id);
          const positionIndex = selectedCards.indexOf(card.id);
          
          return (
            <CardWrapper key={card.id}>
              <Card
                isSelected={isSelected}
                isRevealed={isRevealed}
                isReversed={card.isReversed}
                onClick={() => handleCardClick(card.id)}
                style={{
                  transform: isSelected && !isRevealed ? 'scale(1.1)' : isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {isSelected && !isRevealed && (
                  <PositionLabel>
                    {positions[positionIndex]}
                  </PositionLabel>
                )}
                <CardBack>
                  <img 
                    src={`./images/tarot/Tarot_Card_Back.png`} 
                    alt="Card Back" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '15px'
                    }}
                  />
                </CardBack>
                <CardFront>
                  <img
                    src={card.image}
                    alt={card.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '15px',
                      transform: card.isReversed ? 'rotate(180deg)' : 'none'
                    }}
                  />
                </CardFront>
              </Card>
              {isCardRevealed[index] && (
                <div style={{
                  marginTop: '10px',
                  padding: '10px',
                  background: 'rgba(255, 215, 0, 0.1)',
                  borderRadius: '5px',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  color: 'white'
                }}>
                  <p><strong>解读：</strong>{card.isReversed ? card.reversedMeaning : card.meaning}</p>
                </div>
              )}
            </CardWrapper>
          );
        })}
      </CardsContainer>
      
      <ButtonContainer>
        <StyledButton 
          onClick={handleRevealCards}
          disabled={selectedCards.length !== 3 || isRevealing}
        >
          揭示结果
        </StyledButton>
      </ButtonContainer>
    </Container>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  width: 100%;
  padding: 0 1rem;
  
  @media (max-width: 768px) {
    margin-top: 1.5rem;
    padding: 0 0.5rem;
    position: sticky;
    bottom: 1rem;
  }
`;

const StyledButton = styled(Button)`
  background: linear-gradient(45deg, #6b6bff, #8e8eff);
  border: none;
  color: white;
  padding: 0 2.5rem;
  height: 45px;
  font-size: 1.1rem;
  border-radius: 8px;
  
  @media (max-width: 768px) {
    padding: 0 2rem;
    height: 42px;
  }
  
  @media (max-width: 480px) {
    padding: 0 1.5rem;
    height: 40px;
    font-size: 1rem;
    width: 80%;
    max-width: 250px;
  }
  
  &:hover {
    opacity: 0.9;
    color: white;
  }
  &:disabled {
    background: #4a4a6a;
    opacity: 0.7;
    color: #aaa;
  }
`;

export default TarotReading; 