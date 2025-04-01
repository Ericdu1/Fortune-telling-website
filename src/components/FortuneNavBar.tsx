import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Avatar, Dropdown, Badge, Tooltip } from 'antd';
import { 
  UserOutlined, 
  HeartOutlined, 
  HistoryOutlined, 
  GiftOutlined,
  MenuOutlined,
  BulbOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';

interface NavBarProps {
  onShowCollection: () => void;
  onShowHistory: () => void;
  onShowShop: () => void;
}

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #ffd700;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
  }
`;

const CoinBalance = styled.div`
  display: flex;
  align-items: center;
  background: rgba(255, 215, 0, 0.2);
  border-radius: 20px;
  padding: 5px 12px;
  margin-right: 10px;
  color: #ffd700;
  font-weight: bold;
`;

const CoinIcon = styled(motion.div)`
  width: 20px;
  height: 20px;
  background: #ffd700;
  border-radius: 50%;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.8);
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
`;

const IconButton = styled(motion.div)`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  margin-left: 10px;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
`;

const FortuneNavBar: React.FC<NavBarProps> = ({ 
  onShowCollection, 
  onShowHistory,
  onShowShop
}) => {
  const [coinBalance, setCoinBalance] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  
  useEffect(() => {
    const loadBalance = () => {
      const balance = parseInt(localStorage.getItem('fortune-coins') || '0');
      setCoinBalance(balance);
    };
    
    loadBalance();
    
    // 监听金豆变化
    const checkBalanceInterval = setInterval(() => {
      const newBalance = parseInt(localStorage.getItem('fortune-coins') || '0');
      if (newBalance !== coinBalance) {
        setCoinBalance(newBalance);
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 1000);
      }
    }, 2000);
    
    return () => clearInterval(checkBalanceInterval);
  }, [coinBalance]);
  
  const menuItems = [
    {
      key: 'collection',
      label: '我的收藏',
      icon: <HeartOutlined />,
      onClick: onShowCollection
    },
    {
      key: 'history',
      label: '历史运势',
      icon: <HistoryOutlined />,
      onClick: onShowHistory
    },
    {
      key: 'shop',
      label: '金豆商城',
      icon: <GiftOutlined />,
      onClick: onShowShop
    }
  ];
  
  return (
    <NavContainer>
      <Logo>
        <BulbOutlined /> 今日运势
      </Logo>
      
      <NavActions>
        <CoinBalance>
          <CoinIcon 
            animate={showAnimation ? 
              { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : 
              {}
            }
            transition={{ duration: 0.5 }}
          >
            ¥
          </CoinIcon>
          {coinBalance}
        </CoinBalance>
        
        <UserSection>
          <Tooltip title="我的收藏">
            <IconButton 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onShowCollection}
            >
              <HeartOutlined />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="历史运势">
            <IconButton 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onShowHistory}
            >
              <HistoryOutlined />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="金豆商城">
            <Badge count={coinBalance >= 100 ? 'NEW' : 0} offset={[-5, 5]}>
              <IconButton 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onShowShop}
              >
                <GiftOutlined />
              </IconButton>
            </Badge>
          </Tooltip>
          
          <Dropdown 
            menu={{ items: menuItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <IconButton 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{ marginLeft: '10px' }}
            >
              <MenuOutlined />
            </IconButton>
          </Dropdown>
        </UserSection>
      </NavActions>
    </NavContainer>
  );
};

export default FortuneNavBar; 