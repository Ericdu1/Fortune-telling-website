import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Button, Radio, Progress, Space, Divider, Badge, Typography, Card } from 'antd';
import { 
  ArrowLeftOutlined, 
  ArrowRightOutlined, 
  RetweetOutlined, 
  ShareAltOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  mbtiQuestions, 
  calculateMBTIResult, 
  generateShareText,
  characterImageMap,
  saveTestResult,
  getLatestResult
} from '../utils/jojoMbti';
import { MBTIDimension, MBTITestResult } from '../types/mbti';

const { Title, Text, Paragraph } = Typography;

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  
  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const HeaderContent = styled.div`
  margin-bottom: 1rem;
`;

const MainTitle = styled(Title)`
  color: #ffd700 !important;
  margin-bottom: 0.5rem !important;
`;

const Subtitle = styled(Title)`
  color: white !important;
`;

const Description = styled(Text)`
  color: #b8b8b8;
  font-size: 1rem;
`;

const CardContainer = styled(Card)`
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 215, 0, 0.3) !important;
  border-radius: 15px !important;
  margin-bottom: 2rem;

  .ant-card-body {
    padding: 2rem;
    
    @media (max-width: 768px) {
      padding: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    border-radius: 10px !important;
  }
`;

const QuestionTitle = styled(Title)`
  color: white !important;
  margin-bottom: 1.5rem !important;
  
  @media (max-width: 768px) {
    font-size: 18px !important;
    margin-bottom: 1rem !important;
  }
`;

const RadioGroup = styled(Radio.Group)`
  width: 100%;
  
  .ant-radio-wrapper {
    color: white;
    margin-bottom: 1rem;
    display: block;
    
    &:hover {
      .ant-radio-inner {
        border-color: #ffd700;
      }
    }
    
    @media (max-width: 768px) {
      font-size: 14px;
      margin-bottom: 0.75rem;
    }
  }
  
  .ant-radio-checked .ant-radio-inner {
    border-color: #ffd700;
    background-color: #ffd700;
  }
`;

const ButtonContainer = styled.div<{ isMobileColumn?: boolean }>`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  width: 100%;
  
  @media (max-width: 480px) {
    margin-top: 1.5rem;
    flex-direction: ${props => props.isMobileColumn ? 'column' : 'row'};
    gap: ${props => props.isMobileColumn ? '10px' : '0'};
    
    button {
      width: ${props => props.isMobileColumn ? '100%' : 'auto'};
    }
  }
`;

const StyledButton = styled(Button)`
  background: ${props => props.type === 'primary' ? 'linear-gradient(45deg, #6b6bff, #8e8eff)' : 'rgba(255, 255, 255, 0.1)'};
  border: none;
  color: white;
  height: 40px;
  padding: 0 1.5rem;
  
  @media (max-width: 480px) {
    padding: 0 1rem;
    height: 36px;
    font-size: 13px;
  }
  
  &:hover {
    background: ${props => props.type === 'primary' ? 'linear-gradient(45deg, #5a5aff, #7d7dff)' : 'rgba(255, 255, 255, 0.2)'};
    color: white;
  }
  
  &:disabled {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.3);
  }
`;

const ResultContainer = styled.div`
  text-align: center;
`;

const MbtiBox = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 1rem;
  margin: 1rem 0 2rem;
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    margin: 0.75rem 0 1.5rem;
  }
`;

const MbtiType = styled(Title)`
  color: #ffd700 !important;
  margin: 0 !important;
  
  @media (max-width: 768px) {
    font-size: 24px !important;
  }
`;

const CharacterCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  margin: 2rem 0;
  text-align: center;
  border: 1px solid rgba(255, 215, 0, 0.3);
  
  @media (max-width: 768px) {
    padding: 1rem;
    margin: 1.5rem 0;
    border-radius: 10px;
  }
`;

const CharacterImage = styled.div<{ backgroundImage: string }>`
  width: 200px;
  height: 200px;
  margin: 0 auto 1.5rem;
  border-radius: 10px;
  background-image: ${props => props.backgroundImage};
  background-size: cover;
  background-position: center;
  position: relative;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 480px) {
    width: 150px;
    height: 150px;
    margin: 0 auto 1rem;
  }
`;

const PartBadge = styled(Badge)`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const StandInfo = styled.div`
  margin: 1.5rem 0;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
`;

const ProgressContainer = styled.div`
  margin: 2rem 0;
`;

// 增加历史记录按钮样式
const HistoryButton = styled(StyledButton)`
  margin-left: 10px;
`;

const HistoryButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

// 添加背景容器组件
const BackgroundContainer = styled(motion.div)`
  width: 100%;
  min-height: 100vh;
  padding: 2rem 1rem;
  background-image: linear-gradient(
    rgba(0, 0, 0, 0.8), 
    rgba(0, 0, 0, 0.8)
  ), url('/images/jojo/background.webp');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  
  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
    background-attachment: scroll;
  }
`;

// 添加角色背景页面容器 - 透明版
const PageWithCharacterBackground = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  /* 移除背景渐变，完全透明 */
  background: transparent; 
`;

// 结果内容卡片 - 为PC端优化 - 调整透明度和位置
const ResultContentCard = styled.div`
  background: rgba(30, 0, 45, 0.75); /* 稍微降低不透明度 */
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  width: 46%; /* 略微缩小宽度 */
  max-width: 560px;
  margin-left: 5%; /* 增加左侧边距，让整体更居中 */
  border: 1px solid rgba(255, 215, 0, 0.3);
  position: relative;
  z-index: 1;
  align-self: center;
  
  @media (max-width: 768px) {
    display: none; // 移动端不显示此卡片
  }
`;

// 角色图片样式 - 调整位置
const CharacterImg = styled.img`
  position: absolute;
  right: 5%; /* 增加右侧边距 */
  top: 50%;
  transform: translateY(-50%);
  max-height: 90vh;
  max-width: 44%; /* 稍微缩小图片宽度 */
  z-index: 0;
  opacity: 0.9; /* 增加不透明度以便在透明背景上更加突出 */
  pointer-events: none;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5)); /* 添加阴影增强可见度 */
  
  @media (max-width: 768px) {
    display: none;
  }
`;

// 卡片式设计 - 为移动端优化
const MobileResultCard = styled(CardContainer)`
  @media (min-width: 769px) {
    display: none; // 在PC端不显示
  }
`;

// 添加结果页面的新组件
const ResultPageWrapper = styled.div<{ characterImage: string }>`
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  background-color: rgba(40, 0, 60, 0.6);
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url(${props => props.characterImage});
    background-size: cover;
    background-position: center 15%; // 调整背景图像位置，确保头部可见
    opacity: 0.4;
    filter: blur(2px);
    z-index: 0;
  }
  
  @media (max-width: 768px) {
    &:before {
      background-position: center 15%; // 移动端也调整为向上移动焦点
    }
  }
`;

const ResultLayout = styled.div`
  display: flex;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ResultLeftColumn = styled.div`
  flex: 1;
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ResultRightColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    padding: 0 1rem 1rem;
  }
`;

// 添加移动端角色图片 - 新增
const MobileCharacterImage = styled.div<{ backgroundImage: string }>`
  display: none; // 默认隐藏
  
  @media (max-width: 768px) {
    display: block;
    width: 100%;
    height: 280px; // 增加高度以显示更多内容
    background-image: ${props => props.backgroundImage};
    background-size: cover;
    background-position: center 10%; // 向上移动焦点，确保头部可见
    margin-bottom: 1rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }
`;

const JojoMbtiPage: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<MBTIDimension[]>([]);
  const [result, setResult] = useState<MBTITestResult | null>(null);
  const [isTestCompleted, setIsTestCompleted] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // 检查是否有历史记录
  useEffect(() => {
    const latestResult = getLatestResult();
    if (latestResult && !result) {
      // 显示"继续上次测试"或"查看历史结果"按钮
      setShowHistory(true);
    }
  }, [result]);

  // 当前进度
  const progress = Math.floor((currentQuestionIndex / mbtiQuestions.length) * 100);
  
  // 当前问题
  const currentQuestion = mbtiQuestions[currentQuestionIndex];
  
  // 处理答案选择
  const handleAnswerSelect = (e: any) => {
    const value = e.target.value as MBTIDimension;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = value;
    setSelectedAnswers(newAnswers);
  };
  
  // 处理下一个问题
  const handleNextQuestion = () => {
    if (currentQuestionIndex < mbtiQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 完成测试，计算结果
      const testResult = calculateMBTIResult(selectedAnswers);
      // 保存结果到本地存储
      saveTestResult(testResult);
      setResult(testResult);
      setIsTestCompleted(true);
    }
  };
  
  // 处理上一个问题
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // 重新开始测试
  const handleRestartTest = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setResult(null);
    setIsTestCompleted(false);
  };
  
  // 分享结果
  const handleShareResult = () => {
    if (result) {
      // 复制到剪贴板
      navigator.clipboard.writeText(generateShareText(result))
        .then(() => {
          alert('已复制分享文本到剪贴板');
        })
        .catch(err => {
          console.error('复制失败:', err);
        });
    }
  };

  // 查看历史结果
  const handleViewHistory = () => {
    const latestResult = getLatestResult();
    if (latestResult) {
      setResult(latestResult);
      setIsTestCompleted(true);
    }
  };

  // 渲染问题页面
  const renderQuestion = () => (
    <CardContainer>
      <Progress percent={progress} status="active" strokeColor="#ffd700" />
      
      <QuestionTitle level={4}>
        问题 {currentQuestionIndex + 1}/{mbtiQuestions.length}: {currentQuestion.text}
      </QuestionTitle>
      
      <RadioGroup onChange={handleAnswerSelect} value={selectedAnswers[currentQuestionIndex]}>
        <Space direction="vertical" style={{ width: '100%' }}>
          {currentQuestion.options.map((option, index) => (
            <Radio key={index} value={option.value}>
              {option.text}
            </Radio>
          ))}
        </Space>
      </RadioGroup>
      
      <ButtonContainer isMobileColumn={false}>
        <StyledButton 
          icon={<ArrowLeftOutlined />} 
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          上一题
        </StyledButton>
        <StyledButton 
          type="primary"
          icon={currentQuestionIndex === mbtiQuestions.length - 1 ? null : <ArrowRightOutlined />}
          disabled={!selectedAnswers[currentQuestionIndex]}
          onClick={handleNextQuestion}
        >
          {currentQuestionIndex === mbtiQuestions.length - 1 ? '查看结果' : '下一题'}
        </StyledButton>
      </ButtonContainer>
    </CardContainer>
  );
  
  // 渲染结果页面
  const renderResult = () => {
    if (!result) return null;
    
    const { character, mbtiType, description, dimensionScores } = result;
    const characterImagePath = `/images/jojo/${characterImageMap[character.name] || 'default'}.webp`;
    
    // PC端结果页面
    const renderPCResult = () => (
      <ResultContentCard>
        <Title level={3} style={{ color: 'white' }}>测试结果</Title>
        
        <MbtiBox>
          <MbtiType level={2}>{mbtiType}</MbtiType>
          <Text style={{ color: '#b8b8b8' }}>{mbtiType.split('').join('-')}</Text>
        </MbtiBox>
        
        <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
          <Title level={4} style={{ color: 'white', marginBottom: '0.5rem' }}>你最像的JOJO角色是</Title>
          <Title level={2} style={{ color: '#ffd700' }}>
            {character.name}
          </Title>
        </div>
        
        <StandInfo style={{ marginBottom: '1.5rem' }}>
          <Title level={5} style={{ color: '#ffd700', margin: 0 }}>
            替身：「{character.stand || '尚未觉醒'}」
          </Title>
          <Text style={{ color: '#b8b8b8' }}>
            能力：{character.ability}
          </Text>
          <Paragraph style={{ color: 'white', marginTop: '0.5rem' }}>
            {character.description}
          </Paragraph>
          <Badge 
            count={`第${character.part}部`} 
            style={{ 
              backgroundColor: '#6b6bff',
              color: 'white'
            }} 
          />
        </StandInfo>
        
        <Paragraph style={{ color: 'white', textAlign: 'left' }}>
          {description}
        </Paragraph>
        
        <ProgressContainer>
          <Title level={5} style={{ color: 'white', textAlign: 'left' }}>MBTI 维度得分</Title>
          
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text style={{ color: '#b8b8b8' }}>内向 (I): {dimensionScores.I}</Text>
              <Text style={{ color: '#b8b8b8' }}>外向 (E): {dimensionScores.E}</Text>
            </div>
            <Progress 
              percent={Math.round((dimensionScores.E / (dimensionScores.E + dimensionScores.I)) * 100)} 
              strokeColor={dimensionScores.E > dimensionScores.I ? "#6b6bff" : "#ff6b6b"}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text style={{ color: '#b8b8b8' }}>实感 (S): {dimensionScores.S}</Text>
              <Text style={{ color: '#b8b8b8' }}>直觉 (N): {dimensionScores.N}</Text>
            </div>
            <Progress 
              percent={Math.round((dimensionScores.N / (dimensionScores.N + dimensionScores.S)) * 100)} 
              strokeColor={dimensionScores.N > dimensionScores.S ? "#6b6bff" : "#ff6b6b"}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text style={{ color: '#b8b8b8' }}>思考 (T): {dimensionScores.T}</Text>
              <Text style={{ color: '#b8b8b8' }}>情感 (F): {dimensionScores.F}</Text>
            </div>
            <Progress 
              percent={Math.round((dimensionScores.F / (dimensionScores.F + dimensionScores.T)) * 100)} 
              strokeColor={dimensionScores.F > dimensionScores.T ? "#6b6bff" : "#ff6b6b"}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text style={{ color: '#b8b8b8' }}>判断 (J): {dimensionScores.J}</Text>
              <Text style={{ color: '#b8b8b8' }}>认知 (P): {dimensionScores.P}</Text>
            </div>
            <Progress 
              percent={Math.round((dimensionScores.P / (dimensionScores.P + dimensionScores.J)) * 100)} 
              strokeColor={dimensionScores.P > dimensionScores.J ? "#6b6bff" : "#ff6b6b"}
            />
          </div>
        </ProgressContainer>
        
        <ButtonContainer isMobileColumn={false}>
          <StyledButton 
            icon={<RetweetOutlined />} 
            onClick={handleRestartTest}
          >
            重新测试
          </StyledButton>
          <StyledButton 
            type="primary"
            icon={<ShareAltOutlined />} 
            onClick={handleShareResult}
          >
            分享结果
          </StyledButton>
        </ButtonContainer>
      </ResultContentCard>
    );
    
    // 移动端结果页面 - 保持原有卡片式设计但添加角色图片
    const renderMobileResult = () => (
      <MobileResultCard>
        <ResultPageWrapper characterImage={characterImagePath}>
          <ResultLayout>
            {/* 左侧信息栏 */}
            <ResultLeftColumn>
              <Title level={3} style={{ color: 'white' }}>测试结果</Title>
              
              <MbtiBox>
                <MbtiType level={2}>{mbtiType}</MbtiType>
                <Text style={{ color: '#b8b8b8' }}>{mbtiType.split('').join('-')}</Text>
              </MbtiBox>
              
              {/* 添加单独的移动端角色图片显示 */}
              <MobileCharacterImage backgroundImage={`url(${characterImagePath})`} />
              
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <Title level={4} style={{ color: 'white', marginBottom: '0.5rem' }}>你最像的JOJO角色是</Title>
                <Title level={2} style={{ color: '#ffd700' }}>
                  {character.name}
                </Title>
              </div>
              
              <StandInfo style={{ width: '100%', maxWidth: '100%', marginBottom: '1.5rem' }}>
                <Title level={5} style={{ color: '#ffd700', margin: 0 }}>
                  替身：「{character.stand || '尚未觉醒'}」
                </Title>
                <Text style={{ color: '#b8b8b8' }}>
                  能力：{character.ability}
                </Text>
                <Paragraph style={{ color: 'white', marginTop: '0.5rem' }}>
                  {character.description}
                </Paragraph>
                <Badge 
                  count={`第${character.part}部`} 
                  style={{ 
                    backgroundColor: '#6b6bff',
                    color: 'white'
                  }} 
                />
              </StandInfo>
              
              <Paragraph style={{ color: 'white', textAlign: 'left' }}>
                {description}
              </Paragraph>
              
              <ProgressContainer>
                <Title level={5} style={{ color: 'white', textAlign: 'left' }}>MBTI 维度得分</Title>
                
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#b8b8b8' }}>内向 (I): {dimensionScores.I}</Text>
                    <Text style={{ color: '#b8b8b8' }}>外向 (E): {dimensionScores.E}</Text>
                  </div>
                  <Progress 
                    percent={Math.round((dimensionScores.E / (dimensionScores.E + dimensionScores.I)) * 100)} 
                    strokeColor={dimensionScores.E > dimensionScores.I ? "#6b6bff" : "#ff6b6b"}
                  />
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#b8b8b8' }}>实感 (S): {dimensionScores.S}</Text>
                    <Text style={{ color: '#b8b8b8' }}>直觉 (N): {dimensionScores.N}</Text>
                  </div>
                  <Progress 
                    percent={Math.round((dimensionScores.N / (dimensionScores.N + dimensionScores.S)) * 100)} 
                    strokeColor={dimensionScores.N > dimensionScores.S ? "#6b6bff" : "#ff6b6b"}
                  />
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#b8b8b8' }}>思考 (T): {dimensionScores.T}</Text>
                    <Text style={{ color: '#b8b8b8' }}>情感 (F): {dimensionScores.F}</Text>
                  </div>
                  <Progress 
                    percent={Math.round((dimensionScores.F / (dimensionScores.F + dimensionScores.T)) * 100)} 
                    strokeColor={dimensionScores.F > dimensionScores.T ? "#6b6bff" : "#ff6b6b"}
                  />
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#b8b8b8' }}>判断 (J): {dimensionScores.J}</Text>
                    <Text style={{ color: '#b8b8b8' }}>认知 (P): {dimensionScores.P}</Text>
                  </div>
                  <Progress 
                    percent={Math.round((dimensionScores.P / (dimensionScores.P + dimensionScores.J)) * 100)} 
                    strokeColor={dimensionScores.P > dimensionScores.J ? "#6b6bff" : "#ff6b6b"}
                  />
                </div>
              </ProgressContainer>
              
              <ButtonContainer isMobileColumn={true}>
                <StyledButton 
                  icon={<RetweetOutlined />} 
                  onClick={handleRestartTest}
                  style={{ marginBottom: '10px' }}
                >
                  重新测试
                </StyledButton>
                <StyledButton 
                  type="primary"
                  icon={<ShareAltOutlined />} 
                  onClick={handleShareResult}
                >
                  分享结果
                </StyledButton>
              </ButtonContainer>
            </ResultLeftColumn>
          </ResultLayout>
        </ResultPageWrapper>
      </MobileResultCard>
    );
    
    return (
      <PageWithCharacterBackground>
        <CharacterImg src={characterImagePath} alt={character.name} />
        {renderPCResult()}
        {renderMobileResult()}
      </PageWithCharacterBackground>
    );
  };

  // 查看历史记录按钮
  const renderHistoryButton = () => {
    if (showHistory && !isTestCompleted) {
      return (
        <HistoryButton 
          icon={<HistoryOutlined />} 
          onClick={handleViewHistory}
        >
          查看上次结果
        </HistoryButton>
      );
    }
    return null;
  };

  return (
    <BackgroundContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#000000" />
        <title>JOJO的奇妙冒险 MBTI测试</title>
      </Helmet>
      
      <Container>
        <Header>
          <HeaderContent>
            <MainTitle level={1}>JOJO的奇妙冒险</MainTitle>
            <Subtitle level={2}>MBTI 人格测试</Subtitle>
            <Description>测试你是JOJO中的哪个角色，你的替身是什么？</Description>
          </HeaderContent>
          
          <HistoryButtonContainer>
            {renderHistoryButton()}
          </HistoryButtonContainer>
        </Header>
        
        {!isTestCompleted ? renderQuestion() : renderResult()}
      </Container>
    </BackgroundContainer>
  );
};

export default JojoMbtiPage; 