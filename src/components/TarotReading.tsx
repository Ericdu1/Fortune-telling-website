import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'antd';
import { TarotCard, TarotCardResult } from '../types/tarot';
import { tarotCards } from '../data/tarotCards';

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h2`
  color: white;
  text-align: center;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: #e0e0e0;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  padding: 2rem;
  margin: 2rem 0;
  justify-items: center;
  
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
  width: 100%;
  max-width: 200px;
  perspective: 1000px;
`;

const cardVariants = {
  initial: {
    rotateY: 0,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  },
  selected: {
    scale: 1.1,
    boxShadow: '0 0 25px rgba(255, 107, 107, 0.6)',
    transition: {
      duration: 0.3
    }
  },
  flip: {
    rotateY: 180,
    transition: {
      duration: 0.6,
      type: "spring",
      stiffness: 100
    }
  }
};

const CardFace = styled(motion.div)<{ isBack?: boolean; isReversed?: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 15px;
  background: ${props => props.isBack 
    ? 'url(/images/tarot/Tarot_Card_Back.png) center/cover no-repeat' 
    : 'transparent'};
  transform: ${props => props.isBack ? 'rotateY(0deg)' : 'rotateY(180deg)'};
  transform: ${props => props.isReversed ? 'rotateY(180deg) rotate(180deg)' : props.isBack ? 'rotateY(0deg)' : 'rotateY(180deg)'};
`;

const Card = styled(motion.div)<{ 
  isSelected: boolean; 
  isRevealed: boolean;
  isReversed?: boolean;
}>`
  width: 100%;
  aspect-ratio: 3/5;
  position: relative;
  cursor: pointer;
  transform-style: preserve-3d;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.6s;

  &:hover {
    box-shadow: ${props => props.isSelected 
      ? '0 0 30px rgba(255, 107, 107, 0.7)' 
      : '0 12px 25px rgba(0, 0, 0, 0.4)'};
  }
`;

const CardImage = styled.img<{ isReversed?: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
  transform: ${props => props.isReversed ? 'rotate(180deg)' : 'none'};
`;

const CardContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  text-align: center;
  color: white;
  font-weight: 500;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  background: rgba(0, 0, 0, 0.5);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  pointer-events: none;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const StyledButton = styled(Button)`
  background: linear-gradient(45deg, #6b6bff, #8e8eff);
  border: none;
  color: white;
  padding: 0 2rem;
  height: 40px;
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

const positions = ['过去', '现在', '未来'];

interface TarotReadingProps {
  displayCards: TarotCardResult[];
  onComplete: (selectedCards: TarotCardResult[]) => void;
}

const TarotReading: React.FC<TarotReadingProps> = ({ displayCards, onComplete }) => {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [revealedCards, setRevealedCards] = useState<string[]>([]);
  const [isRevealing, setIsRevealing] = useState(false);

  const handleCardClick = (cardId: string) => {
    if (!isRevealing && selectedCards.length < 3 && !selectedCards.includes(cardId)) {
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
      </Description>
      
      <CardsContainer className="cards-container">
        {displayCards.map((card, index) => (
          <CardWrapper key={card.id}>
            <Card
              isSelected={selectedCards.includes(card.id)}
              isRevealed={revealedCards.includes(card.id)}
              isReversed={selectedCards.includes(card.id) && card.isReversed}
              onClick={() => handleCardClick(card.id)}
              variants={cardVariants}
              initial="initial"
              animate={
                revealedCards.includes(card.id)
                  ? "flip"
                  : selectedCards.includes(card.id)
                  ? "selected"
                  : "initial"
              }
              whileHover={!isRevealing && !revealedCards.includes(card.id) ? "hover" : undefined}
              whileTap={!isRevealing && !revealedCards.includes(card.id) ? "tap" : undefined}
            >
              <CardFace isBack>
                <CardContent>
                  {selectedCards.includes(card.id) 
                    ? positions[selectedCards.indexOf(card.id)]
                    : '点击选择'}
                </CardContent>
              </CardFace>
              <CardFace 
                isReversed={selectedCards.includes(card.id) && card.isReversed}
              >
                <CardImage 
                  src={card.image}
                  alt={card.name}
                  isReversed={selectedCards.includes(card.id) && card.isReversed}
                />
              </CardFace>
            </Card>
          </CardWrapper>
        ))}
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

export default TarotReading; 