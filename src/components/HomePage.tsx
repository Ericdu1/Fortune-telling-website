import React from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';

const Container = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  margin-bottom: 2rem;
  color: #f0f0f0;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
`;

const Description = styled(motion.p)`
  font-size: 1.2rem;
  margin-bottom: 3rem;
  color: #b8b8b8;
`;

const FortuneButton = styled(motion.button)`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
  border: none;
  border-radius: 30px;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
  }
`;

interface HomeProps {
  onStartFortune: () => void;
  onStartMBTI: () => void;
  onStartTarot: () => void;
  onStartAI: () => void;
  onViewHistory: () => void;
  onViewProfile: () => void;
  isLoggedIn: boolean;
  username: string;
  email: string;
}

const HomePage: React.FC<HomeProps> = ({
  onStartFortune,
  onStartMBTI,
  onStartTarot,
  onStartAI,
  onViewHistory,
  onViewProfile,
  isLoggedIn,
  username,
  email
}) => {
  return (
    <Container className="fortune-container">
      <Title
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        AI 算命大师
      </Title>
      <Description
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {isLoggedIn ? `欢迎回来，${username}` : '探索你的命运，揭示生活的奥秘'}
      </Description>
      <ButtonContainer>
        <FortuneButton
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartFortune}
        >
          运势占卜
        </FortuneButton>
        <FortuneButton
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartMBTI}
        >
          MBTI测试
        </FortuneButton>
        <FortuneButton
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartTarot}
        >
          塔罗牌占卜
        </FortuneButton>
        <FortuneButton
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartAI}
        >
          AI解梦
        </FortuneButton>
      </ButtonContainer>
      {isLoggedIn && (
        <UserActions>
          <ActionButton onClick={onViewHistory}>查看历史记录</ActionButton>
          <ActionButton onClick={onViewProfile}>个人资料</ActionButton>
        </UserActions>
      )}
    </Container>
  );
};

const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const UserActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const ActionButton = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

export default HomePage; 