import React, { useRef, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Button, message, Tag } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons';
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

  // 提取卡片意义的辅助函数(恢复这个函数以修复塔罗牌部分的错误)
  const extractCardMeaning = (position: string) => {
    const card = tarotResult?.cards?.find(c => c.position === position);
    return card?.isReversed ? card.reversedMeaning : card?.meaning;
  };

  // 组件挂载时生成简化版内容
  useEffect(() => {
    if (dailyFortune) {
      // 生成简化的HTML内容用于图片
      generateSimpleContent();
    }
  }, [dailyFortune, tarotResult]);

  // 生成简化版的内容用于图片生成
  const generateSimpleContent = () => {
    if (!dailyFortune) return;
    
    // 构建简单的HTML结构
    const content = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; background: #1a1a2e; color: white; padding: 24px; width: 100%; max-width: 500px; border-radius: 12px;">
        <!-- 头部 -->
        <div style="text-align: center; margin-bottom: 16px; border-bottom: 1px solid rgba(255, 215, 0, 0.3); padding-bottom: 16px;">
          <h2 style="color: #ffd700; font-size: 28px; margin-bottom: 8px;">二次元占卜屋</h2>
          <div style="color: #e0e0e0; font-size: 16px;">${formatDate()} 今日运势</div>
        </div>
        
        <!-- 运势标题 -->
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="font-size: 24px; color: #ffd700; margin-bottom: 8px; font-weight: bold;">今日运势占卜</div>
          <div style="font-size: 18px; color: #e0e0e0; margin-bottom: 16px;">${dailyFortune.date}</div>
          <div style="margin: 16px 0;">
            <div style="color: #ffd700; margin-bottom: 8px;">今日运势指数</div>
            <div style="color: #ffd700; font-size: 24px;">${'★'.repeat(dailyFortune.luck)}${'☆'.repeat(5 - dailyFortune.luck)}</div>
          </div>
        </div>
        
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
    if (!contentRef.current) return;
    
    setLoading(true);
    try {
      // 直接创建一个新的HTML页面，然后在新页面中生成图片
      const newWindow = window.open('', '_blank');
      if (!newWindow) {
        message.error('无法创建新窗口，请检查浏览器设置');
        setLoading(false);
        return;
      }
      
      // 为新窗口写入内容
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>二次元占卜屋 - 今日运势</title>
          <meta charset="UTF-8">
          <style>
            body {
              background: #1a1a2e;
              color: white;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
            }
            .fortune-card {
              max-width: 600px;
              background: #1a1a2e;
              padding: 30px;
              border-radius: 12px;
              box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            }
            .header {
              text-align: center;
              border-bottom: 1px solid rgba(255,215,0,0.3);
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .title {
              color: #ffd700;
              font-size: 28px;
              margin: 0 0 10px 0;
            }
            .date {
              color: #e0e0e0;
              font-size: 16px;
            }
            .section {
              margin: 25px 0;
            }
            .section-title {
              color: #ffd700;
              font-size: 20px;
              text-align: center;
              margin-bottom: 15px;
            }
            .content {
              background: rgba(0,0,0,0.3);
              padding: 15px;
              border-radius: 8px;
              border: 1px solid rgba(255,215,0,0.3);
              line-height: 1.6;
            }
            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
              margin: 15px 0;
            }
            .grid-item {
              display: flex;
              align-items: center;
              gap: 10px;
              background: rgba(0,0,0,0.2);
              padding: 12px;
              border-radius: 8px;
              border: 1px solid rgba(255,255,255,0.1);
            }
            .grid-icon {
              font-size: 24px;
              color: #ffd700;
            }
            .sign {
              background: rgba(255,215,0,0.1);
              padding: 15px;
              border-radius: 8px;
              border-left: 3px solid #ffd700;
              margin: 20px 0;
            }
            .sign-title {
              color: #ffd700;
              margin-bottom: 10px;
            }
            .sign-content {
              font-style: italic;
              font-size: 18px;
            }
            .category-card {
              margin: 15px 0;
              padding: 15px;
              background: rgba(255,255,255,0.05);
              border: 1px solid rgba(255,215,0,0.3);
              border-radius: 8px;
            }
            .category-header {
              display: flex;
              align-items: center;
              margin-bottom: 10px;
            }
            .category-name {
              color: #ffd700;
              font-size: 18px;
            }
            .category-level {
              margin-left: 10px;
              padding: 2px 8px;
              border-radius: 4px;
              color: white;
            }
            .level-SSR { background: linear-gradient(45deg, #FFD700, #FFA500); }
            .level-SR { background: linear-gradient(45deg, #C0C0C0, #A0A0A0); }
            .level-R { background: linear-gradient(45deg, #CD7F32, #8B4513); }
            .level-N { background: linear-gradient(45deg, #808080, #696969); }
            .lucky-stars {
              color: #ffd700;
              font-size: 24px;
              text-align: center;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #a0a0a0;
              font-size: 14px;
              border-top: 1px solid rgba(255,215,0,0.2);
              padding-top: 15px;
            }
            .print-btn {
              display: block;
              margin: 20px auto;
              padding: 10px 20px;
              background: #4a69bd;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 16px;
            }
            .print-btn:hover {
              background: #1e3799;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .print-btn {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="fortune-card">
            <!-- 头部 -->
            <div class="header">
              <h1 class="title">二次元占卜屋</h1>
              <div class="date">${formatDate()} 今日运势</div>
            </div>
            
            <!-- 运势标题 -->
            <div style="text-align: center;">
              <h2 style="color: #ffd700; margin: 0 0 10px 0;">今日运势占卜</h2>
              <div style="color: #e0e0e0;">${dailyFortune?.date}</div>
              <div style="margin: 15px 0;">
                <div style="color: #ffd700; margin-bottom: 8px;">今日运势指数</div>
                <div class="lucky-stars">${dailyFortune ? '★'.repeat(dailyFortune.luck) + '☆'.repeat(5 - dailyFortune.luck) : ''}</div>
              </div>
            </div>
            
            <!-- 总体运势 -->
            <div class="section">
              <div class="section-title">总体运势</div>
              <div class="content">${dailyFortune?.content}</div>
            </div>
            
            <!-- 运势概览 -->
            <div class="section">
              <div class="section-title">运势概览</div>
              <div class="grid">
                <div class="grid-item">
                  <span class="grid-icon">🎮</span>
                  <span>游戏运势：${dailyFortune?.categories.game?.level || 'N'}</span>
                </div>
                <div class="grid-item">
                  <span class="grid-icon">👥</span>
                  <span>社交运势：${dailyFortune?.categories.social?.level || 'N'}</span>
                </div>
                <div class="grid-item">
                  <span class="grid-icon">✍️</span>
                  <span>创作运势：${dailyFortune?.categories.create?.level || 'N'}</span>
                </div>
                <div class="grid-item">
                  <span class="grid-icon">📺</span>
                  <span>动画运势：${dailyFortune?.categories.anime?.level || 'N'}</span>
                </div>
              </div>
            </div>
            
            <!-- 神秘签文 -->
            <div class="sign">
              <div class="sign-title">🔮 神秘签文</div>
              <div class="sign-content">${dailyFortune?.mysticMessage}</div>
            </div>
            
            <!-- 详细运势分析 -->
            <div class="section">
              <div class="section-title">详细运势分析</div>
              ${dailyFortune ? Object.entries(dailyFortune.categories).map(([key, category]) => `
                <div class="category-card">
                  <div class="category-header">
                    <span class="category-name">${category.name}</span>
                    <span class="category-level level-${category.level}">${category.level}</span>
                  </div>
                  <div>${category.description}</div>
                  <div style="color: #a0a0a0; margin-top: 8px;">建议：${category.advice}</div>
                </div>
              `).join('') : ''}
            </div>
            
            <!-- 底部 -->
            <div class="footer">
              二次元占卜屋 · 每日运势<br>
              长按图片或截图保存
            </div>
            
            <button class="print-btn" onclick="window.print(); setTimeout(() => window.close(), 500);">
              打印/保存图片
            </button>
          </div>
          
          <script>
            // 自动调整窗口大小
            document.addEventListener('DOMContentLoaded', () => {
              // 通知用户
              alert('页面已生成，您可以长按保存图片，或者点击"打印/保存图片"按钮以PNG格式保存');
            });
          </script>
        </body>
        </html>
      `);
      
      newWindow.document.close();
      message.success('图片已在新标签页生成，请在新页面保存');
    } catch (error) {
      console.error('保存图片失败:', error);
      message.error('保存图片失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>分享今日运势</Title>

      <ShareCard>
        <ShareContent ref={contentRef} className="share-content">
          <Header>
            <HeaderTitle>二次元占卜屋</HeaderTitle>
            <DateTime>
              {formatDate()} {dailyFortune ? '今日运势' : '塔罗牌占卜'}
            </DateTime>
          </Header>

          {dailyFortune && (
            <>
              <DailyFortuneHeader>
                <FortuneTitle>今日运势占卜</FortuneTitle>
                <Date>{dailyFortune.date}</Date>
                <LuckMeter>
                  <LuckTitle>今日运势指数</LuckTitle>
                  <LuckStars>{'★'.repeat(dailyFortune.luck)}{'☆'.repeat(5 - dailyFortune.luck)}</LuckStars>
                </LuckMeter>
              </DailyFortuneHeader>

              <DailyFortuneContent>
                {/* 总体运势 */}
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

                {/* 今日推荐 */}
                <RecommendSection>
                  <RecommendTitle>今日推荐</RecommendTitle>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                    {dailyFortune.dailyRecommend.anime && (
                      <RecommendCard>
                        <RecommendHeader>动画推荐</RecommendHeader>
                        <RecommendContent>
                          <div style={{ fontWeight: 'bold' }}>{dailyFortune.dailyRecommend.anime.title}</div>
                          <div>{dailyFortune.dailyRecommend.anime.episode}</div>
                        </RecommendContent>
                      </RecommendCard>
                    )}
                    
                    {dailyFortune.dailyRecommend.game && (
                      <RecommendCard>
                        <RecommendHeader>游戏推荐</RecommendHeader>
                        <RecommendContent>
                          <div style={{ fontWeight: 'bold' }}>{dailyFortune.dailyRecommend.game.title}</div>
                          <div>{dailyFortune.dailyRecommend.game.type}</div>
                        </RecommendContent>
                      </RecommendCard>
                    )}
                  </div>
                  {dailyFortune.dailyRecommend.music && (
                    <RecommendCard style={{ marginTop: '0.8rem' }}>
                      <RecommendHeader>音乐推荐</RecommendHeader>
                      <RecommendContent>
                        <div style={{ fontWeight: 'bold' }}>{dailyFortune.dailyRecommend.music.title}</div>
                        <div>{dailyFortune.dailyRecommend.music.artist}</div>
                      </RecommendContent>
                    </RecommendCard>
                  )}
                </RecommendSection>

                {/* 今日动态 */}
                {(dailyFortune.events.animeUpdates.length > 0 || 
                  dailyFortune.events.gameEvents.length > 0 || 
                  dailyFortune.events.birthdays.length > 0) && (
                  <EventsSection>
                    <EventsTitle>今日动态</EventsTitle>
                    
                    {dailyFortune.events.animeUpdates.length > 0 && (
                      <EventList>
                        <RecommendHeader>今日更新</RecommendHeader>
                        {dailyFortune.events.animeUpdates.slice(0, 3).map((item, index) => (
                          <EventItem key={index}>
                            <EventTitle>{item.title}</EventTitle>
                            <EventDescription>第{item.episode}话 - {item.time}</EventDescription>
                          </EventItem>
                        ))}
                      </EventList>
                    )}
                    
                    {dailyFortune.events.gameEvents.length > 0 && (
                      <EventList>
                        <RecommendHeader>游戏活动</RecommendHeader>
                        {dailyFortune.events.gameEvents.slice(0, 2).map((item, index) => (
                          <EventItem key={index}>
                            <EventTitle>{item.game}</EventTitle>
                            <EventDescription>{item.event} (截止: {item.endTime})</EventDescription>
                          </EventItem>
                        ))}
                      </EventList>
                    )}
                    
                    {dailyFortune.events.birthdays.length > 0 && (
                      <EventList>
                        <RecommendHeader>角色生日</RecommendHeader>
                        {dailyFortune.events.birthdays.slice(0, 2).map((item, index) => (
                          <EventItem key={index}>
                            <EventTitle>{item.character}</EventTitle>
                            <EventDescription>来自: {item.from}</EventDescription>
                          </EventItem>
                        ))}
                      </EventList>
                    )}
                  </EventsSection>
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
          onClick={() => {
            // 确保这个函数被直接调用，不依赖于handleSaveImage函数
            if (dailyFortune) {
              try {
                // 直接尝试打开新窗口，使用简单的内容测试是否弹窗被拦截
                const testWindow = window.open('', '_blank');
                if (!testWindow) {
                  message.error('浏览器阻止了弹出窗口，请允许弹窗后重试');
                  return;
                }
                
                // 写入更简单的HTML内容到新窗口
                testWindow.document.write(`
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <title>二次元占卜屋 - 今日运势</title>
                    <meta charset="UTF-8">
                    <style>
                      body {
                        background: #1a1a2e;
                        color: white;
                        font-family: -apple-system, sans-serif;
                        padding: 20px;
                      }
                      .card {
                        max-width: 500px;
                        margin: 0 auto;
                        background: rgba(0,0,0,0.3);
                        padding: 20px;
                        border-radius: 10px;
                      }
                      h1 {
                        color: #ffd700;
                        text-align: center;
                      }
                      .content {
                        line-height: 1.6;
                      }
                      .footer {
                        margin-top: 30px;
                        text-align: center;
                        color: #999;
                        font-size: 14px;
                      }
                      .print-btn {
                        display: block;
                        margin: 20px auto;
                        padding: 10px 20px;
                        background: #4a69bd;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                      }
                    </style>
                  </head>
                  <body>
                    <div class="card">
                      <h1>二次元占卜屋 - 今日运势</h1>
                      <div class="content">
                        <h3>今日运势: ${dailyFortune.date}</h3>
                        <p>${dailyFortune.content}</p>
                        <p>运势指数: ${'★'.repeat(dailyFortune.luck)}${'☆'.repeat(5 - dailyFortune.luck)}</p>
                      </div>
                      <div class="footer">
                        二次元占卜屋 · 每日运势
                      </div>
                      <button class="print-btn" onclick="window.print()">打印/保存图片</button>
                    </div>
                  </body>
                  </html>
                `);
                testWindow.document.close();
                message.success('运势图片已在新窗口生成，请在新窗口中操作');
              } catch (error) {
                console.error('生成分享图片失败:', error);
                message.error('分享失败，请检查浏览器设置并重试');
              }
            } else {
              message.info('没有可分享的运势内容');
            }
          }}
          loading={loading}
        >
          保存图片
        </StyledButton>
      </ButtonContainer>
    </Container>
  );
};

export default ShareResult; 