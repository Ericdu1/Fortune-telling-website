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
  }
`;

const QuestionTitle = styled(Title)`
  color: white !important;
  margin-bottom: 1.5rem !important;
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
  }
  
  .ant-radio-checked .ant-radio-inner {
    border-color: #ffd700;
    background-color: #ffd700;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const StyledButton = styled(Button)`
  background: ${props => props.type === 'primary' ? 'linear-gradient(45deg, #6b6bff, #8e8eff)' : 'rgba(255, 255, 255, 0.1)'};
  border: none;
  color: white;
  height: 40px;
  padding: 0 1.5rem;
  
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
`;

const MbtiType = styled(Title)`
  color: #ffd700 !important;
  margin: 0 !important;
`;

const CharacterCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  margin: 2rem 0;
  text-align: center;
  border: 1px solid rgba(255, 215, 0, 0.3);
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
      
      <ButtonContainer>
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
    
    return (
      <CardContainer>
        <ResultContainer>
          <Title level={3} style={{ color: 'white' }}>测试结果</Title>
          
          <MbtiBox>
            <MbtiType level={2}>{mbtiType}</MbtiType>
            <Text style={{ color: '#b8b8b8' }}>{mbtiType.split('').join('-')}</Text>
          </MbtiBox>
          
          <Divider style={{ background: 'rgba(255,255,255,0.1)' }} />
          
          <Title level={4} style={{ color: 'white' }}>你最像的JOJO角色是</Title>
          
          <CharacterCard>
            <CharacterImage 
              backgroundImage={`url(${character.imageUrl || 
                `/images/jojo/${characterImageMap[character.name] || 'default'}.webp`})`}
            >
              <PartBadge 
                count={`第${character.part}部`} 
                style={{ 
                  backgroundColor: '#6b6bff',
                  color: 'white'
                }} 
              />
            </CharacterImage>
            
            <Title level={3} style={{ color: '#ffd700', margin: '1rem 0' }}>
              {character.name}
            </Title>
            
            <Paragraph style={{ color: 'white' }}>
              {character.description}
            </Paragraph>
            
            <StandInfo>
              <Title level={5} style={{ color: '#ffd700', margin: 0 }}>
                替身：「{character.stand || '尚未觉醒'}」
              </Title>
              <Text style={{ color: '#b8b8b8' }}>
                能力：{character.ability}
              </Text>
            </StandInfo>
          </CharacterCard>
          
          <Paragraph style={{ color: 'white', textAlign: 'left' }}>
            {description}
          </Paragraph>
          
          <Divider style={{ background: 'rgba(255,255,255,0.1)' }} />
          
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
          
          <ButtonContainer>
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
        </ResultContainer>
      </CardContainer>
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