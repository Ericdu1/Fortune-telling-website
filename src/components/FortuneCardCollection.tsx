import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Tabs, Empty, Button, Modal, Typography, Spin } from 'antd';
import { HeartOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import InteractiveFortuneCard from './InteractiveFortuneCard';
import { DailyFortune } from '../types/fortune';

const { Title, Text } = Typography;

interface FortuneCardCollectionProps {
  visible: boolean;
  onClose: () => void;
}

const CollectionModal = styled(Modal)`
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
  
  .ant-modal-body {
    padding: 24px;
  }
  
  .ant-tabs-nav {
    margin-bottom: 24px;
  }
  
  .ant-tabs-tab {
    color: rgba(255, 255, 255, 0.65);
  }
  
  .ant-tabs-tab-active {
    color: #ffd700 !important;
  }
  
  .ant-tabs-ink-bar {
    background: #ffd700;
  }
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 10px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: rgba(255, 255, 255, 0.65);
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const CardDate = styled.div`
  font-size: 18px;
  margin-bottom: 15px;
  color: rgba(255, 215, 0, 0.8);
`;

const CardPreview = styled.div`
  font-size: 14px;
  text-align: center;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const FortuneCardCollection: React.FC<FortuneCardCollectionProps> = ({ visible, onClose }) => {
  const [favorites, setFavorites] = useState<DailyFortune[]>([]);
  const [history, setHistory] = useState<DailyFortune[]>([]);
  const [loading, setLoading] = useState(false);
  const [flippedCards, setFlippedCards] = useState<{[key: string]: boolean}>({});
  
  useEffect(() => {
    if (visible) {
      loadFavorites();
      loadHistory();
    }
  }, [visible]);
  
  const loadFavorites = () => {
    setLoading(true);
    try {
      // 从localStorage加载收藏的卡片
      const savedFavorites = localStorage.getItem('fortune-favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('加载收藏失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadHistory = () => {
    setLoading(true);
    try {
      // 从localStorage加载历史记录
      const savedHistory = localStorage.getItem('fortune-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('加载历史记录失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const toggleFavorite = (fortune: DailyFortune) => {
    const isFavorited = favorites.some(fav => fav.date === fortune.date);
    
    if (isFavorited) {
      const newFavorites = favorites.filter(fav => fav.date !== fortune.date);
      setFavorites(newFavorites);
      localStorage.setItem('fortune-favorites', JSON.stringify(newFavorites));
    } else {
      const newFavorites = [...favorites, fortune];
      setFavorites(newFavorites);
      localStorage.setItem('fortune-favorites', JSON.stringify(newFavorites));
    }
  };
  
  const toggleCardFlip = (date: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };
  
  const isFavorite = (date: string) => {
    return favorites.some(fav => fav.date === date);
  };
  
  const renderFortuneCard = (fortune: DailyFortune) => {
    return (
      <InteractiveFortuneCard
        key={fortune.date}
        isFlipped={flippedCards[fortune.date] || false}
        onFlip={() => toggleCardFlip(fortune.date)}
        isFavorite={isFavorite(fortune.date)}
        onFavoriteToggle={() => toggleFavorite(fortune)}
        frontContent={
          <CardContent>
            <CardDate>{fortune.date}</CardDate>
            <CardPreview>{fortune.content.substring(0, 100)}...</CardPreview>
          </CardContent>
        }
        backContent={
          <div>
            <h3 style={{ color: '#ffd700', marginBottom: '15px' }}>{fortune.date}</h3>
            <div style={{ marginBottom: '10px' }}>
              {'★'.repeat(fortune.luck)}{'☆'.repeat(5 - fortune.luck)}
            </div>
            <p style={{ marginBottom: '15px', whiteSpace: 'pre-wrap' }}>{fortune.content}</p>
            <div>
              {fortune.tags.map((tag, idx) => (
                <span key={idx} style={{ 
                  background: 'rgba(255,215,0,0.2)', 
                  padding: '2px 8px', 
                  borderRadius: '12px',
                  margin: '0 4px 4px 0',
                  display: 'inline-block',
                  fontSize: '12px'
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        }
      />
    );
  };
  
  return (
    <CollectionModal
      title="我的运势收藏"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
    >
      <Tabs
        items={[
          {
            key: '1',
            label: (
              <span>
                <HeartOutlined /> 收藏运势
              </span>
            ),
            children: (
              <div>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Spin />
                  </div>
                ) : favorites.length > 0 ? (
                  <CardsContainer>
                    {favorites.map(fortune => renderFortuneCard(fortune))}
                  </CardsContainer>
                ) : (
                  <EmptyContainer>
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="暂无收藏运势"
                    />
                    <Text style={{ color: 'rgba(255,255,255,0.5)', marginTop: '10px' }}>
                      收藏你喜欢的每日运势，方便以后回顾
                    </Text>
                  </EmptyContainer>
                )}
              </div>
            ),
          },
          {
            key: '2',
            label: (
              <span>
                <CloseOutlined /> 历史运势
              </span>
            ),
            children: (
              <div>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Spin />
                  </div>
                ) : history.length > 0 ? (
                  <CardsContainer>
                    {history.map(fortune => renderFortuneCard(fortune))}
                  </CardsContainer>
                ) : (
                  <EmptyContainer>
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="暂无历史运势"
                    />
                    <Text style={{ color: 'rgba(255,255,255,0.5)', marginTop: '10px' }}>
                      查看运势后将自动保存到历史记录
                    </Text>
                  </EmptyContainer>
                )}
              </div>
            ),
          },
        ]}
      />
    </CollectionModal>
  );
};

export default FortuneCardCollection; 