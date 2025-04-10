import React from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { 
  CalendarOutlined, 
  ProjectOutlined, 
  ExperimentOutlined, 
  RobotOutlined,
  HistoryOutlined,
  UserOutlined
} from '@ant-design/icons';

const Container = styled.div`
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: #f0f0f0;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
`;

const Subtitle = styled(motion.h2)`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #ffd700;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.2rem;
  margin-bottom: 3rem;
  color: #b8b8b8;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.2rem;
  }
`;

const CardIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: #ffd700;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
    margin-bottom: 0.8rem;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: white;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const CardDescription = styled.p`
  font-size: 1rem;
  color: #b8b8b8;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const UserActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.8rem;
  }
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  @media (max-width: 480px) {
    width: 80%;
    margin: 0 auto;
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
        二次元占卜屋
      </Title>
      
      {isLoggedIn && (
        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          欢迎回来，{username}
        </Subtitle>
      )}
      
      <Description
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {isLoggedIn ? '今天的命运，等待你来探索' : '探索你的命运，揭示生活的奥秘'}
      </Description>
      
      <CardGrid>
        <FeatureCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          onClick={onStartFortune}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <CardIcon><CalendarOutlined /></CardIcon>
          <CardTitle>每日运势</CardTitle>
          <CardDescription>查看今日运势，掌握好运密码</CardDescription>
        </FeatureCard>
        
        <FeatureCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          onClick={onStartMBTI}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <CardIcon><ProjectOutlined /></CardIcon>
          <CardTitle>MBTI测试</CardTitle>
          <CardDescription>发现你的性格类型，了解真实的自己</CardDescription>
        </FeatureCard>
        
        <FeatureCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          onClick={onStartTarot}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <CardIcon><ExperimentOutlined /></CardIcon>
          <CardTitle>塔罗牌占卜</CardTitle>
          <CardDescription>解读塔罗牌的神秘信息，指引未来方向</CardDescription>
        </FeatureCard>
        
        <FeatureCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          onClick={onStartAI}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <CardIcon><RobotOutlined /></CardIcon>
          <CardTitle>AI解梦</CardTitle>
          <CardDescription>智能分析梦境含义，探索潜意识信息</CardDescription>
        </FeatureCard>
      </CardGrid>
      
      {isLoggedIn && (
        <UserActions>
          <ActionButton 
            onClick={onViewHistory}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <HistoryOutlined /> 查看历史记录
          </ActionButton>
          <ActionButton 
            onClick={onViewProfile}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <UserOutlined /> 个人资料
          </ActionButton>
        </UserActions>
      )}
    </Container>
  );
};

export default HomePage; 