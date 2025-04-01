import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Modal, Typography, Card, Button, Tabs, message, Badge, Tooltip } from 'antd';
import { 
  GiftOutlined, 
  CrownOutlined, 
  StarOutlined, 
  BulbOutlined,
  RocketOutlined 
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Text, Paragraph } = Typography;

interface CoinShopProps {
  visible: boolean;
  onClose: () => void;
}

const ShopModal = styled(Modal)`
  .ant-modal-content {
    background: rgba(20, 20, 40, 0.9);
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
`;

const BalanceDisplay = styled.div`
  background: linear-gradient(45deg, rgba(255, 215, 0, 0.3), rgba(255, 165, 0, 0.3));
  border-radius: 10px;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const BalanceIcon = styled.div`
  width: 50px;
  height: 50px;
  background: #ffd700;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: rgba(0, 0, 0, 0.7);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const BalanceAmount = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #ffd700;
`;

const ItemsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 15px;
  margin-top: 20px;
`;

const ItemCard = styled(Card)<{ disabled?: boolean }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${props => props.disabled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 215, 0, 0.3)'};
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.6 : 1};
  
  .ant-card-body {
    padding: 15px;
  }
  
  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-5px)'};
    box-shadow: ${props => props.disabled ? 'none' : '0 5px 15px rgba(0, 0, 0, 0.2)'};
  }
`;

const ItemImage = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  font-size: 40px;
  color: #ffd700;
`;

const ItemTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: white;
  margin-bottom: 5px;
  text-align: center;
`;

const ItemDescription = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 10px;
  text-align: center;
  height: 36px;
  overflow: hidden;
`;

const ItemPrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #ffd700;
  margin-bottom: 10px;
  
  span {
    margin-left: 5px;
  }
`;

const PurchaseButton = styled(Button)`
  background: linear-gradient(45deg, #6941C6, #3730A3);
  border: none;
  color: white;
  width: 100%;
  
  &:hover {
    opacity: 0.9;
    color: white;
  }
  
  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.5);
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

// 商店物品定义
const shopItems = [
  {
    id: 'tarot',
    title: '塔罗牌占卜',
    description: '解锁一次塔罗牌占卜机会',
    price: 50,
    icon: <CrownOutlined />,
    category: 'services'
  },
  {
    id: 'character',
    title: '解锁角色',
    description: '解锁一位新的运势解读角色',
    price: 100,
    icon: <StarOutlined />,
    category: 'characters'
  },
  {
    id: 'theme',
    title: '主题更换',
    description: '更换网站主题风格',
    price: 200,
    icon: <BulbOutlined />,
    category: 'cosmetics'
  },
  {
    id: 'background',
    title: '专属背景',
    description: '解锁专属背景图',
    price: 150,
    icon: <RocketOutlined />,
    category: 'cosmetics'
  },
  {
    id: 'daily',
    title: '每日运势+',
    description: '增强版每日运势，更多详情',
    price: 30,
    icon: <BulbOutlined />,
    category: 'services'
  }
];

const CoinShop: React.FC<CoinShopProps> = ({ visible, onClose }) => {
  const [coinBalance, setCoinBalance] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [showReward, setShowReward] = useState(false);
  const [currentReward, setCurrentReward] = useState<any>(null);
  
  useEffect(() => {
    if (visible) {
      // 加载金豆余额
      const balance = parseInt(localStorage.getItem('fortune-coins') || '0');
      setCoinBalance(balance);
      
      // 加载已购买的物品
      const purchased = JSON.parse(localStorage.getItem('shop-purchases') || '[]');
      setPurchasedItems(purchased);
    }
  }, [visible]);
  
  const handlePurchase = (item: any) => {
    // 检查金豆余额
    if (coinBalance < item.price) {
      message.error('金豆不足，无法购买');
      return;
    }
    
    // 扣除金豆
    const newBalance = coinBalance - item.price;
    setCoinBalance(newBalance);
    localStorage.setItem('fortune-coins', newBalance.toString());
    
    // 记录购买
    const newPurchased = [...purchasedItems, item.id];
    setPurchasedItems(newPurchased);
    localStorage.setItem('shop-purchases', JSON.stringify(newPurchased));
    
    // 显示奖励动画
    setCurrentReward(item);
    setShowReward(true);
    
    // 3秒后关闭动画
    setTimeout(() => {
      setShowReward(false);
    }, 3000);
  };
  
  // 根据分类过滤物品
  const filteredItems = activeTab === 'all' 
    ? shopItems 
    : shopItems.filter(item => item.category === activeTab);
  
  return (
    <ShopModal
      title={<><GiftOutlined /> 金豆商城</>}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
    >
      <BalanceDisplay>
        <div>
          <Text style={{ color: 'white', fontSize: '16px', display: 'block' }}>
            当前金豆余额
          </Text>
          <Paragraph style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', margin: '5px 0 0' }}>
            通过每日签到、运势游戏获得更多金豆
          </Paragraph>
        </div>
        <BalanceAmount>
          <BalanceIcon>¥</BalanceIcon>
          <span style={{ marginLeft: '10px' }}>{coinBalance}</span>
        </BalanceAmount>
      </BalanceDisplay>
      
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'all',
            label: '全部商品',
            children: (
              <ItemsContainer>
                {filteredItems.map(item => {
                  const isPurchased = purchasedItems.includes(item.id);
                  const canPurchase = coinBalance >= item.price && !isPurchased;
                  
                  return (
                    <Tooltip 
                      key={item.id} 
                      title={isPurchased ? '已拥有' : coinBalance < item.price ? '金豆不足' : ''}
                    >
                      <Badge.Ribbon 
                        text={isPurchased ? '已拥有' : null} 
                        color="gold"
                        style={{ display: isPurchased ? 'block' : 'none' }}
                      >
                        <ItemCard disabled={!canPurchase}>
                          <ItemImage>
                            {item.icon}
                          </ItemImage>
                          <ItemTitle>{item.title}</ItemTitle>
                          <ItemDescription>{item.description}</ItemDescription>
                          <ItemPrice>
                            <GiftOutlined /> <span>{item.price}</span>
                          </ItemPrice>
                          <PurchaseButton 
                            disabled={!canPurchase}
                            onClick={() => handlePurchase(item)}
                          >
                            {isPurchased ? '已拥有' : canPurchase ? '购买' : '金豆不足'}
                          </PurchaseButton>
                        </ItemCard>
                      </Badge.Ribbon>
                    </Tooltip>
                  );
                })}
              </ItemsContainer>
            ),
          },
          {
            key: 'services',
            label: '占卜服务',
            children: (
              <ItemsContainer>
                {filteredItems.map(item => {
                  const isPurchased = purchasedItems.includes(item.id);
                  const canPurchase = coinBalance >= item.price && !isPurchased;
                  
                  return (
                    <Tooltip 
                      key={item.id} 
                      title={isPurchased ? '已拥有' : coinBalance < item.price ? '金豆不足' : ''}
                    >
                      <Badge.Ribbon 
                        text={isPurchased ? '已拥有' : null} 
                        color="gold"
                        style={{ display: isPurchased ? 'block' : 'none' }}
                      >
                        <ItemCard disabled={!canPurchase}>
                          <ItemImage>
                            {item.icon}
                          </ItemImage>
                          <ItemTitle>{item.title}</ItemTitle>
                          <ItemDescription>{item.description}</ItemDescription>
                          <ItemPrice>
                            <GiftOutlined /> <span>{item.price}</span>
                          </ItemPrice>
                          <PurchaseButton 
                            disabled={!canPurchase}
                            onClick={() => handlePurchase(item)}
                          >
                            {isPurchased ? '已拥有' : canPurchase ? '购买' : '金豆不足'}
                          </PurchaseButton>
                        </ItemCard>
                      </Badge.Ribbon>
                    </Tooltip>
                  );
                })}
              </ItemsContainer>
            ),
          },
          {
            key: 'characters',
            label: '解锁角色',
            children: (
              <ItemsContainer>
                {filteredItems.map(item => {
                  const isPurchased = purchasedItems.includes(item.id);
                  const canPurchase = coinBalance >= item.price && !isPurchased;
                  
                  return (
                    <Tooltip 
                      key={item.id} 
                      title={isPurchased ? '已拥有' : coinBalance < item.price ? '金豆不足' : ''}
                    >
                      <Badge.Ribbon 
                        text={isPurchased ? '已拥有' : null} 
                        color="gold"
                        style={{ display: isPurchased ? 'block' : 'none' }}
                      >
                        <ItemCard disabled={!canPurchase}>
                          <ItemImage>
                            {item.icon}
                          </ItemImage>
                          <ItemTitle>{item.title}</ItemTitle>
                          <ItemDescription>{item.description}</ItemDescription>
                          <ItemPrice>
                            <GiftOutlined /> <span>{item.price}</span>
                          </ItemPrice>
                          <PurchaseButton 
                            disabled={!canPurchase}
                            onClick={() => handlePurchase(item)}
                          >
                            {isPurchased ? '已拥有' : canPurchase ? '购买' : '金豆不足'}
                          </PurchaseButton>
                        </ItemCard>
                      </Badge.Ribbon>
                    </Tooltip>
                  );
                })}
              </ItemsContainer>
            ),
          },
          {
            key: 'cosmetics',
            label: '外观装饰',
            children: (
              <ItemsContainer>
                {filteredItems.map(item => {
                  const isPurchased = purchasedItems.includes(item.id);
                  const canPurchase = coinBalance >= item.price && !isPurchased;
                  
                  return (
                    <Tooltip 
                      key={item.id} 
                      title={isPurchased ? '已拥有' : coinBalance < item.price ? '金豆不足' : ''}
                    >
                      <Badge.Ribbon 
                        text={isPurchased ? '已拥有' : null} 
                        color="gold"
                        style={{ display: isPurchased ? 'block' : 'none' }}
                      >
                        <ItemCard disabled={!canPurchase}>
                          <ItemImage>
                            {item.icon}
                          </ItemImage>
                          <ItemTitle>{item.title}</ItemTitle>
                          <ItemDescription>{item.description}</ItemDescription>
                          <ItemPrice>
                            <GiftOutlined /> <span>{item.price}</span>
                          </ItemPrice>
                          <PurchaseButton 
                            disabled={!canPurchase}
                            onClick={() => handlePurchase(item)}
                          >
                            {isPurchased ? '已拥有' : canPurchase ? '购买' : '金豆不足'}
                          </PurchaseButton>
                        </ItemCard>
                      </Badge.Ribbon>
                    </Tooltip>
                  );
                })}
              </ItemsContainer>
            ),
          },
        ]}
      />
      
      <AnimatePresence>
        {showReward && currentReward && (
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
              {currentReward.icon}
            </RewardIcon>
            <RewardText
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              恭喜获得 <br />
              <span style={{ color: '#ffd700' }}>{currentReward.title}</span>
            </RewardText>
            <Button 
              type="text" 
              style={{ color: 'white', marginTop: 20 }}
              onClick={() => setShowReward(false)}
            >
              关闭
            </Button>
          </RewardAnimation>
        )}
      </AnimatePresence>
    </ShopModal>
  );
};

export default CoinShop; 