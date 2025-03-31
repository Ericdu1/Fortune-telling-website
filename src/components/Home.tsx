import React from 'react';
import styled from '@emotion/styled';
import { Button } from 'antd';
import { StarOutlined, CalendarOutlined } from '@ant-design/icons';

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
}

const Home: React.FC<HomeProps> = ({ onStartTarot, onStartDaily }) => {
  return (
    <Container>
      <Title>二次元占卜屋</Title>
      <Subtitle>来自JOJO的神秘力量</Subtitle>

      <DailyFortune>
        <DailyTitle>
          <CalendarOutlined /> 今日运势
        </DailyTitle>
        <DailyContent>
          <p>每日12:00更新</p>
          <StyledButton 
            type="primary"
            onClick={onStartDaily}
          >
            查看今日运势
          </StyledButton>
        </DailyContent>
      </DailyFortune>

      <Sidebar>
        <FunctionCard onClick={onStartTarot}>
          <FunctionTitle>
            <StarOutlined /> 塔罗牌占卜
          </FunctionTitle>
          <FunctionDescription>
            通过JOJO塔罗牌，探索你的命运轨迹
          </FunctionDescription>
        </FunctionCard>

        <DisabledFunction>
          <FunctionTitle>
            <StarOutlined /> 替身能力测试
          </FunctionTitle>
          <FunctionDescription>
            回答问题，发现你的替身能力
          </FunctionDescription>
        </DisabledFunction>

        <DisabledFunction>
          <FunctionTitle>
            <StarOutlined /> 新番放送提醒
          </FunctionTitle>
          <FunctionDescription>
            追踪你喜欢的动漫更新时间
          </FunctionDescription>
        </DisabledFunction>

        <DisabledFunction>
          <FunctionTitle>
            <StarOutlined /> 游戏发售追踪
          </FunctionTitle>
          <FunctionDescription>
            关注你期待的游戏发售信息
          </FunctionDescription>
        </DisabledFunction>

        <DisabledFunction>
          <FunctionTitle>
            <StarOutlined /> 个性化资讯
          </FunctionTitle>
          <FunctionDescription>
            定制你的二次元资讯推送
          </FunctionDescription>
        </DisabledFunction>
      </Sidebar>
    </Container>
  );
};

export default Home; 