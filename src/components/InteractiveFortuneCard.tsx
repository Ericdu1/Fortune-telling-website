import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { BookOutlined, StarOutlined } from '@ant-design/icons';

interface CardProps {
  frontContent: React.ReactNode;
  backContent?: React.ReactNode;
  onClick?: () => void;
  isFlipped: boolean;
  onFlip?: () => void;
  style?: React.CSSProperties;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

const CardContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 300px;
  height: 400px;
  perspective: 1000px;
  cursor: pointer;
  margin: 0 auto;
`;

const CardInner = styled(motion.div)<{ isFlipped: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.8s;
  transform: ${props => props.isFlipped ? 'rotateY(180deg)' : 'rotateY(0)'};
`;

const CardSide = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  overflow: hidden;
`;

const CardFront = styled(CardSide)`
  background: linear-gradient(135deg, #6941C6, #3730A3);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const CardBack = styled(CardSide)`
  background: linear-gradient(135deg, #1D2671, #C33764);
  color: white;
  transform: rotateY(180deg);
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow-y: auto;
`;

const CardIcon = styled(motion.div)`
  font-size: 64px;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.8);
`;

const CardTitle = styled.h3`
  font-size: 24px;
  margin-bottom: 10px;
  text-align: center;
`;

const FavoriteButton = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.color || '#FFF'};
  
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

const InteractiveFortuneCard: React.FC<CardProps> = ({
  frontContent,
  backContent,
  onClick,
  isFlipped,
  onFlip,
  style,
  isFavorite,
  onFavoriteToggle
}) => {
  const handleClick = () => {
    if (onFlip) {
      onFlip();
    }
    if (onClick) {
      onClick();
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle();
    }
  };

  return (
    <CardContainer 
      style={style}
      whileHover={{ translateY: -10 }}
      transition={{ duration: 0.3 }}
    >
      {onFavoriteToggle && (
        <FavoriteButton onClick={handleFavoriteClick} color={isFavorite ? '#FFD700' : '#FFF'}>
          <StarOutlined />
        </FavoriteButton>
      )}
      <CardInner isFlipped={isFlipped} onClick={handleClick}>
        <CardFront>
          <CardIcon 
            animate={{ rotate: [0, 10, 0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
          >
            <BookOutlined />
          </CardIcon>
          {frontContent}
        </CardFront>
        <CardBack>
          {backContent}
        </CardBack>
      </CardInner>
    </CardContainer>
  );
};

export default InteractiveFortuneCard; 