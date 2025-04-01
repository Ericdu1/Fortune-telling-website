import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal, Typography, Calendar, Badge, Button, Tooltip } from 'antd';
import { 
  CalendarOutlined, 
  TrophyOutlined, 
  FireOutlined,
  CloseOutlined,
  GiftOutlined
} from '@ant-design/icons';
import { formatDate } from '../utils/date';

const { Title, Text } = Typography;

interface StreakCounterProps {
  streakDays: number;
  lastCheckedDate: string;
  onCheckin: () => void;
}

const CounterContainer = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 10px 15px;
  margin-bottom: 20px;
  cursor: pointer;
  border: 1px solid rgba(255, 215, 0, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
`;

const FireIcon = styled(FireOutlined)`
  font-size: 24px;
  color: #ff6b6b;
  margin-right: 10px;
`;

const CounterText = styled.div`
  color: white;
  font-size: 16px;
  flex: 1;
`;

const DaysCount = styled.span`
  color: #ffd700;
  font-weight: bold;
  margin: 0 5px;
`;

const StreakModal = styled(Modal)`
  .ant-modal-content {
    background: rgba(30, 30, 50, 0.95);
    border-radius: 20px;
    backdrop-filter: blur(10px);
  }
  
  .ant-modal-header {
    background: transparent;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .ant-modal-title {
    color: #ffd700;
  }
  
  .ant-modal-close {
    color: #ffd700;
  }
  
  .ant-calendar-header {
    color: white;
  }
`;

const StyledCalendar = styled(Calendar)`
  background: transparent;
  border: none;
  
  .ant-picker-panel {
    background: transparent;
  }
  
  .ant-picker-cell {
    color: rgba(255, 255, 255, 0.65);
  }
  
  .ant-picker-cell-in-view {
    color: white;
  }
  
  .ant-picker-cell-selected {
    .ant-picker-calendar-date {
      background: rgba(255, 215, 0, 0.2);
    }
  }
  
  .ant-picker-calendar-date {
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .ant-picker-cell-today {
    .ant-picker-calendar-date-today {
      border: 1px solid #ffd700;
    }
  }
`;

const RewardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

const MilestoneRow = styled.div<{ achieved: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  background: ${props => props.achieved ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  opacity: ${props => props.achieved ? 1 : 0.7};
`;

const MilestoneIcon = styled.div`
  margin-right: 10px;
  font-size: 24px;
  color: #ffd700;
`;

const MilestoneText = styled.div`
  flex: 1;
`;

const RewardButton = styled(Button)<{ disabled: boolean }>`
  background: ${props => props.disabled ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(45deg, #FFD700, #FFA500)'};
  border: none;
  color: ${props => props.disabled ? 'rgba(255, 255, 255, 0.5)' : 'white'};
  
  &:hover {
    background: ${props => props.disabled ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(45deg, #FFD700, #FF8C00)'};
    color: ${props => props.disabled ? 'rgba(255, 255, 255, 0.5)' : 'white'};
  }
`;

const RewardAnimation = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
`;

const RewardIcon = styled(motion.div)`
  font-size: 80px;
  color: #ffd700;
  margin-bottom: 20px;
`;

const RewardText = styled(motion.h2)`
  font-size: 32px;
  color: white;
  text-align: center;
  margin-bottom: 20px;
`;

// 里程碑定义
const milestones = [
  { days: 3, reward: '额外5金豆奖励', icon: <GiftOutlined />, coins: 5 },
  { days: 7, reward: '免费塔罗牌占卜', icon: <GiftOutlined />, coins: 20 },
  { days: 14, reward: '额外30金豆奖励', icon: <GiftOutlined />, coins: 30 },
  { days: 30, reward: '特殊限定角色解锁', icon: <GiftOutlined />, coins: 50 },
];

const StreakCounter: React.FC<StreakCounterProps> = ({ 
  streakDays, 
  lastCheckedDate,
  onCheckin
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [checkedDates, setCheckedDates] = useState<string[]>([]);
  const [showReward, setShowReward] = useState(false);
  const [currentReward, setCurrentReward] = useState({ days: 0, reward: '', coins: 0 });
  
  useEffect(() => {
    // 加载之前的签到记录
    const savedDates = localStorage.getItem('checkin-dates');
    if (savedDates) {
      setCheckedDates(JSON.parse(savedDates));
    }
  }, []);
  
  const showCalendar = () => {
    setModalVisible(true);
  };
  
  const closeCalendar = () => {
    setModalVisible(false);
  };
  
  const dateCellRender = (date: any) => {
    const dateStr = date.format('YYYY-MM-DD');
    const isChecked = checkedDates.includes(dateStr);
    
    return isChecked ? (
      <Badge color="#ffd700" />
    ) : null;
  };
  
  const handleRewardClaim = (milestone: any) => {
    setCurrentReward(milestone);
    setShowReward(true);
    
    // 更新金豆余额
    const currentCoins = parseInt(localStorage.getItem('fortune-coins') || '0');
    localStorage.setItem('fortune-coins', (currentCoins + milestone.coins).toString());
    
    // 3秒后关闭动画
    setTimeout(() => {
      setShowReward(false);
    }, 3000);
  };
  
  const handleCheckin = () => {
    onCheckin();
    const today = formatDate();
    
    const newCheckedDates = [...checkedDates, today];
    setCheckedDates(newCheckedDates);
    localStorage.setItem('checkin-dates', JSON.stringify(newCheckedDates));
    
    // 自动领取当天里程碑奖励
    const achievedMilestone = milestones.find(m => m.days === streakDays + 1);
    if (achievedMilestone) {
      handleRewardClaim(achievedMilestone);
    }
  };
  
  // 检查今天是否已经签到
  const today = formatDate();
  const canCheckinToday = lastCheckedDate !== today;
  
  return (
    <>
      <Tooltip title="点击查看签到日历">
        <CounterContainer onClick={showCalendar}>
          <FireIcon />
          <CounterText>
            连续签到 <DaysCount>{streakDays}</DaysCount> 天
          </CounterText>
          <CalendarOutlined style={{ color: '#ffd700' }} />
        </CounterContainer>
      </Tooltip>
      
      <StreakModal
        title="签到日历"
        open={modalVisible}
        onCancel={closeCalendar}
        footer={null}
        width={800}
      >
        <StyledCalendar 
          fullscreen={false} 
          dateCellRender={dateCellRender}
        />
        
        {canCheckinToday && (
          <Button 
            type="primary" 
            block 
            style={{ 
              marginTop: 16, 
              background: 'linear-gradient(45deg, #6941C6, #3730A3)',
              height: 45
            }}
            onClick={handleCheckin}
          >
            <FireOutlined /> 今日签到
          </Button>
        )}
        
        <Title level={4} style={{ color: '#ffd700', marginTop: 24, marginBottom: 16 }}>
          <TrophyOutlined /> 里程碑奖励
        </Title>
        
        <RewardsContainer>
          {milestones.map(milestone => {
            const achieved = streakDays >= milestone.days;
            const canClaim = achieved && !checkedDates.includes(`milestone-${milestone.days}`);
            
            return (
              <MilestoneRow key={milestone.days} achieved={achieved}>
                <MilestoneIcon>{milestone.icon}</MilestoneIcon>
                <MilestoneText>
                  <Text style={{ color: 'white', fontSize: 16 }}>
                    连续签到 {milestone.days} 天
                  </Text>
                  <br />
                  <Text style={{ color: 'rgba(255,255,255,0.7)' }}>
                    奖励: {milestone.reward}
                  </Text>
                </MilestoneText>
                <RewardButton 
                  disabled={!canClaim}
                  onClick={() => canClaim && handleRewardClaim(milestone)}
                >
                  {canClaim ? '领取' : achieved ? '已领取' : '未达成'}
                </RewardButton>
              </MilestoneRow>
            );
          })}
        </RewardsContainer>
      </StreakModal>
      
      <AnimatePresence>
        {showReward && (
          <RewardAnimation
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <RewardIcon
              initial={{ scale: 0.5, rotate: -20 }}
              animate={{ scale: 1.2, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <GiftOutlined />
            </RewardIcon>
            <RewardText
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              恭喜获得 <br />
              <span style={{ color: '#ffd700' }}>{currentReward.reward}</span>
            </RewardText>
            <Button 
              type="text" 
              icon={<CloseOutlined />} 
              style={{ color: 'white', marginTop: 20 }}
              onClick={() => setShowReward(false)}
            >
              关闭
            </Button>
          </RewardAnimation>
        )}
      </AnimatePresence>
    </>
  );
};

export default StreakCounter; 