import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { 
  HomeOutlined, 
  RobotOutlined, 
  ExperimentOutlined, 
  StarOutlined,
  HistoryOutlined,
  UserOutlined
} from '@ant-design/icons';

const SidebarContainer = styled(motion.div)`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 80px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
  gap: 2rem;
  z-index: 1000;
`;

const NavItem = styled(motion.div)<{ active?: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: ${props => props.active ? 'rgba(107, 107, 255, 0.3)' : 'transparent'};
  color: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.7)'};
  transition: all 0.3s ease;

  &:hover {
    background: rgba(107, 107, 255, 0.2);
    color: #fff;
  }
`;

const IconWrapper = styled.div`
  font-size: 24px;
`;

const Tooltip = styled(motion.div)`
  position: absolute;
  left: 80px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-size: 14px;
  white-space: nowrap;
  pointer-events: none;
`;

type Step = 
  | 'home' 
  | 'form' 
  | 'fortune-result' 
  | 'mbti-test' 
  | 'mbti-result' 
  | 'tarot-reading' 
  | 'tarot-result' 
  | 'ai-interpretation' 
  | 'history' 
  | 'login' 
  | 'register' 
  | 'profile' 
  | 'share';

interface SidebarProps {
  currentStep: Step;
  onNavigate: (step: Step) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentStep, onNavigate }) => {
  const navItems = [
    { icon: <HomeOutlined />, label: '首页', step: 'home' as Step },
    { icon: <RobotOutlined />, label: 'AI算命', step: 'form' as Step },
    { icon: <ExperimentOutlined />, label: 'MBTI测试', step: 'mbti-test' as Step },
    { icon: <StarOutlined />, label: '塔罗牌', step: 'tarot-reading' as Step },
    { icon: <HistoryOutlined />, label: '历史记录', step: 'history' as Step },
    { icon: <UserOutlined />, label: '个人中心', step: 'profile' as Step }
  ];

  return (
    <SidebarContainer
      initial={{ x: -80 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {navItems.map((item, index) => (
        <NavItem
          key={item.step}
          active={currentStep === item.step}
          onClick={() => onNavigate(item.step)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <IconWrapper>{item.icon}</IconWrapper>
          <Tooltip
            initial={{ opacity: 0, x: 20 }}
            whileHover={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {item.label}
          </Tooltip>
        </NavItem>
      ))}
    </SidebarContainer>
  );
};

export default Sidebar; 