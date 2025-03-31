import React from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { Button, Timeline, Tag } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
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
`;

const StyledTimeline = styled(Timeline)`
  .ant-timeline-item-content {
    color: #fff;
  }
  .ant-timeline-item-tail {
    border-left-color: rgba(255, 255, 255, 0.2);
  }
  .ant-timeline-item-head {
    background-color: #6b6bff;
    border-color: #6b6bff;
  }
`;

const HistoryItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 0.5rem;
`;

const HistoryTitle = styled.h3`
  color: #ff8e8e;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;

const HistoryContent = styled.p`
  color: #e0e0e0;
  margin-bottom: 0.5rem;
  line-height: 1.5;
`;

const HistoryMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #a0a0a0;
  font-size: 0.9rem;
`;

interface HistoryRecord {
  id: string;
  type: 'fortune' | 'mbti' | 'tarot' | 'ai';
  title: string;
  content: string;
  date: string;
  category?: string;
}

interface HistoryProps {
  records: HistoryRecord[];
  onBack: () => void;
}

const History: React.FC<HistoryProps> = ({ records, onBack }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'fortune':
        return '#6b6bff';
      case 'mbti':
        return '#8e8eff';
      case 'tarot':
        return '#ff8e8e';
      case 'ai':
        return '#4CAF50';
      default:
        return '#6b6bff';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'fortune':
        return '运势占卜';
      case 'mbti':
        return 'MBTI测试';
      case 'tarot':
        return '塔罗牌';
      case 'ai':
        return 'AI解读';
      default:
        return type;
    }
  };

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title>历史记录</Title>

      <StyledTimeline
        items={records.map(record => ({
          dot: <ClockCircleOutlined style={{ fontSize: '16px', color: getTypeColor(record.type) }} />,
          children: (
            <HistoryItem>
              <HistoryTitle>
                {getTypeLabel(record.type)}
                {record.category && (
                  <Tag color={getTypeColor(record.type)} style={{ marginLeft: '0.5rem' }}>
                    {record.category}
                  </Tag>
                )}
              </HistoryTitle>
              <HistoryContent>{record.content}</HistoryContent>
              <HistoryMeta>
                <span>{record.date}</span>
              </HistoryMeta>
            </HistoryItem>
          )
        }))}
      />

      <ButtonContainer>
        <StyledButton onClick={onBack}>
          返回首页
        </StyledButton>
      </ButtonContainer>
    </Container>
  );
};

export default History; 