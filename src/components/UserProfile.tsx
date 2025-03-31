import React from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { Button, Avatar, Card, Statistic } from 'antd';
import { UserOutlined, LogoutOutlined, HistoryOutlined } from '@ant-design/icons';

const Container = styled(motion.div)`
  width: 100%;
  max-width: 800px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
`;

const Title = styled.h2`
  color: #fff;
  text-align: center;
  margin-bottom: 2rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Username = styled.h3`
  color: #fff;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
`;

const Email = styled.p`
  color: #a0a0a0;
  margin: 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
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
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StyledCard = styled(Card)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  .ant-card-body {
    padding: 1.5rem;
  }
  .ant-statistic-title {
    color: #a0a0a0;
  }
  .ant-statistic-content {
    color: #fff;
  }
`;

interface UserProfileProps {
  username: string;
  email: string;
  stats: {
    totalReadings: number;
    mbtiTests: number;
    tarotReadings: number;
    aiInterpretations: number;
  };
  onViewHistory: () => void;
  onLogout: () => void;
  onBack: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  username,
  email,
  stats,
  onViewHistory,
  onLogout,
  onBack
}) => {
  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title>个人中心</Title>

      <ProfileHeader>
        <Avatar size={80} icon={<UserOutlined />} />
        <UserInfo>
          <Username>{username}</Username>
          <Email>{email}</Email>
        </UserInfo>
        <ButtonContainer>
          <StyledButton icon={<HistoryOutlined />} onClick={onViewHistory}>
            查看历史
          </StyledButton>
          <StyledButton icon={<LogoutOutlined />} onClick={onLogout}>
            退出登录
          </StyledButton>
        </ButtonContainer>
      </ProfileHeader>

      <StatsContainer>
        <StyledCard>
          <Statistic
            title="总占卜次数"
            value={stats.totalReadings}
            prefix={<HistoryOutlined />}
          />
        </StyledCard>
        <StyledCard>
          <Statistic
            title="MBTI测试"
            value={stats.mbtiTests}
            prefix={<UserOutlined />}
          />
        </StyledCard>
        <StyledCard>
          <Statistic
            title="塔罗牌占卜"
            value={stats.tarotReadings}
            prefix={<HistoryOutlined />}
          />
        </StyledCard>
        <StyledCard>
          <Statistic
            title="AI解读"
            value={stats.aiInterpretations}
            prefix={<UserOutlined />}
          />
        </StyledCard>
      </StatsContainer>

      <ButtonContainer style={{ justifyContent: 'center' }}>
        <StyledButton onClick={onBack}>
          返回首页
        </StyledButton>
      </ButtonContainer>
    </Container>
  );
};

export default UserProfile; 