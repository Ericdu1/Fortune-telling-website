import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Typography } from 'antd';

const { Text } = Typography;

interface CharacterProps {
  character: {
    id: string;
    name: string;
    avatar: string;
    personality: string;
    style: {
      primaryColor: string;
      secondaryColor: string;
      accent: string;
    };
  };
  fortune: string;
}

const CharacterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin-bottom: 30px;
`;

const CharacterImageContainer = styled(motion.div)`
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 75px;
  overflow: hidden;
  margin-bottom: 15px;
  border: 3px solid ${props => props.color || '#ffd700'};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const CharacterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CharacterName = styled.h3`
  font-size: 22px;
  color: ${props => props.color || '#ffd700'};
  margin-bottom: 10px;
  text-align: center;
`;

const SpeechBubble = styled(motion.div)<{bgColor?: string; textColor?: string}>`
  position: relative;
  background: ${props => props.bgColor || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 15px;
  padding: 20px;
  color: ${props => props.textColor || 'white'};
  font-size: 16px;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;

  &:before {
    content: '';
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 0 15px 15px;
    border-style: solid;
    border-color: ${props => props.bgColor || 'rgba(255, 255, 255, 0.1)'} transparent;
  }
`;

const EmotionIcon = styled.span`
  font-size: 20px;
  margin: 0 5px;
`;

const FortuneCharacter: React.FC<CharacterProps> = ({ character, fortune }) => {
  // 根据运势内容添加表情符号
  const addEmotions = (text: string) => {
    // 创建不同的表情组合
    const positiveEmotions = ['✨', '😊', '🌟', '💫', '🎉'];
    const negativeEmotions = ['😔', '😓', '💧', '🌧️', '⚡'];
    const neutralEmotions = ['🤔', '😐', '🌈', '🍀', '🔮'];
    
    // 简单分析运势是积极还是消极的
    const isPositive = text.includes('好运') || text.includes('顺利') || text.includes('成功');
    const isNegative = text.includes('不顺') || text.includes('困难') || text.includes('失败');
    
    // 选择表情组
    const emotions = isPositive 
      ? positiveEmotions 
      : isNegative 
        ? negativeEmotions 
        : neutralEmotions;
    
    // 将运势文本拆分为段落
    const paragraphs = text.split('\n').filter(p => p.trim().length > 0);
    
    // 为每个段落添加表情
    return paragraphs.map((paragraph, index) => {
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      return (
        <React.Fragment key={index}>
          <p>
            {paragraph} <EmotionIcon>{randomEmotion}</EmotionIcon>
          </p>
          {index < paragraphs.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  // 根据角色个性调整运势表达方式
  const characterizeFortune = (text: string, personality: string) => {
    let result = text;
    
    switch (personality) {
      case 'energetic':
        result = result.replace(/。/g, '！');
        result = `${result}\n啊哈哈～今天也要元气满满哦！`;
        break;
      case 'shy':
        result = result.replace(/我认为/g, '那个...我觉得...');
        result = `${result}\n嗯...希望这个预测对你有帮助...`;
        break;
      case 'arrogant':
        result = result.replace(/建议/g, '本大人命令你');
        result = `哼！${result}\n感谢本大人的预言吧！`;
        break;
      case 'mysterious':
        result = `${result}\n命运的齿轮已经开始转动...`;
        break;
      default:
        break;
    }
    
    return result;
  };

  return (
    <CharacterContainer>
      <CharacterImageContainer 
        color={character.style.primaryColor}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <CharacterImage src={character.avatar} alt={character.name} />
      </CharacterImageContainer>
      
      <CharacterName color={character.style.accent}>
        {character.name}
      </CharacterName>
      
      <SpeechBubble 
        bgColor={`rgba(${parseInt(character.style.primaryColor.slice(1, 3), 16)}, 
                        ${parseInt(character.style.primaryColor.slice(3, 5), 16)}, 
                        ${parseInt(character.style.primaryColor.slice(5, 7), 16)}, 0.2)`}
        textColor={character.style.secondaryColor}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {addEmotions(characterizeFortune(fortune, character.personality))}
      </SpeechBubble>
    </CharacterContainer>
  );
};

export default FortuneCharacter; 