import React, { useRef, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Button, message, Tag } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined, ShareAltOutlined } from '@ant-design/icons';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';
import { DailyFortune } from '../types/fortune';
import { TarotCardResult } from '../types/tarot';
import { formatDate } from '../utils/date';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  color: white;
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 0.5rem;
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: white;
  font-size: 2rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
`;

const ShareCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 10px;
    margin-bottom: 1.5rem;
  }
`;

const ShareContent = styled.div`
  padding: 1.5rem;
  background: #1a1a2e;
  color: #ffffff;
  min-height: auto;
  height: auto;
  max-height: none;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  position: relative;
  overflow: visible;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 600px) {
    padding: 1rem;
    gap: 1rem;
    max-width: 100%;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
  padding-bottom: 0.8rem;
`;

const HeaderTitle = styled.h3`
  color: #ffd700;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const DateTime = styled.div`
  color: #e0e0e0;
  font-size: 1rem;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 1.5rem 0;
  padding: 0;
  
  @media (max-width: 480px) {
    gap: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const CardItem = styled.div`
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(255, 215, 0, 0.3);
  
  @media (max-width: 480px) {
    padding: 0.5rem;
    border-radius: 8px;
    width: 90%;
    max-width: 200px;
    margin-bottom: 1rem;
  }
`;

const CardImageWrapper = styled.div<{ isReversed?: boolean }>`
  width: 100%;
  margin: 0 auto;
  transform: ${props => props.isReversed ? 'rotate(180deg)' : 'none'};
  
  @media (max-width: 480px) {
    max-width: 150px;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 6px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;

const CardName = styled.div`
  color: #ffd700;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  font-weight: bold;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-top: 0.3rem;
  }
`;

const CardPosition = styled.div`
  color: #e0e0e0;
  font-size: 0.8rem;
  margin-top: 0.2rem;
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
    margin-top: 0.1rem;
  }
`;

const CardDescription = styled.div`
  color: #e0e0e0;
  font-size: 0.9rem;
  margin-top: 0.3rem;
  text-align: center;
`;

const InterpretationSection = styled.div`
  margin: 1.5rem 0;
  padding: 0;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 1rem;
  
  @media (max-width: 480px) {
    margin: 1rem 0;
    padding: 0.8rem;
    border-radius: 8px;
  }
`;

const CategorySection = styled.div`
  margin: 1rem 0;
  
  @media (max-width: 480px) {
    margin: 0.8rem 0;
    padding: 0 0.3rem;
  }
`;

const CategoryTitle = styled.h4`
  color: #ffd700;
  margin-bottom: 0.8rem;
  font-size: 1.1rem;
  text-align: center;
  position: relative;
  
  &:before, &:after {
    content: '';
    position: absolute;
    top: 50%;
    height: 1px;
    width: 20%;
    background: rgba(255, 215, 0, 0.3);
  }
  
  &:before {
    left: 10%;
  }
  
  &:after {
    right: 10%;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 0.6rem;
    font-size: 1rem;
    
    &:before, &:after {
      width: 15%;
    }
    
    &:before {
      left: 15%;
    }
    
    &:after {
      right: 15%;
    }
  }
`;

const CategoryContent = styled.div`
  color: #e0e0e0;
  font-size: 0.9rem;
  line-height: 1.5;
  text-align: center;
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
    line-height: 1.4;
  }
`;

const GuidanceSection = styled.div`
  background: linear-gradient(to bottom, rgba(255, 215, 0, 0.1), rgba(255, 215, 0, 0.05));
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 10px;
  padding: 1rem;
  margin-top: 1.5rem;
  
  @media (max-width: 480px) {
    padding: 0.8rem;
    margin-top: 1rem;
    border-radius: 8px;
  }
`;

const GuidanceTitle = styled.h4`
  color: #ffd700;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  
  @media (max-width: 480px) {
    margin-bottom: 0.8rem;
    font-size: 1rem;
  }
`;

const GuidanceText = styled.p`
  color: #e0e0e0;
  font-size: 0.9rem;
  line-height: 1.5;
  text-align: justify;
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
    line-height: 1.4;
    text-align: left;
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 215, 0, 0.2);
  
  @media (max-width: 480px) {
    flex-direction: column;
    margin-top: 1.5rem;
    padding-top: 0.8rem;
  }
`;

const QRCodeContainer = styled.div`
  margin-right: 1rem;
  background: white;
  padding: 6px;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 480px) {
    margin-right: 0;
    margin-bottom: 0.8rem;
  padding: 4px;
  }
`;

const Watermark = styled.div`
  color: #a0a0a0;
  font-size: 0.8rem;
  text-align: left;
  
  @media (max-width: 480px) {
    text-align: center;
    font-size: 0.7rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
    position: sticky;
    bottom: 1rem;
    z-index: 10;
    margin-top: 1rem;
    padding: 0 0.5rem;
  }
`;

const StyledButton = styled(Button)`
  background: linear-gradient(45deg, #6b6bff, #8e8eff);
  border: none;
  color: white;
  height: 40px;
  padding: 0 2rem;
  font-weight: 500;
  
  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    height: 44px;
    padding: 0 1rem;
    border-radius: 8px;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:hover {
    opacity: 0.9;
    color: white;
  }
`;

const DailyFortuneHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
  text-align: center;
`;

const FortuneTitle = styled.div`
  font-size: 1.8rem;
  color: #ffd700;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const Date = styled.div`
  font-size: 1.2rem;
  color: #e0e0e0;
  margin-bottom: 1rem;
`;

const LuckMeter = styled.div`
  margin: 1rem 0;
`;

const LuckTitle = styled.div`
  color: #ffd700;
  margin-bottom: 0.5rem;
`;

const LuckStars = styled.div`
  color: #ffd700;
  font-size: 1.5rem;
`;

const Content = styled.div`
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 1.5rem 0;
  white-space: pre-wrap;
`;

const TagsContainer = styled.div`
  margin: 1rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const CategoryCard = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 10px;
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.8rem;
`;

const CategoryName = styled.span`
  color: #ffd700;
  font-size: 1.1rem;
`;

const CategoryLevel = styled(Tag)<{ level: 'SSR' | 'SR' | 'R' | 'N' }>`
  margin-left: 0.8rem;
  background: ${props => {
    switch (props.level) {
      case 'SSR': return 'linear-gradient(45deg, #FFD700, #FFA500)';
      case 'SR': return 'linear-gradient(45deg, #C0C0C0, #A0A0A0)';
      case 'R': return 'linear-gradient(45deg, #CD7F32, #8B4513)';
      case 'N': return 'linear-gradient(45deg, #808080, #696969)';
    }
  }};
  border: none;
`;

const CategoryDescription = styled.div`
  color: #e0e0e0;
  margin-bottom: 0.5rem;
`;

const CategoryAdvice = styled.div`
  color: #a0a0a0;
  font-size: 0.9rem;
`;

const RecommendSection = styled.div`
  margin: 1.5rem 0;
  
  @media (max-width: 480px) {
    margin: 1rem 0;
  }
`;

const RecommendTitle = styled.h4`
  color: #ffd700;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  text-align: center;
  position: relative;
  
  @media (max-width: 480px) {
    margin-bottom: 0.8rem;
    font-size: 1rem;
  }
  
  &:before, &:after {
    content: '';
    position: absolute;
    top: 50%;
    height: 1px;
    width: 30%;
    background: rgba(255, 215, 0, 0.3);
  }
  
  &:before {
    left: 0;
  }
  
  &:after {
    right: 0;
  }
`;

const RecommendCard = styled.div`
  margin-bottom: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  overflow: hidden;
  
  @media (max-width: 480px) {
    margin-bottom: 0.8rem;
  }
`;

const RecommendHeader = styled.div`
  background: rgba(255, 215, 0, 0.2);
  padding: 0.6rem;
  color: #ffd700;
  font-weight: bold;
  font-size: 0.9rem;
  
  @media (max-width: 480px) {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
`;

const RecommendContent = styled.div`
  padding: 0.8rem;
  color: #e0e0e0;
  font-size: 0.9rem;
  
  @media (max-width: 480px) {
    padding: 0.6rem;
    font-size: 0.8rem;
  }
`;

const DailyFortuneContent = styled.div`
  margin: 1.5rem 0;
  
  @media (max-width: 480px) {
    margin: 1rem 0;
  }
`;

const LuckLevelContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1rem 0;
  justify-content: center;
  
  @media (max-width: 480px) {
    gap: 0.6rem;
    margin: 0.8rem 0;
  }
`;

const LuckLevel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    gap: 0.3rem;
  }
`;

const LuckTag = styled(Tag)`
  font-size: 0.9rem;
  padding: 0.2rem 0.6rem;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.1rem 0.4rem;
  }
`;

const EventsSection = styled.div`
  margin: 1.5rem 0;
  
  @media (max-width: 480px) {
    margin: 1rem 0;
  }
`;

const EventsTitle = styled.h4`
  color: #ffd700;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  text-align: center;
  position: relative;
  
  @media (max-width: 480px) {
    margin-bottom: 0.8rem;
    font-size: 1rem;
  }
  
  &:before, &:after {
    content: '';
    position: absolute;
    top: 50%;
    height: 1px;
    width: 30%;
    background: rgba(255, 215, 0, 0.3);
  }
  
  &:before {
    left: 0;
  }
  
  &:after {
    right: 0;
  }
`;

const EventList = styled.div`
  margin: 1rem 0;
  
  @media (max-width: 480px) {
    margin: 0.8rem 0;
  }
`;

const EventItem = styled.div`
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 480px) {
    padding: 0.6rem 0;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const EventTitle = styled.div`
  color: #ffd700;
  margin-bottom: 0.3rem;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 0.2rem;
  }
`;

const EventDescription = styled.div`
  color: #e0e0e0;
  font-size: 0.9rem;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const FortuneDisplayGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1rem 0;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FortuneItem = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const FortuneItemIcon = styled.div`
  color: #ffd700;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FortuneItemContent = styled.div`
  color: #ffffff;
  font-size: 1rem;
`;

interface ShareResultProps {
  dailyFortune?: DailyFortune;
  tarotResult?: {
    cards: TarotCardResult[];
    interpretations?: {
      past: string;
      present: string;
      future: string;
      guidance: string;
    };
  };
  onBack: () => void;
}

const ShareResult: React.FC<ShareResultProps> = ({ dailyFortune, tarotResult, onBack }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [simpleImageContent, setSimpleImageContent] = useState<string>('');
  const shareCardRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  // 提取卡片意义的辅助函数(恢复这个函数以修复塔罗牌部分的错误)
  const extractCardMeaning = (position: string) => {
    const card = tarotResult?.cards?.find(c => c.position === position);
    return card?.isReversed ? card.reversedMeaning : card?.meaning;
  };

  // 组件挂载时生成简化版内容
  useEffect(() => {
    console.log("ShareResult组件收到的数据:", dailyFortune);
    
    if (dailyFortune) {
      // 检查是否有isFullShare标志
      if (dailyFortune.isFullShare) {
        console.log("生成完整分享内容");
      } else {
        console.log("生成标签页分享内容:", dailyFortune.activeTab);
      }
      
      // 生成简化的HTML内容用于图片
      generateSimpleContent();
    }
  }, [dailyFortune, tarotResult]);

  // 生成简化版的内容用于图片生成
  const generateSimpleContent = () => {
    if (!dailyFortune) return;
    
    // 构建简单的HTML结构
    let title = '';
    let mainContent = '';
    
    // 完整分享模式 - 包含所有板块的内容
    if (dailyFortune.isFullShare) {
      title = '今日运势大全';
      mainContent = `
        <!-- 综合运势部分 -->
        <div style="margin-bottom: 30px;">
          <div style="color: #ffd700; margin-bottom: 16px; font-size: 20px; text-align: center; position: relative;">
            <span style="position: relative; background: #1a1a2e; padding: 0 16px; z-index: 1;">综合运势</span>
            <div style="position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: rgba(255, 215, 0, 0.3); z-index: 0;"></div>
          </div>
          
          <div style="background: rgba(0, 0, 0, 0.3); padding: 16px; border-radius: 10px; border: 1px solid rgba(255, 215, 0, 0.3); margin-bottom: 20px;">
            <div style="color: #ffd700; margin-bottom: 12px; font-size: 18px; text-align: center;">总体运势</div>
            <div style="font-size: 16px; line-height: 1.6;">${dailyFortune.content}</div>
          </div>
          
          <div style="margin: 15px 0;">
            <div style="color: #ffd700; margin-bottom: 8px; text-align: center;">今日运势指数</div>
            <div style="color: #ffd700; font-size: 24px; text-align: center;">${'★'.repeat(dailyFortune.luck)}${'☆'.repeat(5 - dailyFortune.luck)}</div>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <div style="color: #ffd700; margin-bottom: 12px; font-size: 18px;">运势概览</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
              <div style="background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 12px; display: flex; align-items: center; gap: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                <div style="color: #ffd700; font-size: 24px;">🎮</div>
                <div style="color: #ffffff; font-size: 16px;">游戏运势：${dailyFortune.categories.game?.level || 'N'}</div>
              </div>
              <div style="background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 12px; display: flex; align-items: center; gap: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                <div style="color: #ffd700; font-size: 24px;">👥</div>
                <div style="color: #ffffff; font-size: 16px;">社交运势：${dailyFortune.categories.social?.level || 'N'}</div>
              </div>
              <div style="background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 12px; display: flex; align-items: center; gap: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                <div style="color: #ffd700; font-size: 24px;">✍️</div>
                <div style="color: #ffffff; font-size: 16px;">创作运势：${dailyFortune.categories.create?.level || 'N'}</div>
              </div>
              <div style="background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 12px; display: flex; align-items: center; gap: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
                <div style="color: #ffd700; font-size: 24px;">📺</div>
                <div style="color: #ffffff; font-size: 16px;">动画运势：${dailyFortune.categories.anime?.level || 'N'}</div>
              </div>
            </div>
          </div>
          
          <div style="background: rgba(255, 215, 0, 0.1); padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 3px solid #ffd700;">
            <div style="color: #ffd700; margin-bottom: 8px;">🔮 神秘签文</div>
            <div style="font-size: 16px; font-style: italic; line-height: 1.6;">${dailyFortune.mysticMessage}</div>
          </div>
        </div>
        
        <!-- 星座运势部分 -->
        <div style="margin-bottom: 30px;">
          <div style="color: #ffd700; margin-bottom: 16px; font-size: 20px; text-align: center; position: relative;">
            <span style="position: relative; background: #1a1a2e; padding: 0 16px; z-index: 1;">星座运势${dailyFortune.zodiacInfo?.sign ? ` - ${dailyFortune.zodiacInfo.sign}` : ''}</span>
            <div style="position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: rgba(255, 215, 0, 0.3); z-index: 0;"></div>
          </div>
          
          <div style="background: rgba(0, 0, 0, 0.3); padding: 16px; border-radius: 10px; border: 1px solid rgba(255, 215, 0, 0.3); margin-bottom: 20px;">
            <div style="color: #ffd700; margin-bottom: 12px; font-size: 18px; text-align: center;">星座运势分析</div>
            <div style="font-size: 16px; line-height: 1.6;">${dailyFortune.zodiacInfo?.description || '今日星座运势整体状况良好，工作学习都将有所突破。感情方面可能会有些小波折，注意沟通方式。财运平稳，适合稳健投资。健康方面需要注意休息，避免过度疲劳。'}</div>
          </div>
          
          <div style="margin: 20px 0;">
            <div style="margin: 16px 0; padding: 16px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 10px;">
              <div style="display: flex; align-items: center; margin-bottom: 12px;">
                <span style="color: #ffd700; font-size: 18px;">整体运势</span>
                <span style="margin-left: 12px; color: #ffd700;">${dailyFortune.zodiacInfo?.analysis?.overall || "★★★★☆"}</span>
              </div>
              <div style="color: #e0e0e0; margin-bottom: 8px;">今天的整体运势不错，适合处理重要事务。保持积极乐观的心态，会有意外的惊喜。</div>
              <div style="color: #a0a0a0; margin-top: 8px;">建议：${dailyFortune.zodiacInfo?.advice || '把握机会，相信自己的判断。'}</div>
            </div>
          </div>
        </div>
        
        <!-- 生肖运势部分 -->
        <div style="margin-bottom: 30px;">
          <div style="color: #ffd700; margin-bottom: 16px; font-size: 20px; text-align: center; position: relative;">
            <span style="position: relative; background: #1a1a2e; padding: 0 16px; z-index: 1;">生肖运势${dailyFortune.animalInfo?.animal ? ` - ${dailyFortune.animalInfo.animal}` : ''}</span>
            <div style="position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: rgba(255, 215, 0, 0.3); z-index: 0;"></div>
          </div>
          
          <div style="background: rgba(0, 0, 0, 0.3); padding: 16px; border-radius: 10px; border: 1px solid rgba(255, 215, 0, 0.3); margin-bottom: 20px;">
            <div style="color: #ffd700; margin-bottom: 12px; font-size: 18px; text-align: center;">生肖运势分析</div>
            <div style="font-size: 16px; line-height: 1.6;">${dailyFortune.animalInfo?.description || '今日生肖运势平稳，适合规划和执行重要计划。保持冷静理性的态度，会有不错的收获。事业上可能有新的机遇，要保持专注。'}</div>
          </div>
          
          <div style="margin: 20px 0;">
            <div style="margin: 16px 0; padding: 16px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 10px;">
              <div style="display: flex; align-items: center; margin-bottom: 12px;">
                <span style="color: #ffd700; font-size: 18px;">整体运势</span>
                <span style="margin-left: 12px; color: #ffd700;">${dailyFortune.animalInfo?.analysis?.overall || "★★★★☆"}</span>
              </div>
              <div style="color: #e0e0e0; margin-bottom: 8px;">今日运势平稳，适合规划和执行重要计划。保持冷静理性的态度，会有不错的收获。</div>
              <div style="color: #a0a0a0; margin-top: 8px;">建议：${dailyFortune.animalInfo?.advice || '把握当下，循序渐进。'}</div>
            </div>
          </div>
        </div>
        
        <!-- 幸运提示部分 -->
        <div style="margin-bottom: 30px;">
          <div style="color: #ffd700; margin-bottom: 16px; font-size: 20px; text-align: center; position: relative;">
            <span style="position: relative; background: #1a1a2e; padding: 0 16px; z-index: 1;">今日幸运提示</span>
            <div style="position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: rgba(255, 215, 0, 0.3); z-index: 0;"></div>
          </div>
          
          <div style="background: rgba(0, 0, 0, 0.3); padding: 16px; border-radius: 10px; border: 1px solid rgba(255, 215, 0, 0.3); margin-bottom: 20px;">
            <div style="color: #ffd700; margin-bottom: 12px; font-size: 18px; text-align: center;">今日幸运提示</div>
            <div style="font-size: 16px; line-height: 1.6;">今天是提升自我和拓展视野的好时机，尝试接触新事物，与不同领域的人交流，可能会有意想不到的收获和灵感。</div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0;">
            <div style="background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
              <div style="color: #ffd700;">🎨 幸运色：</div>
              <div style="color: #ffffff;">${dailyFortune.luckyInfo?.color || "蓝色"}</div>
            </div>
            <div style="background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
              <div style="color: #ffd700;">🔢 幸运数字：</div>
              <div style="color: #ffffff;">${dailyFortune.luckyInfo?.number || "7, 9"}</div>
            </div>
            <div style="background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
              <div style="color: #ffd700;">🔑 幸运关键词：</div>
              <div style="color: #ffffff;">${dailyFortune.luckyInfo?.keyword || "创新、合作、直觉"}</div>
            </div>
            <div style="background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
              <div style="color: #ffd700;">✅ 今日宜：</div>
              <div style="color: #ffffff;">${Array.isArray(dailyFortune.luckyInfo?.goodActivity) 
                ? dailyFortune.luckyInfo.goodActivity.join('、') 
                : dailyFortune.luckyInfo?.goodActivity || "学习新技能、参加社交活动"}</div>
            </div>
            <div style="background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
              <div style="color: #ffd700;">❌ 今日忌：</div>
              <div style="color: #ffffff;">${Array.isArray(dailyFortune.luckyInfo?.badActivity) 
                ? dailyFortune.luckyInfo.badActivity.join('、') 
                : dailyFortune.luckyInfo?.badActivity || "冲动消费、轻率决策"}</div>
            </div>
          </div>
          
          <div style="background: rgba(255, 215, 0, 0.1); padding: 16px; border-radius: 8px; margin-top: 20px; border-left: 3px solid #ffd700;">
            <div style="color: #ffd700; margin-bottom: 8px;">🌈 行为引导</div>
            <div style="font-size: 16px; line-height: 1.6;">${dailyFortune.luckyInfo?.behavior || "今天是提升自我和拓展视野的好时机，尝试接触新事物，与不同领域的人交流，可能会有意想不到的收获和灵感。同时，需要注意控制情绪和消费欲望，避免做出冲动的决定。"}</div>
          </div>
        </div>
      `;
    }
    // 根据活跃标签页类型生成内容 (保留原有逻辑用于兼容旧版本)
    else if (dailyFortune.activeTab === 'zodiac') {
      title = '星座运势占卜';
      mainContent = `
        <div style="background: rgba(0, 0, 0, 0.3); padding: 16px; border-radius: 10px; border: 1px solid rgba(255, 215, 0, 0.3); margin-bottom: 20px;">
          <div style="color: #ffd700; margin-bottom: 12px; font-size: 18px; text-align: center;">星座运势分析${dailyFortune?.zodiacInfo?.sign ? ` - ${dailyFortune.zodiacInfo.sign}` : ''}</div>
          <div style="font-size: 16px; line-height: 1.6;">今日星座运势整体状况良好，工作学习都将有所突破。感情方面可能会有些小波折，注意沟通方式。财运平稳，适合稳健投资。健康方面需要注意休息，避免过度疲劳。</div>
        </div>
        
        <div style="margin: 20px 0;">
          <div style="color: #ffd700; margin-bottom: 16px; font-size: 18px; text-align: center; position: relative;">
            <span style="position: relative; background: #1a1a2e; padding: 0 16px; z-index: 1;">运势详解</span>
            <div style="position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: rgba(255, 215, 0, 0.3); z-index: 0;"></div>
          </div>
          
          <div style="margin: 16px 0; padding: 16px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 10px;">
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
              <span style="color: #ffd700; font-size: 18px;">整体运势</span>
              <span style="margin-left: 12px; color: #ffd700;">${dailyFortune?.zodiacInfo?.analysis.overall || "★★★★☆"}</span>
            </div>
            <div style="color: #e0e0e0; margin-bottom: 8px;">今天的整体运势不错，适合处理重要事务。保持积极乐观的心态，会有意外的惊喜。</div>
            <div style="color: #a0a0a0; font-size: 14px;">建议：把握机会，相信自己的判断。</div>
          </div>
          
          <div style="margin: 16px 0; padding: 16px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 10px;">
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
              <span style="color: #ffd700; font-size: 18px;">爱情运势</span>
              <span style="margin-left: 12px; color: #ffd700;">${dailyFortune?.zodiacInfo?.analysis.love || "★★★☆☆"}</span>
            </div>
            <div style="color: #e0e0e0; margin-bottom: 8px;">单身者可能会遇到心动的对象，已有伴侣的要注意沟通方式。</div>
            <div style="color: #a0a0a0; font-size: 14px;">建议：保持真诚，表达自己的感受。</div>
          </div>
          
          <div style="margin: 16px 0; padding: 16px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 10px;">
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
              <span style="color: #ffd700; font-size: 18px;">事业运势</span>
              <span style="margin-left: 12px; color: #ffd700;">${dailyFortune?.zodiacInfo?.analysis.career || "★★★★☆"}</span>
            </div>
            <div style="color: #e0e0e0; margin-bottom: 8px;">工作上会遇到新的挑战，但这也是展现能力的好机会。团队合作会带来不错的成果。</div>
            <div style="color: #a0a0a0; font-size: 14px;">建议：主动承担责任，展现领导力。</div>
          </div>
        </div>
      `;
    } else if (dailyFortune.activeTab === 'animal') {
      title = '生肖运势占卜';
      mainContent = `
        <div style="background: rgba(0, 0, 0, 0.3); padding: 16px; border-radius: 10px; border: 1px solid rgba(255, 215, 0, 0.3); margin-bottom: 20px;">
          <div style="color: #ffd700; margin-bottom: 12px; font-size: 18px; text-align: center;">生肖运势分析${dailyFortune?.animalInfo?.animal ? ` - ${dailyFortune.animalInfo.animal}` : ''}</div>
          <div style="font-size: 16px; line-height: 1.6;">今日生肖运势平稳，适合规划和执行重要计划。保持冷静理性的态度，会有不错的收获。事业上可能有新的机遇，要保持专注。</div>
        </div>
        
        <div style="margin: 20px 0;">
          <div style="color: #ffd700; margin-bottom: 16px; font-size: 18px; text-align: center; position: relative;">
            <span style="position: relative; background: #1a1a2e; padding: 0 16px; z-index: 1;">运势详解</span>
            <div style="position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: rgba(255, 215, 0, 0.3); z-index: 0;"></div>
          </div>
          
          <div style="margin: 16px 0; padding: 16px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 10px;">
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
              <span style="color: #ffd700; font-size: 18px;">整体运势</span>
              <span style="margin-left: 12px; color: #ffd700;">${dailyFortune?.animalInfo?.analysis.overall || "★★★★☆"}</span>
            </div>
            <div style="color: #e0e0e0; margin-bottom: 8px;">今日运势平稳，适合规划和执行重要计划。保持冷静理性的态度，会有不错的收获。</div>
            <div style="color: #a0a0a0; font-size: 14px;">建议：把握当下，循序渐进。</div>
          </div>
          
          <div style="margin: 16px 0; padding: 16px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 10px;">
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
              <span style="color: #ffd700; font-size: 18px;">事业运势</span>
              <span style="margin-left: 12px; color: #ffd700;">${dailyFortune?.animalInfo?.analysis.career || "★★★☆☆"}</span>
            </div>
            <div style="color: #e0e0e0; margin-bottom: 8px;">职场上可能会遇到新的机遇，团队协作顺利。注意把握细节，展现专业能力。</div>
            <div style="color: #a0a0a0; font-size: 14px;">建议：保持专注，注重细节。</div>
          </div>
          
          <div style="margin: 16px 0; padding: 16px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 10px;">
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
              <span style="color: #ffd700; font-size: 18px;">财运运势</span>
              <span style="margin-left: 12px; color: #ffd700;">${dailyFortune?.animalInfo?.analysis.wealth || "★★★★☆"}</span>
            </div>
            <div style="color: #e0e0e0; margin-bottom: 8px;">财运较好，可能有额外收入。投资方面要保持谨慎，避免冒险。</div>
            <div style="color: #a0a0a0; font-size: 14px;">建议：稳健理财，适度消费。</div>
          </div>
        </div>
      `;
    } else if (dailyFortune.activeTab === 'lucky') {
      title = '今日幸运提示';
      // 确保goodActivity和badActivity可以处理字符串或数组类型
      const goodActivity = Array.isArray(dailyFortune.luckyInfo?.goodActivity) 
        ? dailyFortune.luckyInfo?.goodActivity.join('、') 
        : dailyFortune.luckyInfo?.goodActivity;
      
      const badActivity = Array.isArray(dailyFortune.luckyInfo?.badActivity) 
        ? dailyFortune.luckyInfo?.badActivity.join('、') 
        : dailyFortune.luckyInfo?.badActivity;
      
      mainContent = `
        <div style="background: rgba(0, 0, 0, 0.3); padding: 16px; border-radius: 10px; border: 1px solid rgba(255, 215, 0, 0.3); margin-bottom: 20px;">
          <div style="color: #ffd700; margin-bottom: 12px; font-size: 18px; text-align: center;">今日幸运提示</div>
          <div style="font-size: 16px; line-height: 1.6;">今天是提升自我和拓展视野的好时机，尝试接触新事物，与不同领域的人交流，可能会有意想不到的收获和灵感。</div>
        </div>
        
        <div style="margin: 20px 0;">
          <div style="color: #ffd700; margin-bottom: 16px; font-size: 18px; text-align: center; position: relative;">
            <span style="position: relative; background: #1a1a2e; padding: 0 16px; z-index: 1;">详细提示</span>
            <div style="position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: rgba(255, 215, 0, 0.3); z-index: 0;"></div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0;">
            <div style="background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
              <div style="color: #ffd700;">🎨 幸运色：</div>
              <div style="color: #ffffff;">${dailyFortune.luckyInfo?.color || "蓝色"}</div>
            </div>
            <div style="background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
              <div style="color: #ffd700;">🔢 幸运数字：</div>
              <div style="color: #ffffff;">${dailyFortune.luckyInfo?.number || "7, 9"}</div>
            </div>
            <div style="background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
              <div style="color: #ffd700;">🔑 幸运关键词：</div>
              <div style="color: #ffffff;">${dailyFortune.luckyInfo?.keyword || "创新、合作、直觉"}</div>
            </div>
            <div style="background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
              <div style="color: #ffd700;">✅ 今日宜：</div>
              <div style="color: #ffffff;">${goodActivity || "学习新技能、参加社交活动"}</div>
            </div>
            <div style="background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 8px; border: 1px solid rgba(255, 255, 255, 0.1);">
              <div style="color: #ffd700;">❌ 今日忌：</div>
              <div style="color: #ffffff;">${badActivity || "冲动消费、轻率决策"}</div>
            </div>
          </div>
          
          <div style="background: rgba(255, 215, 0, 0.1); padding: 16px; border-radius: 8px; margin-top: 20px; border-left: 3px solid #ffd700;">
            <div style="color: #ffd700; margin-bottom: 8px;">🌈 行为引导</div>
            <div style="font-size: 16px; line-height: 1.6;">${dailyFortune.luckyInfo?.behavior || "今天是提升自我和拓展视野的好时机，尝试接触新事物，与不同领域的人交流，可能会有意想不到的收获和灵感。同时，需要注意控制情绪和消费欲望，避免做出冲动的决定。"}</div>
          </div>
        </div>
      `;
    } else {
      // 默认为综合运势内容
      title = '今日运势占卜';
      mainContent = `
        <!-- 总体运势 -->
        <div style="background: rgba(0, 0, 0, 0.3); padding: 16px; border-radius: 10px; border: 1px solid rgba(255, 215, 0, 0.3); margin-bottom: 20px;">
          <div style="color: #ffd700; margin-bottom: 12px; font-size: 18px; text-align: center;">总体运势</div>
          <div style="font-size: 16px; line-height: 1.6;">${dailyFortune.content}</div>
        </div>
        
        <!-- 运势概览 -->
        <div style="text-align: center; margin: 20px 0;">
          <div style="color: #ffd700; margin-bottom: 12px; font-size: 18px;">运势概览</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
            <div style="background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 12px; display: flex; align-items: center; gap: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
              <div style="color: #ffd700; font-size: 24px;">🎮</div>
              <div style="color: #ffffff; font-size: 16px;">游戏运势：${dailyFortune.categories.game?.level || 'N'}</div>
            </div>
            <div style="background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 12px; display: flex; align-items: center; gap: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
              <div style="color: #ffd700; font-size: 24px;">👥</div>
              <div style="color: #ffffff; font-size: 16px;">社交运势：${dailyFortune.categories.social?.level || 'N'}</div>
            </div>
            <div style="background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 12px; display: flex; align-items: center; gap: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
              <div style="color: #ffd700; font-size: 24px;">✍️</div>
              <div style="color: #ffffff; font-size: 16px;">创作运势：${dailyFortune.categories.create?.level || 'N'}</div>
            </div>
            <div style="background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 12px; display: flex; align-items: center; gap: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
              <div style="color: #ffd700; font-size: 24px;">📺</div>
              <div style="color: #ffffff; font-size: 16px;">动画运势：${dailyFortune.categories.anime?.level || 'N'}</div>
            </div>
          </div>
        </div>
        
        <!-- 神秘签文 -->
        <div style="background: rgba(255, 215, 0, 0.1); padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 3px solid #ffd700;">
          <div style="color: #ffd700; margin-bottom: 8px; font-size: 16px;">🔮 神秘签文</div>
          <div style="font-size: 18px; font-style: italic;">${dailyFortune.mysticMessage}</div>
        </div>
        
        <!-- 详细运势分析 -->
        <div style="margin: 20px 0;">
          <div style="color: #ffd700; margin-bottom: 16px; font-size: 18px; text-align: center; position: relative;">
            <span style="position: relative; background: #1a1a2e; padding: 0 16px; z-index: 1;">详细运势分析</span>
            <div style="position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: rgba(255, 215, 0, 0.3); z-index: 0;"></div>
          </div>
          ${Object.entries(dailyFortune.categories).map(([key, category]) => `
            <div style="margin: 16px 0; padding: 16px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 10px;">
              <div style="display: flex; align-items: center; margin-bottom: 12px;">
                <span style="color: #ffd700; font-size: 18px;">${category.name}</span>
                <span style="margin-left: 12px; background: ${getLevelColor(category.level)}; color: white; padding: 2px 8px; border-radius: 4px;">${category.level}</span>
              </div>
              <div style="color: #e0e0e0; margin-bottom: 8px;">${category.description}</div>
              <div style="color: #a0a0a0; font-size: 14px;">建议：${category.advice}</div>
            </div>
          `).join('')}
        </div>
      `;
    }
    
    // 构建完整的HTML内容
    const content = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; background: #1a1a2e; color: white; padding: 24px; width: 100%; max-width: 500px; border-radius: 12px;">
        <!-- 头部 -->
        <div style="text-align: center; margin-bottom: 16px; border-bottom: 1px solid rgba(255, 215, 0, 0.3); padding-bottom: 16px;">
          <h2 style="color: #ffd700; font-size: 28px; margin-bottom: 8px;">二次元占卜屋</h2>
          <div style="color: #e0e0e0; font-size: 16px;">${formatDate()} 今日运势</div>
        </div>
        
        <!-- 运势标题 -->
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 24px; color: #ffd700; margin-bottom: 8px; font-weight: bold;">${title}</div>
          <div style="font-size: 18px; color: #e0e0e0; margin-bottom: 16px;">${dailyFortune.date}</div>
          ${dailyFortune.activeTab !== 'lucky' ? `
          <div style="margin: 16px 0;">
            <div style="color: #ffd700; margin-bottom: 8px;">今日运势指数</div>
            <div style="color: #ffd700; font-size: 24px;">${'★'.repeat(dailyFortune.luck)}${'☆'.repeat(5 - dailyFortune.luck)}</div>
          </div>
          ` : ''}
        </div>
        
        ${mainContent}
        
        <!-- 底部 -->
        <div style="display: flex; align-items: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255, 215, 0, 0.2);">
          <div style="color: #a0a0a0; font-size: 14px; margin-left: auto;">
            二次元占卜屋 · 每日运势
            <br />
            扫描二维码获取你的占卜结果
          </div>
        </div>
      </div>
    `;
    
    setSimpleImageContent(content);
  };
  
  // 获取等级颜色
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'SSR': return 'linear-gradient(45deg, #FFD700, #FFA500)';
      case 'SR': return 'linear-gradient(45deg, #C0C0C0, #A0A0A0)';
      case 'R': return 'linear-gradient(45deg, #CD7F32, #8B4513)';
      default: return 'linear-gradient(45deg, #808080, #696969)';
    }
  };

  const handleSaveImage = async () => {
    try {
      setIsSaving(true);
      
      if (!shareCardRef.current) {
        setIsSaving(false);
        message.error('无法获取分享内容');
        return;
      }

      // 使用html2canvas直接将DOM元素转为图片 (类型转换以避免TS错误)
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: '#1a1a2e', // 实际上是正确的选项，但类型不匹配
        useCORS: true, // 允许加载跨域图片
        logging: false,
        allowTaint: true,
        onclone: (document) => {
          // 简化克隆的文档内样式，以提高转换效率
          const clonedContent = document.querySelector('.share-content');
          if (clonedContent) {
            clonedContent.style.boxShadow = 'none';
          }
        }
      } as any);

      // 创建下载链接
      const link = document.createElement('a');
      // 使用window.Date.now来避免与styled-component命名冲突
      const timestamp = window.Date.now().toString().slice(-6);
      const fileName = `运势占卜_${formatDate().replace(/\//g, '')}_${timestamp}.png`;
      
      // 将canvas转换为Blob并创建下载链接
      canvas.toBlob((blob) => {
        if (!blob) {
          message.error('生成图片失败');
          setIsSaving(false);
          return;
        }
        
        // 创建URL并下载
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
      link.click();
        
        // 清理
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          setIsSaving(false);
          message.success('运势图片已保存');
        }, 100);
      }, 'image/png', 0.95);
      
    } catch (error) {
      console.error('保存图片过程中出错:', error);
      message.error('生成图片时出错');
      setIsSaving(false);
    }
  };

  // 添加Web共享API功能
  const handleShare = async () => {
    try {
      if (!shareCardRef.current) {
        message.error('无法获取分享内容');
        return;
      }
      
      if (!navigator.share) {
        message.info('您的浏览器不支持Web分享API，已切换到图片下载模式');
        handleSaveImage();
        return;
      }
      
      // 将内容转换为图片
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: '#1a1a2e',
        useCORS: true,
        logging: false,
        allowTaint: true
      } as any); // 类型转换避免TS错误
      
      // 将Canvas转换为Blob
      const blob = await new Promise<Blob | null>((resolve) => 
        canvas.toBlob(resolve, 'image/png', 0.95)
      );
      
      if (!blob) {
        message.error('生成分享图片失败');
        return;
      }
      
      // 创建文件对象
      const timestamp = window.Date.now().toString().slice(-6);
      const file = new File([blob], `二次元占卜运势_${timestamp}.png`, { type: 'image/png' });
      
      // 调用Web Share API
      await navigator.share({
        title: '二次元占卜屋 - 今日运势',
        text: '来看看我今天的运势占卜结果吧！',
        files: [file]
      });
      
      message.success('分享成功！');
    } catch (error) {
      console.error('分享失败:', error);
      
      // 如果是用户取消分享，不显示错误
      if (error instanceof Error && error.name !== 'AbortError') {
        message.error('分享失败，已切换到图片下载模式');
        handleSaveImage();
      }
    }
  };

  // 确保在return中显示所有内容，不管activeTab是什么
  return (
    <Container>
      <Title>分享今日运势</Title>

      <ShareCard ref={shareCardRef}>
        <ShareContent ref={contentRef} className="share-content">
          <Header>
            <HeaderTitle>二次元占卜屋</HeaderTitle>
            <DateTime>
              {formatDate()} {dailyFortune ? '今日运势' : '塔罗牌占卜'}
            </DateTime>
          </Header>

          {dailyFortune && (
            <>
              {/* 简单指示是否为完整分享模式，方便调试 */}
              <div style={{ display: 'none' }}>
                分享模式: {dailyFortune.isFullShare ? '完整' : '单一'}, 
                活跃标签: {dailyFortune.activeTab || '无'}
              </div>

              {/* 显示标题，根据是否为完整分享和当前活跃标签页 */}
              <DailyFortuneHeader>
                <FortuneTitle>
                  {dailyFortune.isFullShare 
                    ? '今日运势综合分享'
                    : dailyFortune.activeTab === 'zodiac' 
                      ? '星座运势占卜' 
                      : dailyFortune.activeTab === 'animal' 
                        ? '生肖运势占卜' 
                        : dailyFortune.activeTab === 'lucky' 
                          ? '今日幸运提示'
                          : '今日运势占卜'}
                </FortuneTitle>
                <Date>{dailyFortune.date}</Date>
                {dailyFortune.activeTab !== 'lucky' && (
                <LuckMeter>
                  <LuckTitle>今日运势指数</LuckTitle>
                  <LuckStars>{'★'.repeat(dailyFortune.luck)}{'☆'.repeat(5 - dailyFortune.luck)}</LuckStars>
                </LuckMeter>
                )}
              </DailyFortuneHeader>

              <DailyFortuneContent>
                {/* 完整分享模式下显示所有内容，或者根据activeTab显示特定内容 */}
                {(dailyFortune.isFullShare || dailyFortune.activeTab === 'overall' || !dailyFortune.activeTab) && (
                  // 总体运势内容
                  <>
                    {/* 总体运势 */}
                    <div style={{ marginBottom: '2rem' }}>
                      <div style={{ 
                        color: '#ffd700', 
                        marginBottom: '1rem', 
                        fontSize: '1.1rem',
                        textAlign: 'center',
                        position: 'relative'
                      }}>
                        <span style={{
                          position: 'relative',
                          background: '#1a1a2e',
                          padding: '0 1rem',
                          zIndex: 1
                        }}>
                          综合运势
                        </span>
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: 0,
                          right: 0,
                          height: '1px',
                          background: 'rgba(255, 215, 0, 0.3)',
                          zIndex: 0
                        }}></div>
                      </div>

                      <div style={{ 
                        background: 'rgba(0, 0, 0, 0.3)', 
                        padding: '1rem', 
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 215, 0, 0.3)'
                      }}>
                        <div style={{ color: '#ffd700', marginBottom: '0.8rem', fontSize: '1.1rem', textAlign: 'center' }}>
                          总体运势
                        </div>
              <Content>{dailyFortune.content}</Content>
                      </div>
                      
                      {/* 运势类别概览 */}
                      <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                        <div style={{ color: '#ffd700', marginBottom: '0.8rem' }}>运势概览</div>
                        <FortuneDisplayGrid>
                          <FortuneItem>
                            <FortuneItemIcon>🎮</FortuneItemIcon>
                            <FortuneItemContent>
                              游戏运势：{dailyFortune.categories.game?.level || 'N'}
                            </FortuneItemContent>
                          </FortuneItem>
                          <FortuneItem>
                            <FortuneItemIcon>👥</FortuneItemIcon>
                            <FortuneItemContent>
                              社交运势：{dailyFortune.categories.social?.level || 'N'}
                            </FortuneItemContent>
                          </FortuneItem>
                          <FortuneItem>
                            <FortuneItemIcon>✍️</FortuneItemIcon>
                            <FortuneItemContent>
                              创作运势：{dailyFortune.categories.create?.level || 'N'}
                            </FortuneItemContent>
                          </FortuneItem>
                          <FortuneItem>
                            <FortuneItemIcon>📺</FortuneItemIcon>
                            <FortuneItemContent>
                              动画运势：{dailyFortune.categories.anime?.level || 'N'}
                            </FortuneItemContent>
                          </FortuneItem>
                        </FortuneDisplayGrid>
                      </div>
                      
                      {/* 标签 */}
                      <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                        <div style={{ color: '#ffd700', marginBottom: '0.8rem' }}>今日关键词</div>
              <TagsContainer>
                {dailyFortune.tags.map((tag, index) => (
                  <Tag 
                    key={index}
                    color="gold"
                              style={{ fontSize: '0.9rem', padding: '0.2rem 0.6rem', margin: '0.3rem' }}
                  >
                    {tag}
                  </Tag>
                ))}
              </TagsContainer>
                      </div>

                      {/* 神秘签文 */}
                      <div style={{ 
                        background: 'rgba(255, 215, 0, 0.1)', 
                        padding: '1rem', 
                        borderRadius: '8px', 
                        margin: '1.5rem 0',
                        borderLeft: '3px solid #ffd700'
                      }}>
                        <div style={{ color: '#ffd700', marginBottom: '0.5rem', fontSize: '1rem' }}>🔮 神秘签文</div>
                        <div style={{ fontSize: '1.1rem', fontStyle: 'italic' }}>{dailyFortune.mysticMessage}</div>
                      </div>

                      {/* 详细运势分析 */}
                      <div style={{ margin: '1.5rem 0' }}>
                        <div style={{ 
                          color: '#ffd700', 
                          marginBottom: '1rem', 
                          fontSize: '1.1rem',
                          textAlign: 'center',
                          position: 'relative'
                        }}>
                          <span style={{
                            position: 'relative',
                            background: '#1a1a2e',
                            padding: '0 1rem',
                            zIndex: 1
                          }}>
                            详细运势分析
                          </span>
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: 0,
                            right: 0,
                            height: '1px',
                            background: 'rgba(255, 215, 0, 0.3)',
                            zIndex: 0
                          }}></div>
                        </div>

              {Object.entries(dailyFortune.categories).map(([key, category]) => (
                <CategoryCard key={key}>
                  <CategoryHeader>
                    <CategoryName>{category.name}</CategoryName>
                    <CategoryLevel level={category.level}>{category.level}</CategoryLevel>
                  </CategoryHeader>
                  <CategoryDescription>{category.description}</CategoryDescription>
                            <CategoryAdvice>建议：{category.advice}</CategoryAdvice>
                </CategoryCard>
              ))}
                      </div>
                    </div>
                  </>
                )}

                {/* 星座运势部分 */}
                {(dailyFortune.isFullShare || dailyFortune.activeTab === 'zodiac') && dailyFortune.zodiacInfo && (
                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{ 
                      color: '#ffd700', 
                      marginBottom: '1rem', 
                      fontSize: '1.1rem',
                      textAlign: 'center',
                      position: 'relative'
                    }}>
                      <span style={{
                        position: 'relative',
                        background: '#1a1a2e',
                        padding: '0 1rem',
                        zIndex: 1
                      }}>
                        星座运势{dailyFortune.zodiacInfo.sign ? ` - ${dailyFortune.zodiacInfo.sign}` : ''}
                      </span>
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: 'rgba(255, 215, 0, 0.3)',
                        zIndex: 0
                      }}></div>
                      </div>

                    <div style={{ 
                      background: 'rgba(0, 0, 0, 0.3)', 
                      padding: '1rem', 
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 215, 0, 0.3)',
                      marginBottom: '1.5rem'
                    }}>
                      <div style={{ color: '#ffd700', marginBottom: '0.8rem', fontSize: '1.1rem', textAlign: 'center' }}>
                        星座运势分析
                      </div>
                      <Content>
                        {dailyFortune.zodiacInfo.description}
                      </Content>
                    </div>
                    
                    {/* 星座运势详细分析 */}
                    <div style={{ margin: '1.5rem 0' }}>
                      <div style={{ 
                        color: '#ffd700', 
                        marginBottom: '1rem', 
                        fontSize: '1.1rem',
                        textAlign: 'center',
                        position: 'relative'
                      }}>
                        <span style={{
                          position: 'relative',
                          background: '#1a1a2e',
                          padding: '0 1rem',
                          zIndex: 1
                        }}>
                          运势详解
                        </span>
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: 0,
                          right: 0,
                          height: '1px',
                          background: 'rgba(255, 215, 0, 0.3)',
                          zIndex: 0
                        }}></div>
                      </div>
                      
                      <CategoryCard>
                        <CategoryHeader>
                          <CategoryName>整体运势</CategoryName>
                          <div style={{ color: '#ffd700', marginLeft: '0.8rem' }}>{dailyFortune.zodiacInfo.analysis.overall}</div>
                        </CategoryHeader>
                        <CategoryDescription>今天的整体运势不错，适合处理重要事务。保持积极乐观的心态，会有意外的惊喜。</CategoryDescription>
                        <CategoryAdvice>建议：{dailyFortune.zodiacInfo.advice}</CategoryAdvice>
                      </CategoryCard>
                      
                      <CategoryCard>
                        <CategoryHeader>
                          <CategoryName>爱情运势</CategoryName>
                          <div style={{ color: '#ffd700', marginLeft: '0.8rem' }}>{dailyFortune.zodiacInfo.analysis.love}</div>
                        </CategoryHeader>
                        <CategoryDescription>单身者可能会遇到心动的对象，已有伴侣的要注意沟通方式。</CategoryDescription>
                        <CategoryAdvice>建议：保持真诚，表达自己的感受。</CategoryAdvice>
                      </CategoryCard>
                      
                      <CategoryCard>
                        <CategoryHeader>
                          <CategoryName>事业运势</CategoryName>
                          <div style={{ color: '#ffd700', marginLeft: '0.8rem' }}>{dailyFortune.zodiacInfo.analysis.career}</div>
                        </CategoryHeader>
                        <CategoryDescription>工作上会遇到新的挑战，但这也是展现能力的好机会。团队合作会带来不错的成果。</CategoryDescription>
                        <CategoryAdvice>建议：主动承担责任，展现领导力。</CategoryAdvice>
                      </CategoryCard>
                      
                      <CategoryCard>
                        <CategoryHeader>
                          <CategoryName>财运运势</CategoryName>
                          <div style={{ color: '#ffd700', marginLeft: '0.8rem' }}>{dailyFortune.zodiacInfo.analysis.wealth}</div>
                        </CategoryHeader>
                        <CategoryDescription>财运稳定，可能有意外收获。投资理财需要谨慎，避免冲动消费。</CategoryDescription>
                        <CategoryAdvice>建议：合理规划支出，关注长期投资。</CategoryAdvice>
                      </CategoryCard>
                      
                      <CategoryCard>
                        <CategoryHeader>
                          <CategoryName>健康运势</CategoryName>
                          <div style={{ color: '#ffd700', marginLeft: '0.8rem' }}>{dailyFortune.zodiacInfo.analysis.health}</div>
                        </CategoryHeader>
                        <CategoryDescription>身体状况良好，但要注意作息规律。适当的运动能提升精神状态。</CategoryDescription>
                        <CategoryAdvice>建议：保持规律作息，注意饮食均衡。</CategoryAdvice>
                      </CategoryCard>
                    </div>
                  </div>
                )}

                {/* 生肖运势部分 */}
                {(dailyFortune.isFullShare || dailyFortune.activeTab === 'animal') && dailyFortune.animalInfo && (
                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{ 
                      color: '#ffd700', 
                      marginBottom: '1rem', 
                      fontSize: '1.1rem',
                      textAlign: 'center',
                      position: 'relative'
                    }}>
                      <span style={{
                        position: 'relative',
                        background: '#1a1a2e',
                        padding: '0 1rem',
                        zIndex: 1
                      }}>
                        生肖运势{dailyFortune.animalInfo.animal ? ` - ${dailyFortune.animalInfo.animal}` : ''}
                      </span>
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: 'rgba(255, 215, 0, 0.3)',
                        zIndex: 0
                      }}></div>
                    </div>

                    <div style={{ 
                      background: 'rgba(0, 0, 0, 0.3)', 
                      padding: '1rem', 
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 215, 0, 0.3)',
                      marginBottom: '1.5rem'
                    }}>
                      <div style={{ color: '#ffd700', marginBottom: '0.8rem', fontSize: '1.1rem', textAlign: 'center' }}>
                        生肖运势分析
                      </div>
                      <Content>
                        {dailyFortune.animalInfo.description}
                      </Content>
                    </div>
                    
                    {/* 生肖运势详细分析 */}
                    <div style={{ margin: '1.5rem 0' }}>
                      <div style={{ 
                        color: '#ffd700', 
                        marginBottom: '1rem', 
                        fontSize: '1.1rem',
                        textAlign: 'center',
                        position: 'relative'
                      }}>
                        <span style={{
                          position: 'relative',
                          background: '#1a1a2e',
                          padding: '0 1rem',
                          zIndex: 1
                        }}>
                          运势详解
                        </span>
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: 0,
                          right: 0,
                          height: '1px',
                          background: 'rgba(255, 215, 0, 0.3)',
                          zIndex: 0
                        }}></div>
                      </div>
                      
                      <CategoryCard>
                        <CategoryHeader>
                          <CategoryName>整体运势</CategoryName>
                          <div style={{ color: '#ffd700', marginLeft: '0.8rem' }}>{dailyFortune.animalInfo.analysis.overall}</div>
                        </CategoryHeader>
                        <CategoryDescription>今日运势平稳，适合规划和执行重要计划。保持冷静理性的态度，会有不错的收获。</CategoryDescription>
                        <CategoryAdvice>建议：{dailyFortune.animalInfo.advice}</CategoryAdvice>
                      </CategoryCard>
                      
                      <CategoryCard>
                        <CategoryHeader>
                          <CategoryName>事业运势</CategoryName>
                          <div style={{ color: '#ffd700', marginLeft: '0.8rem' }}>{dailyFortune.animalInfo.analysis.career}</div>
                        </CategoryHeader>
                        <CategoryDescription>职场上可能会遇到新的机遇，团队协作顺利。注意把握细节，展现专业能力。</CategoryDescription>
                        <CategoryAdvice>建议：保持专注，注重细节。</CategoryAdvice>
                      </CategoryCard>
                      
                      <CategoryCard>
                        <CategoryHeader>
                          <CategoryName>财运运势</CategoryName>
                          <div style={{ color: '#ffd700', marginLeft: '0.8rem' }}>{dailyFortune.animalInfo.analysis.wealth}</div>
                        </CategoryHeader>
                        <CategoryDescription>财运较好，可能有额外收入。投资方面要保持谨慎，避免冒险。</CategoryDescription>
                        <CategoryAdvice>建议：稳健理财，适度消费。</CategoryAdvice>
                      </CategoryCard>
                      
                      <CategoryCard>
                        <CategoryHeader>
                          <CategoryName>感情运势</CategoryName>
                          <div style={{ color: '#ffd700', marginLeft: '0.8rem' }}>{dailyFortune.animalInfo.analysis.love}</div>
                        </CategoryHeader>
                        <CategoryDescription>感情生活平稳，与伴侣沟通顺畅。单身者可能会遇到有趣的人。</CategoryDescription>
                        <CategoryAdvice>建议：保持真诚，珍惜缘分。</CategoryAdvice>
                      </CategoryCard>
                      
                      <CategoryCard>
                        <CategoryHeader>
                          <CategoryName>健康运势</CategoryName>
                          <div style={{ color: '#ffd700', marginLeft: '0.8rem' }}>{dailyFortune.animalInfo.analysis.health}</div>
                        </CategoryHeader>
                        <CategoryDescription>身体状况良好，但要注意劳逸结合。适当运动能提升身心状态。</CategoryDescription>
                        <CategoryAdvice>建议：规律作息，适度运动。</CategoryAdvice>
                      </CategoryCard>
                    </div>
                  </div>
                )}

                {/* 幸运提示部分 */}
                {(dailyFortune.isFullShare || dailyFortune.activeTab === 'lucky') && dailyFortune.luckyInfo && (
                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{ 
                      color: '#ffd700', 
                      marginBottom: '1rem', 
                      fontSize: '1.1rem',
                      textAlign: 'center',
                      position: 'relative'
                    }}>
                      <span style={{
                        position: 'relative',
                        background: '#1a1a2e',
                        padding: '0 1rem',
                        zIndex: 1
                      }}>
                        今日幸运提示
                      </span>
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: 'rgba(255, 215, 0, 0.3)',
                        zIndex: 0
                      }}></div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
                        <div style={{ color: '#ffd700', marginBottom: '5px' }}>🎨 幸运色：</div>
                        <div>{dailyFortune.luckyInfo.color}</div>
                      </div>
                      
                      <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
                        <div style={{ color: '#ffd700', marginBottom: '5px' }}>🔢 幸运数字：</div>
                        <div>{dailyFortune.luckyInfo.number}</div>
                      </div>
                      
                      <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
                        <div style={{ color: '#ffd700', marginBottom: '5px' }}>🔑 幸运关键词：</div>
                        <div>{dailyFortune.luckyInfo.keyword}</div>
                      </div>
                      
                      <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
                        <div style={{ color: '#ffd700', marginBottom: '5px' }}>✅ 今日宜：</div>
                        <div>{Array.isArray(dailyFortune.luckyInfo.goodActivity) 
                          ? dailyFortune.luckyInfo.goodActivity.join('、') 
                          : dailyFortune.luckyInfo.goodActivity}</div>
                      </div>
                      
                      <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
                        <div style={{ color: '#ffd700', marginBottom: '5px' }}>❌ 今日忌：</div>
                        <div>{Array.isArray(dailyFortune.luckyInfo.badActivity) 
                          ? dailyFortune.luckyInfo.badActivity.join('、') 
                          : dailyFortune.luckyInfo.badActivity}</div>
                      </div>
                      
                      <div style={{ 
                        padding: '15px', 
                        borderRadius: '8px', 
                        background: 'rgba(255, 215, 0, 0.1)',
                        borderLeft: '3px solid #ffd700'
                      }}>
                        <div style={{ color: '#ffd700', marginBottom: '5px' }}>🌟 行为引导：</div>
                        <div>{dailyFortune.luckyInfo.behavior}</div>
                      </div>
                    </div>
                  </div>
                )}
              </DailyFortuneContent>
            </>
          )}

          {tarotResult && tarotResult.cards && tarotResult.cards.length > 0 && (
            <>
              <CardsContainer>
                {tarotResult.cards.map((card, index) => (
                  <CardItem key={index}>
                    <CardImageWrapper isReversed={card.isReversed}>
                      <CardImage 
                        src={card.image} 
                        alt={card.name}
                        onError={(e) => {
                          e.currentTarget.src = '/card-back.jpg';
                        }}
                      />
                    </CardImageWrapper>
                    <CardName>
                      {card.name} {card.isReversed ? '(逆位)' : '(正位)'}
                    </CardName>
                    <CardPosition>
                      {card.position}
                    </CardPosition>
                  </CardItem>
                ))}
              </CardsContainer>

              <InterpretationSection>
                <CategorySection>
                  <CategoryTitle>事业发展</CategoryTitle>
                  <CategoryContent>
                    目前{extractCardMeaning('现在') || '改变，机遇，命运'}的状态，未来将会{extractCardMeaning('未来') || '创造力受阻，依赖性，过度保护'}。
                  </CategoryContent>
                </CategorySection>

                <CategorySection>
                  <CategoryTitle>感情状况</CategoryTitle>
                  <CategoryContent>
                    在感情中{extractCardMeaning('现在') || '改变，机遇，命运'}，将会遇到{extractCardMeaning('未来') || '创造力受阻，依赖性，过度保护'}的情况。
                  </CategoryContent>
                </CategorySection>

                <CategorySection>
                  <CategoryTitle>心理指引</CategoryTitle>
                  <CategoryContent>
                    过去的{extractCardMeaning('过去') || '富裕，不负责任，过度冒险'}经历，这将帮助你{extractCardMeaning('未来') || '创造力受阻，依赖性，过度保护'}。
                  </CategoryContent>
                </CategorySection>
              </InterpretationSection>

              <GuidanceSection>
                <GuidanceTitle>塔罗指引</GuidanceTitle>
                <GuidanceText>
                  根据塔罗牌的指引，你过去的{extractCardMeaning('过去') || '富裕，不负责任，过度冒险'}经历塑造了现在的你。目前你正处于{extractCardMeaning('现在') || '改变，机遇，命运'}的状态，这为你带来了新的机遇和挑战。在未来，你将{extractCardMeaning('未来') || '创造力受阻，依赖性，过度保护'}，这预示着一段重要的转变期。建议你保持开放和善良的心态，相信自己的直觉，勇敢地面对即将到来的改变。每一个挑战都是成长的机会，保持耐心和乐观的心态，相信自己的目标和理想。
                </GuidanceText>
              </GuidanceSection>
            </>
          )}

          <Footer>
            <QRCodeContainer>
              <QRCodeSVG 
                value={window.location.href}
                size={80}
                level="H"
              />
            </QRCodeContainer>
            <Watermark>
              二次元占卜屋 {dailyFortune ? '· 每日运势' : '· JOJO塔罗牌'}
              <br />
              扫描二维码获取你的占卜结果
            </Watermark>
          </Footer>
        </ShareContent>
      </ShareCard>

      <ButtonContainer>
        <StyledButton 
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
        >
          返回结果
        </StyledButton>
        <StyledButton 
          icon={<DownloadOutlined />}
          onClick={handleSaveImage}
          loading={isSaving}
        >
          保存图片
        </StyledButton>
        {navigator.share && (
          <StyledButton 
            icon={<ShareAltOutlined />}
            onClick={handleShare}
          >
            分享
          </StyledButton>
        )}
      </ButtonContainer>
    </Container>
  );
};

export default ShareResult; 