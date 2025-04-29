import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { Typography, Badge, Carousel, Avatar, Tooltip } from 'antd';
import { 
  CalendarOutlined, 
  ProjectOutlined, 
  ExperimentOutlined, 
  RobotOutlined,
  HistoryOutlined,
  UserOutlined,
  FireOutlined,
  ThunderboltOutlined,
  StarOutlined,
  NotificationOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

// 主容器
const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

// 页面标题
const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
`;

// 标题样式
const StyledTitle = styled(Title)`
  margin: 0 !important;
  background: linear-gradient(to right, #ffd700, #ff9500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 15px rgba(255, 215, 0, 0.3);
  font-weight: 800 !important;
  letter-spacing: -0.5px;
`;

// 副标题样式
const StyledSubtitle = styled(Text)`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin-top: 0.5rem;
`;

// 首页Banner
const HomeBanner = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    height: 150px;
  }
`;

// 自定义轮播图组件
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

// Banner内容
const BannerContent = styled.div<{ bgImage: string }>`
  height: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url(${props => props.bgImage});
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
  
  h3 {
    color: white;
    font-size: 1.6rem;
    margin: 0;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  p {
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
  }
`;

// 功能区栏目标题
const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0 0.5rem;
`;

// 栏目标题
const SectionTitle = styled.h2`
  color: white;
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// 更多链接
const ViewMore = styled.a`
  color: rgba(255, 215, 0, 0.8);
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: #ffd700;
    text-decoration: underline;
  }
`;

// 功能卡片网格布局
const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

// 特色功能卡片
const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
    z-index: 0;
  }
  
  &:hover {
    border-color: rgba(255, 215, 0, 0.3);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  }
`;

// 卡片图标容器
const CardIconWrapper = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-size: 1.8rem;
  position: relative;
  z-index: 1;
`;

// 每日运势图标背景
const FortuneIconBg = styled(CardIconWrapper)`
  background: linear-gradient(135deg, #ffa502, #ff6b6b);
  color: white;
`;

// MBTI测试图标背景
const MbtiIconBg = styled(CardIconWrapper)`
  background: linear-gradient(135deg, #1e90ff, #70a1ff);
  color: white;
`;

// 塔罗牌图标背景
const TarotIconBg = styled(CardIconWrapper)`
  background: linear-gradient(135deg, #9c88ff, #8c7ae6);
  color: white;
`;

// AI解梦图标背景
const DreamIconBg = styled(CardIconWrapper)`
  background: linear-gradient(135deg, #44bd32, #4cd137);
  color: white;
`;

// 卡片标题
const CardTitle = styled.h3`
  font-size: 1.2rem;
  color: white;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  position: relative;
  z-index: 1;
`;

// 卡片描述
const CardDescription = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  position: relative;
  z-index: 1;
  flex-grow: 1;
`;

// 卡片底部
const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  position: relative;
  z-index: 1;
`;

// 使用次数
const UsageCount = styled.span`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
`;

// 热门标签
const HotTag = styled.div`
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  background: rgba(255, 107, 107, 0.25);
  color: #ff6b6b;
  font-size: 0.8rem;
  font-weight: 500;
  gap: 0.25rem;
`;

// 新功能标签
const NewTag = styled.div`
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  background: rgba(30, 144, 255, 0.25);
  color: #1e90ff;
  font-size: 0.8rem;
  font-weight: 500;
  gap: 0.25rem;
`;

// 推荐功能区
const RecommendedSection = styled.div`
  margin-top: 2rem;
`;

// 推荐功能卡片
const RecommendedCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(30, 144, 255, 0.15) 0%, rgba(156, 136, 255, 0.15) 100%);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(156, 136, 255, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  
  &:hover {
    border-color: rgba(156, 136, 255, 0.5);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  }
`;

// 推荐功能图标
const RecommendedIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 15px;
  background: linear-gradient(135deg, #9c88ff, #8c7ae6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
`;

// 推荐功能内容
const RecommendedContent = styled.div`
  flex: 1;
`;

// 推荐功能标题
const RecommendedTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: white;
  margin: 0 0 0.5rem 0;
`;

// 推荐功能描述
const RecommendedDesc = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
`;

// 用户操作区
const UserActionsSection = styled.div`
  margin-top: 2rem;
`;

// 用户信息卡片
const UserInfoCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1.5rem;
`;

// 用户头像
const UserAvatar = styled(Avatar)`
  flex-shrink: 0;
`;

// 用户信息
const UserInfo = styled.div`
  flex: 1;
`;

// 用户名
const Username = styled.h3`
  color: white;
  font-size: 1.2rem;
  margin: 0 0 0.25rem 0;
  font-weight: 600;
`;

// 用户邮箱
const UserEmail = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  margin: 0;
`;

// 用户操作按钮组
const UserActions = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

// 操作按钮
const ActionButton = styled(motion.button)`
  flex: 1;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

// 卡片动画配置
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 * i,
      duration: 0.5,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  })
};

interface HomeProps {
  onStartFortune: () => void;
  onStartMBTI: () => void;
  onStartTarot: () => void;
  onStartAI: () => void;
  onViewHistory: () => void;
  onViewProfile: () => void;
  isLoggedIn: boolean;
  username: string;
  email: string;
}

const HomePage: React.FC<HomeProps> = ({
  onStartFortune,
  onStartMBTI,
  onStartTarot,
  onStartAI,
  onViewHistory,
  onViewProfile,
  isLoggedIn,
  username,
  email
}) => {
  // 模拟一个推荐功能的状态
  const [recommended] = useState({
    title: 'JOJO MBTI测试',
    description: '测试你是JOJO中的哪个角色，并发现你的替身能力',
    icon: <ExperimentOutlined />,
    onStart: onStartMBTI
  });

  // Banner数据
  const banners = [
    {
      title: '每日星座运势',
      description: '新的一天，为你揭示神秘的星座力量',
      image: '/images/banners/fortune-banner.jpg',
      onClick: onStartFortune
    },
    {
      title: '塔罗牌占卜',
      description: '解读塔罗牌的神秘信息，指引未来方向',
      image: '/images/banners/tarot-banner.jpg',
      onClick: onStartTarot
    },
    {
      title: 'JOJO MBTI性格测试',
      description: '发现你在JOJO奇妙冒险中的角色替身',
      image: '/images/banners/jojo-banner.jpg',
      onClick: onStartMBTI
    }
  ];

  return (
    <Container className="fortune-container">
      <PageHeader>
        <StyledTitle level={1}>二次元占卜屋</StyledTitle>
        <StyledSubtitle>
          {isLoggedIn ? `欢迎回来，${username}` : '探索你的命运，揭示生活的奥秘'}
        </StyledSubtitle>
      </PageHeader>

      {/* 轮播Banner */}
      <HomeBanner>
        <StyledCarousel autoplay effect="fade">
          {banners.map((banner, index) => (
            <div key={index} onClick={banner.onClick}>
              <BannerContent bgImage={banner.image}>
                <h3>{banner.title}</h3>
                <p>{banner.description}</p>
              </BannerContent>
            </div>
          ))}
        </StyledCarousel>
      </HomeBanner>

      {/* 主要功能区域 */}
      <section>
        <SectionHeader>
          <SectionTitle>
            <ThunderboltOutlined style={{ color: '#ffd700' }} /> 核心功能
          </SectionTitle>
          <ViewMore href="#">查看全部</ViewMore>
        </SectionHeader>

        <FeaturesGrid>
          <FeatureCard 
            onClick={onStartFortune}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={0}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <FortuneIconBg>
              <CalendarOutlined />
            </FortuneIconBg>
            <CardTitle>每日运势</CardTitle>
            <CardDescription>
              查看今日运势，掌握好运密码，每天更新
            </CardDescription>
            <CardFooter>
              <UsageCount>今日已有 2,451 人使用</UsageCount>
              <HotTag><FireOutlined /> 热门</HotTag>
            </CardFooter>
          </FeatureCard>

          <FeatureCard 
            onClick={onStartMBTI}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={1}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <MbtiIconBg>
              <ProjectOutlined />
            </MbtiIconBg>
            <CardTitle>MBTI测试</CardTitle>
            <CardDescription>
              发现你的性格类型，了解真实的自己，获取个性化分析
            </CardDescription>
            <CardFooter>
              <UsageCount>共有 15,723 人完成测试</UsageCount>
              <NewTag><ThunderboltOutlined /> 新功能</NewTag>
            </CardFooter>
          </FeatureCard>

          <FeatureCard 
            onClick={onStartTarot}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={2}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <TarotIconBg>
              <StarOutlined />
            </TarotIconBg>
            <CardTitle>塔罗牌占卜</CardTitle>
            <CardDescription>
              解读塔罗牌的神秘信息，指引未来方向，探索潜在可能
            </CardDescription>
            <CardFooter>
              <UsageCount>今日已有 1,892 人使用</UsageCount>
              <HotTag><FireOutlined /> 热门</HotTag>
            </CardFooter>
          </FeatureCard>

          <FeatureCard 
            onClick={onStartAI}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={3}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <DreamIconBg>
              <RobotOutlined />
            </DreamIconBg>
            <CardTitle>AI解梦</CardTitle>
            <CardDescription>
              智能分析梦境含义，探索潜意识信息，获取心理洞察
            </CardDescription>
            <CardFooter>
              <UsageCount>共有 8,574 人使用</UsageCount>
              <Badge count="AI" style={{ backgroundColor: '#52c41a' }} />
            </CardFooter>
          </FeatureCard>
        </FeaturesGrid>
      </section>

      {/* 推荐功能区域 */}
      <RecommendedSection>
        <SectionHeader>
          <SectionTitle>
            <NotificationOutlined style={{ color: '#9c88ff' }} /> 特别推荐
          </SectionTitle>
        </SectionHeader>

        <RecommendedCard
          onClick={recommended.onStart}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <RecommendedIcon>
            {recommended.icon}
          </RecommendedIcon>
          <RecommendedContent>
            <RecommendedTitle>{recommended.title}</RecommendedTitle>
            <RecommendedDesc>{recommended.description}</RecommendedDesc>
          </RecommendedContent>
          <Badge count="NEW" style={{ backgroundColor: '#1e90ff' }} />
        </RecommendedCard>
      </RecommendedSection>

      {/* 用户功能区域 - 仅登录用户可见 */}
      {isLoggedIn && (
        <UserActionsSection>
          <SectionHeader>
            <SectionTitle>
              <UserOutlined style={{ color: '#70a1ff' }} /> 个人中心
            </SectionTitle>
          </SectionHeader>

          <UserInfoCard>
            <UserAvatar size={64} src={`https://api.dicebear.com/7.x/micah/svg?seed=${username}`} />
            <UserInfo>
              <Username>{username}</Username>
              <UserEmail>{email}</UserEmail>
            </UserInfo>
          </UserInfoCard>

          <UserActions>
            <ActionButton 
              onClick={onViewHistory}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <HistoryOutlined /> 查看历史记录
            </ActionButton>
            <ActionButton 
              onClick={onViewProfile}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <UserOutlined /> 个人资料设置
            </ActionButton>
          </UserActions>
        </UserActionsSection>
      )}
    </Container>
  );
};

export default HomePage; 