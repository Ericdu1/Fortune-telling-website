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

// 功能卡片
const FeatureCard = styled(motion.div)<{ gradientStart: string; gradientEnd: string; isNew?: boolean }>`
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
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at bottom left, rgba(${props => props.gradientStart}, 0.15), transparent 70%);
    z-index: 0;
  }
  
  &:hover {
    transform: translateY(-7px);
    border-color: rgba(${props => props.gradientStart}, 0.4);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
  }
`;

// 功能标题
const FeatureTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.2rem;
  position: relative;
  z-index: 1;
  
  .icon-container {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.6rem;
    color: white;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    transform: rotate(-5deg);
    transition: transform 0.3s ease;
  }

  ${FeatureCard}:hover & .icon-container {
    transform: rotate(0deg) scale(1.05);
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

// 新功能标记 - 完全重新设计，更加精美现代
const NewBadge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #0496ff, #5f2eea);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(95, 46, 234, 0.3), 0 0 0 2px rgba(255, 255, 255, 0.15);
  z-index: 10;
  transform: rotate(0deg);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border: 1.5px solid rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  
  /* 添加发光效果 */
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, #0496ff, #5f2eea);
    z-index: -2;
    filter: blur(6px);
    opacity: 0.5;
    border-radius: inherit;
  }
  
  /* 添加闪烁效果 */
  &::after {
    content: '';
    position: absolute;
    width: 5px;
    height: 5px;
    background: white;
    border-radius: 50%;
    top: 25%;
    right: 12%;
    animation: sparkle 2s infinite;
  }
  
  @keyframes sparkle {
    0%, 100% { opacity: 0.2; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.5); }
  }
  
  /* 脉动动画 */
  animation: float 3s ease-in-out infinite;
  
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-3px) rotate(0deg); }
  }
`;

interface HomeProps {
  onStartTarot: () => void;
  onStartDaily: () => void;
  onStartJojoMbti: () => void;
}

const Home: React.FC<HomeProps> = ({ onStartTarot, onStartDaily, onStartJojoMbti }) => {
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
              style={{ position: 'relative' }}
            >
              <NewBadge>New</NewBadge>
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
            </FeatureCard>
            
            {/* 更多功能（禁用） */}
            <DisabledCard
              gradientStart="108, 92, 231"
              gradientEnd="90, 77, 174"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={2}
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
            </DisabledCard>
          </RightContent>
        </ContentLayout>
      </MotionContainer>
    </AnimatePresence>
  );
};

export default Home; 