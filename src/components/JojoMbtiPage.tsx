import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { Button, Radio, Progress, Space, Divider, Badge, Typography, Card, message } from 'antd';
import { 
  ArrowLeftOutlined, 
  ArrowRightOutlined, 
  RetweetOutlined, 
  ShareAltOutlined,
  HistoryOutlined,
  DownloadOutlined,
  CopyOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import html2canvas from 'html2canvas';
import { QRCodeSVG } from 'qrcode.react';
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

// 添加移动端角色图片 - 进一步优化显示
const MobileCharacterImage = styled.div<{ backgroundImage: string; characterName: string }>`
  display: none; // 默认隐藏
  
  @media (max-width: 768px) {
    display: block;
    width: 100%;
    height: ${props => {
      // 针对特定角色调整高度
      switch(props.characterName) {
        case '天气预报':
        case '安波里欧':
        case '福·法特斯':
          return '320px'; // 为头部较小或位置较高的角色增加高度
        default:
          return '280px';
      }
    }};
    background-image: ${props => props.backgroundImage};
    background-size: cover;
    background-position: ${props => {
      // 针对特定角色调整背景位置
      switch(props.characterName) {
        case '天气预报': // 天气预报的头部可能在图片较上方
          return 'center 20%';
        case '安波里欧': // 小孩子角色身材矮小
          return 'center 15%';
        case '福·法特斯':
        case '透龙':
        case '田最环':
          return 'center 25%';
        case '空条承太郎':
        case '花京院典明':
        case '吉良吉影':
        case '迪奥·布兰度':
          return 'center 30%';
        case '布加拉提': // 布加拉提头部位置较高
          return 'center 35%';
        default:
          return 'center 25%'; // 默认值，进一步下移
      }
    }};
    margin-bottom: 1rem;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }
`;

// 添加分享卡片相关样式
const ShareCardWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.85);
  z-index: 1000;
  padding: 20px;
  overflow: auto;
`;

const ShareCardContent = styled.div`
  background: #1a1a2e;
  border-radius: 15px;
  padding: 1.5rem;
  width: 100%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 215, 0, 0.3);
  
  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 10px;
  }
`;

const ShareCardHeader = styled.div`
  text-align: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
  padding-bottom: 1rem;
`;

const ShareCardFooter = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 215, 0, 0.3);
`;

const QRCodeContainer = styled.div`
  margin-right: 1rem;
`;

const Watermark = styled.div`
  color: #a0a0a0;
  font-size: 12px;
`;

const ShareActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.8rem;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #a0a0a0;
  font-size: 20px;
  cursor: pointer;
  
  &:hover {
    color: white;
  }
`;

const JojoMbtiPage: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<MBTIDimension[]>([]);
  const [result, setResult] = useState<MBTITestResult | null>(null);
  const [isTestCompleted, setIsTestCompleted] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showShareCard, setShowShareCard] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  const shareCardRef = useRef<HTMLDivElement>(null);

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
      setShowShareCard(true);
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

  // 关闭分享卡片
  const handleCloseShareCard = () => {
    setShowShareCard(false);
  };

  // 保存分享图片
  const handleSaveImage = async () => {
    try {
      setIsSaving(true);
      
      if (!shareCardRef.current) {
        setIsSaving(false);
        message.error('无法获取分享内容');
        return;
      }

      // 使用html2canvas将DOM元素转为图片
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: '#1a1a2e',
        useCORS: true,
        logging: false,
        allowTaint: true,
        scale: 2 // 提高图片质量
      } as any);

      // 创建下载链接
      const link = document.createElement('a');
      const timestamp = new Date().getTime().toString().slice(-6);
      const fileName = `JOJO_MBTI_${result?.mbtiType || 'Result'}_${timestamp}.png`;
      
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
          message.success('MBTI结果图片已保存');
        }, 100);
      }, 'image/png', 0.95);
      
    } catch (error) {
      console.error('保存图片过程中出错:', error);
      message.error('生成图片时出错');
      setIsSaving(false);
    }
  };

  // 复制图片到剪贴板
  const handleCopyToClipboard = async () => {
    try {
      setIsSaving(true);
      
      if (!shareCardRef.current) {
        setIsSaving(false);
        message.error('无法获取分享内容');
        return;
      }

      // 使用html2canvas将DOM元素转为图片
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: '#1a1a2e',
        useCORS: true,
        logging: false,
        allowTaint: true,
        scale: 2 // 提高图片质量
      } as any);
      
      // 尝试使用现代方式复制到剪贴板
      try {
        // 转换为blob并创建ClipboardItem
        const blob = await new Promise<Blob | null>((resolve) => 
          canvas.toBlob(resolve, 'image/png', 1.0)
        );
        
        if (!blob) {
          throw new Error('无法创建图片');
        }
        
        // 创建ClipboardItem并写入剪贴板
        const data = [new ClipboardItem({ 'image/png': blob })];
        await navigator.clipboard.write(data);
        setIsSaving(false);
        message.success('MBTI结果图片已复制到剪贴板');
        return;
      } catch (clipboardError) {
        console.error('复制到剪贴板失败，尝试备用方法', clipboardError);
        
        // 备用方法：使用canvas.toDataURL创建图片
        const dataUrl = canvas.toDataURL('image/png');
        
        // 创建一个临时的<img>元素
        const img = document.createElement('img');
        img.src = dataUrl;
        
        // 创建一个临时div来容纳图片，并设置为可见但在屏幕外
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-9999px';
        container.appendChild(img);
        document.body.appendChild(container);
        
        // 创建选区并复制
        const range = document.createRange();
        range.selectNode(img);
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);
        
        const success = document.execCommand('copy');
        if (!success) {
          throw new Error('复制失败');
        }
        
        // 清理
        window.getSelection()?.removeAllRanges();
        document.body.removeChild(container);
        setIsSaving(false);
        message.success('MBTI结果图片已复制到剪贴板');
        return;
      }
    } catch (error) {
      console.error('复制图片失败:', error);
      message.error('复制图片失败，请尝试保存图片');
      setIsSaving(false);
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
              <MobileCharacterImage 
                backgroundImage={`url(${characterImagePath})`} 
                characterName={character.name}
              />
              
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

  // 渲染分享卡片
  const renderShareCard = () => {
    if (!result || !showShareCard) return null;
    
    const { character, mbtiType, description, dimensionScores } = result;
    const characterImagePath = `/images/jojo/${characterImageMap[character.name] || 'default'}.webp`;
    
    return (
      <ShareCardWrapper>
        <ShareCardContent ref={shareCardRef}>
          <CloseButton onClick={handleCloseShareCard}>×</CloseButton>
          
          <ShareCardHeader>
            <h2 style={{ color: '#ffd700', marginBottom: '8px', fontSize: '24px' }}>JOJO的奇妙冒险</h2>
            <div style={{ color: '#e0e0e0', fontSize: '18px' }}>MBTI 人格测试结果</div>
          </ShareCardHeader>
          
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '0.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <h3 style={{ color: '#ffd700', margin: '0', fontSize: '28px' }}>{mbtiType}</h3>
              <div style={{ color: '#b8b8b8' }}>{mbtiType.split('').join('-')}</div>
            </div>
            
            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>你最像的JOJO角色是</h4>
            <h3 style={{ color: '#ffd700', marginBottom: '0.5rem' }}>{character.name}</h3>
            
            <div style={{ width: '120px', height: '120px', margin: '0 auto 1rem', borderRadius: '8px', backgroundImage: `url(${characterImagePath})`, backgroundSize: 'cover', backgroundPosition: 'center 25%' }}></div>
            
            <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'left' }}>
              <div style={{ color: '#ffd700', marginBottom: '0.3rem' }}>替身：「{character.stand || '尚未觉醒'}」</div>
              <div style={{ color: '#b8b8b8', marginBottom: '0.3rem' }}>能力：{character.ability}</div>
              <div style={{ color: 'white', fontSize: '12px' }}>{character.description}</div>
              <div style={{ marginTop: '0.5rem' }}>
                <span style={{ background: '#6b6bff', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>第{character.part}部</span>
              </div>
            </div>
          </div>
          
          <div style={{ fontSize: '12px', color: 'white', marginBottom: '1rem', textAlign: 'left' }}>
            {description.length > 150 ? description.substring(0, 150) + '...' : description}
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '14px', color: 'white', marginBottom: '0.5rem', textAlign: 'left' }}>MBTI 维度:</div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '0.3rem' }}>
              <span style={{ color: '#b8b8b8' }}>内向 (I): {dimensionScores.I}</span>
              <span style={{ color: '#b8b8b8' }}>外向 (E): {dimensionScores.E}</span>
            </div>
            <Progress 
              percent={Math.round((dimensionScores.E / (dimensionScores.E + dimensionScores.I)) * 100)} 
              strokeColor="#6b6bff"
              size="small"
            />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '0.3rem', marginTop: '0.5rem' }}>
              <span style={{ color: '#b8b8b8' }}>实感 (S): {dimensionScores.S}</span>
              <span style={{ color: '#b8b8b8' }}>直觉 (N): {dimensionScores.N}</span>
            </div>
            <Progress 
              percent={Math.round((dimensionScores.N / (dimensionScores.N + dimensionScores.S)) * 100)} 
              strokeColor="#6b6bff"
              size="small"
            />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '0.3rem', marginTop: '0.5rem' }}>
              <span style={{ color: '#b8b8b8' }}>思考 (T): {dimensionScores.T}</span>
              <span style={{ color: '#b8b8b8' }}>情感 (F): {dimensionScores.F}</span>
            </div>
            <Progress 
              percent={Math.round((dimensionScores.F / (dimensionScores.F + dimensionScores.T)) * 100)} 
              strokeColor="#6b6bff"
              size="small"
            />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '0.3rem', marginTop: '0.5rem' }}>
              <span style={{ color: '#b8b8b8' }}>判断 (J): {dimensionScores.J}</span>
              <span style={{ color: '#b8b8b8' }}>认知 (P): {dimensionScores.P}</span>
            </div>
            <Progress 
              percent={Math.round((dimensionScores.P / (dimensionScores.P + dimensionScores.J)) * 100)} 
              strokeColor="#6b6bff"
              size="small"
            />
          </div>
          
          <ShareCardFooter>
            <QRCodeContainer>
              <QRCodeSVG 
                value={window.location.href}
                size={60}
                level="H"
              />
            </QRCodeContainer>
            <Watermark>
              二次元占卜屋 · JOJO MBTI测试
              <br />
              扫描二维码体验你的测试
            </Watermark>
          </ShareCardFooter>
        </ShareCardContent>
        
        <ShareActions>
          <StyledButton 
            icon={<DownloadOutlined />} 
            onClick={handleSaveImage}
            disabled={isSaving}
          >
            保存图片
          </StyledButton>
          <StyledButton 
            icon={<CopyOutlined />} 
            onClick={handleCopyToClipboard}
            disabled={isSaving}
          >
            复制图片
          </StyledButton>
          <StyledButton 
            icon={<ArrowLeftOutlined />} 
            onClick={handleCloseShareCard}
          >
            返回
          </StyledButton>
        </ShareActions>
      </ShareCardWrapper>
    );
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
      
      {renderShareCard()}
    </BackgroundContainer>
  );
};

export default JojoMbtiPage; 