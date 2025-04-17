import React from 'react';
import styled from '@emotion/styled';
import { Button } from 'antd';
import { StarOutlined, CalendarOutlined, ExperimentOutlined } from '@ant-design/icons';

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  color: white;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  text-align: center;
`;

const Subtitle = styled.h2`
  font-size: 1.5rem;
  color: #ffd700;
  margin-bottom: 2rem;
  opacity: 0.8;
  text-align: center;
`;

const DailyFortune = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  margin-top: 2rem;
  border: 1px solid rgba(255, 215, 0, 0.3);
`;

const DailyTitle = styled.h3`
  color: #ffd700;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
`;

const DailyContent = styled.div`
  text-align: center;

  p {
    color: #e0e0e0;
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
`;

const StyledButton = styled(Button)`
  background: linear-gradient(45deg, #6b6bff, #8e8eff);
  border: none;
  height: 48px;
  font-size: 1.1rem;
  padding: 0 3rem;
  
  &:hover {
    background: linear-gradient(45deg, #5a5aff, #7d7dff);
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FunctionCard = styled.div<{ isNew?: boolean }>`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 215, 0, 0.3);
  position: relative;

  &:hover {
    transform: translateX(-5px);
    background: rgba(255, 255, 255, 0.15);
    border-color: #ffd700;
  }

  ${props => props.isNew && `
    &:after {
      content: 'NEW';
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: #ffd700;
      color: #1a1a2e;
      padding: 0.2rem 0.5rem;
      border-radius: 10px;
      font-size: 0.8rem;
      font-weight: bold;
    }
  `}
`;

const FunctionTitle = styled.h3`
  color: #ffd700;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FunctionDescription = styled.p`
  color: #e0e0e0;
  font-size: 0.9rem;
  margin: 0;
  opacity: 0.9;
`;

const DisabledFunction = styled(FunctionCard)`
  opacity: 0.5;
  cursor: not-allowed;
  
  &:hover {
    transform: none;
    border-color: rgba(255, 215, 0, 0.3);
  }
`;

interface HomeProps {
  onStartTarot: () => void;
  onStartDaily: () => void;
  onStartJojoMbti: () => void;
}

const Home: React.FC<HomeProps> = ({ onStartTarot, onStartDaily, onStartJojoMbti }) => {
  return (
    <Container>
      <Title>二次元占卜屋</Title>
      <Subtitle>探索你的命运，揭示生活的奥秘</Subtitle>
      
      <DailyFortune>
        <DailyTitle>
          <CalendarOutlined /> 每日运势
        </DailyTitle>
        <DailyContent>
          <p>每天一次的运势预测，让你了解今日的吉凶祸福</p>
          <StyledButton type="primary" size="large" onClick={onStartDaily}>
            开始占卜
          </StyledButton>
        </DailyContent>
      </DailyFortune>
      
      <Sidebar>
        <FunctionCard onClick={onStartTarot}>
          <FunctionTitle>
            <StarOutlined /> 塔罗牌占卜
          </FunctionTitle>
          <FunctionDescription>
            解读塔罗牌的神秘信息，指引未来方向
          </FunctionDescription>
        </FunctionCard>
        
        <FunctionCard onClick={onStartJojoMbti} isNew={true}>
          <FunctionTitle>
            <ExperimentOutlined /> JOJO MBTI测试
          </FunctionTitle>
          <FunctionDescription>
            测试你是JOJO中的哪个角色，你的替身是什么
          </FunctionDescription>
        </FunctionCard>
        
        <DisabledFunction>
          <FunctionTitle>
            更多功能
          </FunctionTitle>
          <FunctionDescription>
            更多二次元占卜功能，敬请期待...
          </FunctionDescription>
        </DisabledFunction>
      </Sidebar>
    </Container>
  );
};

export default Home; 