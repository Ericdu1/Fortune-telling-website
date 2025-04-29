import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Button, Typography, Badge, Carousel } from 'antd';
import { 
  StarOutlined, 
  CalendarOutlined, 
  ExperimentOutlined,
  FireOutlined,
  ThunderboltOutlined,
  RightOutlined,
  UserOutlined
} from '@ant-design/icons';
// 自定义导入魔杖图标
import MagicWandOutlined from '@ant-design/icons/lib/icons/ExperimentOutlined';
import { motion, AnimatePresence } from 'framer-motion';

const { Title, Text } = Typography;

// 主容器
const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

// 动画容器
const MotionContainer = motion(Container);

// 页面标题区域
const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 1rem;
  position: relative;
`;

// 主标题
const MainTitle = styled(Title)`
  margin: 0 !important;
  background: linear-gradient(to right, #ffd700, #ff9500, #ff6347);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 15px rgba(255, 215, 0, 0.3);
  font-weight: 800 !important;
  letter-spacing: -0.5px;
  font-size: 2.8rem !important;
  
  @media (max-width: 768px) {
    font-size: 2.2rem !important;
  }
`;

// 副标题
const MainSubtitle = styled(Text)`
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.2rem;
  display: inline-block;
  margin-top: 0.7rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: 60px;
    height: 3px;
    background: linear-gradient(to right, #ffd700, transparent);
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 3px;
  }
`;

// Banner区域
const BannerSection = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 240px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    height: 180px;
  }
`;

// 轮播组件样式
const StyledCarousel = styled(Carousel)`
  height: 100%;
  
  .slick-dots {
    margin-bottom: 12px;
    
    li button {
      background: rgba(255, 255, 255, 0.5);
      
      &:hover {
        background: rgba(255, 255, 255, 0.8);
      }
    }
    
    li.slick-active button {
      background: #ffd700;
    }
  }
`;

// Banner内容样式
const BannerSlide = styled.div<{ bgImage: string }>`
  height: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(${props => props.bgImage});
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2.5rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at bottom right, rgba(255, 215, 0, 0.15), transparent 70%);
    z-index: 1;
  }
  
  h3 {
    color: white;
    font-size: 2rem;
    margin: 0;
    margin-bottom: 0.5rem;
    font-weight: 700;
    position: relative;
    z-index: 2;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    
    @media (max-width: 768px) {
      font-size: 1.6rem;
    }
  }
  
  p {
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    position: relative;
    z-index: 2;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    max-width: 80%;
    font-size: 1.1rem;
    
    @media (max-width: 768px) {
      font-size: 0.95rem;
      max-width: 100%;
    }
  }
`;

// 内容布局区域
const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

// 左侧内容区域
const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

// 右侧内容区域
const RightContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

// 功能区域标题
const SectionTitle = styled.h2`
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1.2rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::after {
    content: '';
    display: block;
    height: 1px;
    background: linear-gradient(to right, rgba(255, 215, 0, 0.3), transparent);
    flex-grow: 1;
    margin-left: 1rem;
  }
`;

// 每日运势卡片
const FortuneCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.15), rgba(255, 165, 0, 0.15));
  border-radius: 24px;
  padding: 2.2rem;
  border: 1px solid rgba(255, 215, 0, 0.2);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at top right, rgba(255, 215, 0, 0.15), transparent 70%);
    z-index: 0;
  }
  
  &:hover {
    border-color: rgba(255, 215, 0, 0.4);
  }
`;

// 每日运势标题
const FortuneTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.8rem;
  position: relative;
  z-index: 1;
  
  .icon-container {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #ffa502, #ff6b6b);
    border-radius: 16px;
    display: flex;
  justify-content: center;
    align-items: center;
    font-size: 1.8rem;
    color: white;
    box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
  }
  
  h3 {
    color: #ffd700;
    font-size: 1.9rem;
    margin: 0;
    font-weight: 700;
    text-shadow: 0 2px 10px rgba(255, 215, 0, 0.3);
  }
`;

// 每日运势内容
const FortuneContent = styled.div`
  position: relative;
  z-index: 1;

  p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
    margin-bottom: 2rem;
    line-height: 1.7;
  }
`;

// 开始占卜按钮
const ActionButton = styled(Button)`
  background: linear-gradient(45deg, #6b6bff, #8e8eff);
  border: none;
  height: 54px;
  font-size: 1.1rem;
  border-radius: 27px;
  padding: 0 2rem;
  box-shadow: 0 8px 20px rgba(107, 107, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background: linear-gradient(45deg, #5a5aff, #7d7dff);
    transform: translateY(-3px);
    box-shadow: 0 12px 25px rgba(107, 107, 255, 0.4);
  }
  
  &:active {
    transform: translateY(-1px);
  }
  
  .anticon {
    font-size: 1.2rem;
    transition: transform 0.3s ease;
  }
  
  &:hover .anticon {
    transform: translateX(4px);
  }
`;

// 功能卡片 - 增强辨识度和视觉效果
const FeatureCard = styled(motion.div)<{ gradientStart: string; gradientEnd: string; isNew?: boolean; theme: string }>`
  background: linear-gradient(135deg, 
    rgba(${props => props.gradientStart}, 0.2), 
    rgba(${props => props.gradientEnd}, 0.1)
  );
  border-radius: 24px;
  padding: 2rem;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.12);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  height: 100%;
  display: flex;
  flex-direction: column;
  
  /* 主题背景图案 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => {
      switch(props.theme) {
        case 'jojo':
          return `
            radial-gradient(circle at top left, rgba(${props.gradientStart}, 0.15), transparent 70%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231e90ff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `;
        case 'tarot':
          return `
            radial-gradient(circle at bottom right, rgba(${props.gradientStart}, 0.15), transparent 70%),
            url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239c88ff' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `;
        case 'fortune':
          return `
            radial-gradient(circle at bottom left, rgba(${props.gradientStart}, 0.15), transparent 70%),
            url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffa502' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")
          `;
        default:
          return `radial-gradient(circle at bottom left, rgba(${props.gradientStart}, 0.15), transparent 70%)`;
      }
    }};
    background-position: center;
    z-index: 0;
  }
  
  /* 增强悬停效果 */
  &:hover {
    transform: translateY(-7px);
    border-color: rgba(${props => props.gradientStart}, 0.4);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
    
    &::after {
      opacity: 0.6;
      transform: scale(1.05);
    }
  }
  
  /* 添加光晕效果 */
  &::after {
    content: '';
    position: absolute;
    top: -20%;
    left: -20%;
    width: 140%;
    height: 140%;
    background: radial-gradient(
      circle at center,
      rgba(${props => props.gradientStart}, 0.1) 0%,
      transparent 70%
    );
    opacity: 0;
    z-index: 0;
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
`;

// 功能标题 - 增强图标区域样式
const FeatureTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.2rem;
  position: relative;
  z-index: 1;
  
  .icon-container {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.6rem;
    color: white;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    transform: rotate(-5deg);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    
    /* 图标背景效果 */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: inherit;
      opacity: 0.7;
      z-index: -1;
    }
    
    /* 图标闪光效果 */
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: -100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      transition: 0.5s;
    }
  }

  ${FeatureCard}:hover & .icon-container {
    transform: rotate(0deg) scale(1.1);
    
    &::after {
      left: 100%;
      transition: 0.5s;
    }
  }
  
  h3 {
    color: white;
    font-size: 1.6rem;
    margin: 0;
    font-weight: 600;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

// 功能描述
const FeatureDescription = styled.p`
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.05rem;
  margin: 0 0 1.5rem 0;
  position: relative;
  z-index: 1;
  flex-grow: 1;
  line-height: 1.6;
`;

// 卡片底部
const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  position: relative;
  z-index: 1;
`;

// 卡片动作区域
const CardAction = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
  gap: 0.5rem;
  opacity: 0.85;
  transition: all 0.3s ease;
  
  ${FeatureCard}:hover & {
    opacity: 1;
    transform: translateX(4px);
  }
`;

// 热门标签
const HotTag = styled.div`
  display: flex;
  align-items: center;
  padding: 0.3rem 0.8rem;
  border-radius: 14px;
  background: rgba(255, 107, 107, 0.25);
  color: #ff6b6b;
  font-size: 0.85rem;
  font-weight: 600;
  gap: 0.4rem;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.15);
`;

// 新功能标签
const NewTag = styled.div`
  display: flex;
  align-items: center;
  padding: 0.3rem 0.8rem;
  border-radius: 14px;
  background: rgba(30, 144, 255, 0.25);
  color: #1e90ff;
  font-size: 0.85rem;
  font-weight: 600;
  gap: 0.4rem;
  box-shadow: 0 4px 12px rgba(30, 144, 255, 0.15);
`;

// 禁用卡片
const DisabledCard = styled(FeatureCard)`
  opacity: 0.7;
  cursor: not-allowed;
  
  &:hover {
    transform: none;
    border-color: rgba(255, 255, 255, 0.12);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }
`;

// 卡片装饰元素
const CardDecoration = styled.div`
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1), transparent);
  right: -50px;
  bottom: -50px;
  z-index: 0;
  opacity: 0.5;
  transition: all 0.5s ease;
  
  ${FeatureCard}:hover & {
    transform: scale(1.2);
    opacity: 0.7;
  }
`;

// 卡片动画配置
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 * i,
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1]
    }
  })
};

// 动画变体
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
};

// 新功能标记 - 缎带式设计，位置微调至最佳位置
const NewBadge = styled.div`
  position: absolute;
  top: 3px;  // 上调位置，找到一个平衡点
  right: -60px;
  width: 160px;
  background: linear-gradient(135deg, #FF416C, #FF4B2B);
  color: white;
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.5rem 0;
  z-index: 10;
  letter-spacing: 1px;
  transform: rotate(35deg);
  box-shadow: 0 5px 20px rgba(255, 65, 108, 0.4);
  text-transform: uppercase;
  text-align: center;
  
  /* 添加边框增强对比度 */
  border-top: 1px solid rgba(255, 255, 255, 0.6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);
  
  /* 三角形切角效果 */
  &::before, &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    width: 5px;
    height: 5px;
    background: rgba(150, 24, 24, 0.9);
    z-index: -1;
  }
  
  &::before {
    left: 0;
    box-shadow: -2px 2px 5px rgba(0, 0, 0, 0.2);
  }
  
  &::after {
    right: 0;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  }
  
  /* 添加闪光和脉动效果 */
  span {
    position: relative;
    display: inline-block;
    
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.6), transparent);
      animation: shine 3s infinite;
    }
  }
  
  @keyframes shine {
    0% {
      transform: translateX(-100%);
    }
    20%, 100% {
      transform: translateX(100%);
    }
  }
  
  /* 整体缎带的脉动效果 */
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% {
      transform: rotate(35deg) scale(1);
      box-shadow: 0 5px 20px rgba(255, 65, 108, 0.4);
    }
    50% {
      transform: rotate(35deg) scale(1.05);
      box-shadow: 0 5px 25px rgba(255, 65, 108, 0.6);
    }
  }
`;

// 虚影标志组件 - 修正图片路径
const JojoSilhouette = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 150px;
  height: 200px;
  background-image: url('/images/jojo/Jotaro_Kujo.webp');
  background-size: contain;
  background-position: bottom right;
  background-repeat: no-repeat;
  opacity: 0.15;
  transform: rotate(-5deg);
  filter: contrast(200%) brightness(15%) saturate(0%);
  z-index: 0;
  transition: all 0.5s ease;

  ${FeatureCard}:hover & {
    opacity: 0.25;
    transform: rotate(0deg) scale(1.05);
  }
`;

const TarotSilhouette = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  width: 100px;
  height: 180px;
  background-image: url('/images/tarot/17_OVATarot_TheStar.png');
  background-size: contain;
  background-position: bottom right;
  background-repeat: no-repeat;
  opacity: 0.2;
  transform: rotate(5deg);
  filter: brightness(120%) contrast(120%);
  z-index: 0;
  transition: all 0.5s ease;
  
  ${FeatureCard}:hover & {
    opacity: 0.3;
    transform: rotate(10deg) scale(1.1);
  }
`;

const FortuneSilhouette = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 120px;
  height: 120px;
  background-image: url('/images/icons/zodiac-wheel.svg');
  background-size: contain;
  background-position: bottom right;
  background-repeat: no-repeat;
  opacity: 0.15;
  transform: rotate(0deg);
  filter: brightness(150%);
  z-index: 0;
  transition: all 0.5s ease;
  
  ${FortuneCard}:hover & {
    opacity: 0.25;
    transform: rotate(-10deg) scale(1.1);
  }
`;

const MoreSilhouette = styled.div`
  position: absolute;
  right: 20px;
  bottom: 10px;
  width: 100px;
  height: 100px;
  background-image: url('/images/icons/crystal-ball.svg'); 
  background-size: contain;
  background-position: bottom right;
  background-repeat: no-repeat;
  opacity: 0.12;
  transform: rotate(0deg);
  filter: brightness(130%);
  z-index: 0;
  transition: all 0.5s ease;
  
  ${FeatureCard}:hover & {
    opacity: 0.2;
    transform: rotate(5deg) scale(1.1);
  }
`;

// 添加异世界虚影
const IsekaiSilhouette = styled.div`
  position: absolute;
  right: 15px;
  bottom: 10px;
  width: 120px;
  height: 120px;
  background-image: url('/images/isekai/logo.svg');
  background-size: contain;
  background-position: bottom right;
  background-repeat: no-repeat;
  opacity: 0.15;
  transform: rotate(0deg);
  filter: brightness(120%);
  z-index: 0;
  transition: all 0.5s ease;
  
  ${FeatureCard}:hover & {
    opacity: 0.25;
    transform: rotate(5deg) scale(1.1);
  }
`;

interface HomeProps {
  onStartTarot: () => void;
  onStartDaily: () => void;
  onStartJojoMbti: () => void;
  onStartIsekai: () => void;
}

const Home: React.FC<HomeProps> = ({ onStartTarot, onStartDaily, onStartJojoMbti, onStartIsekai }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  // Banner数据
  const banners = [
    {
      title: '每日星座运势',
      description: '新的一天，为你揭示神秘的星座力量与塔罗指引',
      image: '/images/banners/fortune-banner.jpg',
      action: onStartDaily
    },
    {
      title: '塔罗牌占卜',
      description: '解读塔罗牌的神秘信息，指引未来方向',
      image: '/images/banners/tarot-banner.jpg',
      action: onStartTarot
    },
    {
      title: 'JOJO MBTI性格测试',
      description: '发现你在JOJO奇妙冒险中的角色替身',
      image: '/images/banners/jojo-banner.jpg',
      action: onStartJojoMbti
    },
    {
      title: '多维世界穿越测试',
      description: '探索你专属的异世界穿越故事，发现你的潜在能力',
      image: '/images/isekai/banner.svg',
      action: onStartIsekai
    }
  ];

  return (
    <AnimatePresence>
      <MotionContainer 
        variants={containerVariants}
        initial="hidden" 
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* 删除原有的标题区域，不再显示 "二次元占卜屋" 标题 */}
        
        {/* Banner区域 - 轮播展示主要功能 */}
        <BannerSection
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <StyledCarousel autoplay effect="fade">
            {banners.map((banner, index) => (
              <div key={index} onClick={banner.action}>
                <BannerSlide bgImage={banner.image}>
                  <h3>{banner.title}</h3>
                  <p>{banner.description}</p>
                </BannerSlide>
              </div>
            ))}
          </StyledCarousel>
        </BannerSection>
        
        {/* 内容区域 */}
        <ContentLayout>
          {/* 左侧内容 */}
          <LeftContent>
            {/* JOJO MBTI测试 - 新功能置顶 */}
            <FeatureCard
              gradientStart="30, 144, 255"
              gradientEnd="112, 161, 255"
              onClick={onStartJojoMbti}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={0}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              style={{ position: 'relative', overflow: 'hidden', height: 'auto', maxHeight: '350px' }}
              theme="jojo"
            >
              <NewBadge><span>New</span></NewBadge>
              <FeatureTitle>
                <div className="icon-container" style={{ background: 'linear-gradient(135deg, #1e90ff, #70a1ff)' }}>
                  <UserOutlined />
                </div>
                <h3>JOJO MBTI测试</h3>
              </FeatureTitle>
              <FeatureDescription>
                测试你是JOJO中的哪个角色，发现你的替身能力与性格特点，探索你的潜能与命运
              </FeatureDescription>
              <CardFooter>
                <NewTag><ThunderboltOutlined /> 新功能</NewTag>
                <CardAction>开始测试 <RightOutlined /></CardAction>
              </CardFooter>
              <CardDecoration />
              {/* 添加JOJO虚影 */}
              <JojoSilhouette />
            </FeatureCard>
            
            {/* 每日运势区域 - 添加整体点击事件 */}
            <FortuneCard
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              whileHover={{ y: -5 }}
              onClick={onStartDaily}  // 添加点击事件处理函数
              style={{ cursor: 'pointer' }} // 添加鼠标指针样式
            >
              <FortuneTitle>
                <div className="icon-container">
                  <CalendarOutlined />
                </div>
                <h3>每日运势</h3>
              </FortuneTitle>
              <FortuneContent>
                <p>每天一次的运势预测，让你了解今日的吉凶祸福。星座、塔罗、八字合一，精准解读你的今日运势。</p>
                <ActionButton 
                  type="primary" 
                  size="large" 
                  icon={<RightOutlined />}
                >
                  开始占卜
                </ActionButton>
              </FortuneContent>
              <CardDecoration />
              {/* 添加星座轮盘虚影 */}
              <FortuneSilhouette />
            </FortuneCard>
          </LeftContent>
          
          {/* 右侧内容 */}
          <RightContent>
            {/* 塔罗牌占卜 */}
            <FeatureCard
              gradientStart="156, 136, 255"
              gradientEnd="140, 122, 230"
              onClick={onStartTarot}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={1}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              theme="tarot"
            >
              <FeatureTitle>
                <div className="icon-container" style={{ background: 'linear-gradient(135deg, #9c88ff, #8c7ae6)' }}>
                  <StarOutlined />
                </div>
                <h3>塔罗牌占卜</h3>
              </FeatureTitle>
              <FeatureDescription>
                解读塔罗牌的神秘信息，指引未来方向，探索你未知的命运轨迹。每一张牌都蕴含着深刻的人生智慧。
              </FeatureDescription>
              <CardFooter>
                <HotTag><FireOutlined /> 热门</HotTag>
                <CardAction>开始占卜 <RightOutlined /></CardAction>
              </CardFooter>
              <CardDecoration />
              {/* 添加塔罗牌虚影 */}
              <TarotSilhouette />
            </FeatureCard>
            
            {/* 异世界穿越测试 - 新增功能 */}
            <FeatureCard
              gradientStart="255, 107, 107"
              gradientEnd="255, 165, 0"
              onClick={onStartIsekai}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={2}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              theme="isekai"
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              <NewBadge><span>New</span></NewBadge>
              <FeatureTitle>
                <div className="icon-container" style={{ background: 'linear-gradient(135deg, #ff6b6b, #ffa500)' }}>
                  <ExperimentOutlined />
                </div>
                <h3>异世界穿越测试</h3>
              </FeatureTitle>
              <FeatureDescription>
                探索你专属的穿越故事，测试你在异世界会觉醒什么能力，面临怎样的命运挑战！
              </FeatureDescription>
              <CardFooter>
                <NewTag><ThunderboltOutlined /> 新功能</NewTag>
                <CardAction>开始测试 <RightOutlined /></CardAction>
              </CardFooter>
              <CardDecoration />
              {/* 添加异世界虚影 - 使用内联样式 */}
              <div style={{
                position: 'absolute',
                right: '15px',
                bottom: '10px',
                width: '120px',
                height: '120px',
                backgroundImage: 'url(/images/isekai/logo.svg)',
                backgroundSize: 'contain',
                backgroundPosition: 'bottom right',
                backgroundRepeat: 'no-repeat',
                opacity: 0.15,
                transform: 'rotate(0deg)',
                filter: 'brightness(120%)',
                zIndex: 0,
                transition: 'all 0.5s ease'
              }} />
            </FeatureCard>
            
            {/* 更多功能（禁用） */}
            <DisabledCard
              gradientStart="108, 92, 231"
              gradientEnd="90, 77, 174"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={3}
              theme="fortune"
            >
              <FeatureTitle>
                <div className="icon-container" style={{ background: 'linear-gradient(135deg, #6c5ce7, #5a4eae)' }}>
                  <MagicWandOutlined />
                </div>
                <h3>更多功能</h3>
              </FeatureTitle>
              <FeatureDescription>
                更多二次元占卜功能，如命运之轮、元素解析等功能即将上线。敬请期待更多精彩内容。
              </FeatureDescription>
              <CardFooter>
                <Badge count="即将上线" style={{ backgroundColor: '#6c5ce7', fontWeight: 'bold', padding: '0 10px' }} />
              </CardFooter>
              <CardDecoration />
              {/* 添加水晶球虚影 */}
              <MoreSilhouette />
            </DisabledCard>
          </RightContent>
        </ContentLayout>
      </MotionContainer>
    </AnimatePresence>
  );
};

export default Home; 