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
  gap: 1rem;
  
  @media (max-width: 480px) {
    margin-top: 1.5rem;
    flex-direction: ${props => props.isMobileColumn ? 'column' : 'row'};
    gap: ${props => props.isMobileColumn ? '10px' : '1rem'};
    
    button {
      width: ${props => props.isMobileColumn ? '100%' : 'auto'};
      min-width: ${props => props.isMobileColumn ? 'auto' : '110px'};
    }
  }
`;

const StyledButton = styled(Button)`
  background: ${props => props.type === 'primary' ? 'linear-gradient(45deg, #6b6bff, #8e8eff)' : 'rgba(255, 255, 255, 0.1)'};
  border: none;
  color: white;
  height: 40px;
  padding: 0 1.5rem;
  min-width: 120px;
  
  @media (max-width: 480px) {
    padding: 0 1rem;
    height: 36px;
    font-size: 13px;
    min-width: 100px;
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

// 修改PC端角色图片容器样式
const PCCharacterContainer = styled.div`
  position: absolute;
  right: 0; /* 保持右对齐 */
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 85vh; /* 增加高度，确保足够显示高角色 */
  width: 65%; /* 减小宽度从100%到65%，避免过度占用空间 */
  max-width: 1000px; /* 略微减小最大宽度 */
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end; /* 改为右对齐 */
  padding-right: 5%; /* 添加右侧内边距 */
  overflow: hidden; /* 防止内容溢出 */
  
  @media (max-width: 768px) {
    display: none;
  }
`;

// 修改PC端角色图片样式，基础样式
const PCCharacterImg = styled.img`
  width: auto;
  height: auto;
  max-height: 80vh; /* 保持最大高度 */
  max-width: 90%; /* 略微增加最大宽度比例 */
  object-fit: contain;
  object-position: center right; /* 调整为右对齐 */
  opacity: 0.95;
  pointer-events: none;
  filter: drop-shadow(0 0 15px rgba(0, 0, 0, 0.6));
`;

// 为特殊角色(田最环)创建专用样式
const TamakiDamoImg = styled(PCCharacterImg)`
  max-width: 75%; /* 特殊处理较宽的角色图片 */
  margin-right: 5%; /* 额外的右侧边距 */
`;

// 为乔纳森专门创建一个放大版的图片样式
const JonathanImg = styled(PCCharacterImg)`
  height: 85vh !important; /* 固定高度为视口高度的85% */
  max-height: 85vh !important;
  width: auto !important;
  object-fit: contain;
`;

// 移动端专用角色图片样式
const CharacterImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain; // 改用contain而非cover
  object-position: center center; // 居中显示
`;

// 卡片式设计 - 为移动端优化
const MobileResultCard = styled(CardContainer)`
  @media (min-width: 769px) {
    display: none; // 在PC端不显示
  }
  
  .ant-card-body {
    padding: 1.5rem;
  }
`;

// 修改PC端结果内容卡片位置，适应角色图片容器变宽
const ResultContentCard = styled.div`
  background: rgba(30, 0, 45, 0.75); /* 稍微降低不透明度 */
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 2rem;
  width: 42%; /* 增加宽度从35%到42% */
  max-width: 520px; /* 增加最大宽度 */
  margin-left: 3%; /* 保持左侧边距 */
  border: 1px solid rgba(255, 215, 0, 0.3);
  position: relative;
  z-index: 2; /* 确保内容卡片在图片上方 */
  align-self: center;
  
  @media (max-width: 768px) {
    display: none; // 移动端不显示此卡片
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

// 添加移动端角色图片 - 使用统一尺寸的图片容器
const MobileCharacterImage = styled.div`
  display: none; // 默认隐藏
  
  @media (max-width: 768px) {
    display: block;
    width: 100%;
    height: 300px; // 增加高度
    margin-bottom: 1rem;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.3);
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    position: relative;
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
  flex-direction: column;
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
  margin-bottom: 1rem;
  
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
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 215, 0, 0.3);
  
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

// 调整分享内容样式，添加固定宽度和最小高度
const ShareContent = styled.div`
  width: 100%;
  max-width: 450px;
  min-height: 850px; // 添加最小高度确保足够显示内容
  background: #1a1a2e;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 0 auto;
  box-sizing: border-box;
`;

// 改进角色图片容器样式，使用更适合的比例
const CharacterImageContainer = styled.div`
  width: 120px;
  height: 240px; // 增加高度，提供更好的显示空间
  margin: 0 auto 1rem;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.2);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 添加专门的图片样式组件，确保比例正确
const ShareCharacterImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
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
  const shareContentRef = useRef<HTMLDivElement>(null);
  
  // 布加拉提图片尺寸引用
  const bucciaratiDimensions = useRef({
    height: 0,
    width: 0,
    loaded: false
  });

  // 预加载布加拉提图片以获取其尺寸
  useEffect(() => {
    if (result && !bucciaratiDimensions.current.loaded) {
      const bucciaratiImagePath = `/images/jojo/${characterImageMap['布加拉提'] || 'Buccellati'}.webp`;
      const img = new Image();
      img.onload = () => {
        bucciaratiDimensions.current = {
          height: img.naturalHeight,
          width: img.naturalWidth,
          loaded: true
        };
        console.log('布加拉提图片尺寸加载完成:', bucciaratiDimensions.current);
      };
      img.src = bucciaratiImagePath;
    }
  }, [result]);

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

  // 增强的图片加载处理函数
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>, characterName: string) => {
    const img = e.currentTarget;
    const imgHeight = img.naturalHeight;
    const imgWidth = img.naturalWidth;
    
    // 默认缩放系数
    let scale = 1;
    
    // 如果布加拉提图片已加载，则使用其高度作为参考
    if (bucciaratiDimensions.current.loaded) {
      // 缩放系数 = 布加拉提高度 / 当前图片高度
      scale = bucciaratiDimensions.current.height / imgHeight;
      
      // 对于特别宽的图片进行额外处理
      if ((imgWidth / imgHeight) > 1.2) {
        scale *= 0.85; // 略微缩小过宽的图片
      }
      
      // 对于特别窄的图片进行额外处理
      if ((imgHeight / imgWidth) > 2) {
        scale *= 0.9; // 略微缩小过窄的图片
      }
      
      // 特殊角色调整
      if (characterName === '乔纳森·乔斯达') {
        scale *= 2.0; // 为乔纳森特别增加尺寸
        console.log('乔纳森特别调整，缩放系数加倍');
      } else if (characterName === '吉良吉影' || characterName === '岸边露伴') {
        scale *= 1.1; // 放大10%
      } else if (characterName === '迪奥·布兰度' || characterName === '乔鲁诺·乔巴拿') {
        scale *= 1.15; // 放大15%
      }
      
      // 应用计算后的缩放
      img.style.height = `${imgHeight * scale}px`;
      img.style.width = `${imgWidth * scale}px`;
      
      // 控制台输出调试信息
      console.log(`角色: ${characterName}, 原始尺寸: ${imgWidth}x${imgHeight}, 缩放系数: ${scale}`);
    } else {
      // 如果布加拉提图片未加载，则使用基于图片比例的默认调整
      if (characterName === '乔纳森·乔斯达') {
        // 乔纳森特别处理，即使没有布加拉提图片也放大
        img.style.maxHeight = '85vh';
        img.style.maxWidth = '95%';
      } else if (imgHeight > imgWidth * 2) {
        // 特别瘦长的图片
        img.style.maxHeight = '78vh';
        img.style.maxWidth = '70%';
      } else if (imgWidth > imgHeight * 1.5) {
        // 特别宽的图片
        img.style.maxHeight = '70vh';
        img.style.maxWidth = '95%';
      } else {
        // 普通比例的图片
        img.style.maxHeight = '78vh';
        img.style.maxWidth = '95%';
      }
    }
  };

  // 修改handleSaveImage函数，添加更多优化参数
  const handleSaveImage = async () => {
    try {
      setIsSaving(true);
      
      if (!shareContentRef.current) {
        setIsSaving(false);
        message.error('无法获取分享内容');
        return;
      }

      // 先确保所有图片加载完成
      const images = shareContentRef.current.querySelectorAll('img');
      await Promise.all(Array.from(images).map(img => {
        return new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = () => resolve();
            img.onerror = () => resolve(); // 即使加载失败也继续
          }
        });
      }));

      // 使用html2canvas将DOM元素转为图片，添加更多配置参数
      const canvas = await html2canvas(shareContentRef.current, {
        backgroundColor: '#1a1a2e',
        useCORS: true,
        logging: false,
        allowTaint: true,
        scale: 2, // 提高图片质量
        width: shareContentRef.current.scrollWidth,
        height: shareContentRef.current.scrollHeight,
        imageTimeout: 15000, // 增加图片加载超时时间
        onclone: (document, element) => {
          // 调整克隆元素的样式，确保宽高比
          const imgs = element.querySelectorAll('img');
          Array.from(imgs).forEach((img: HTMLImageElement) => {
            img.style.objectFit = 'contain';
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            img.style.width = 'auto';
            img.style.height = 'auto';
          });
          
          return element;
        }
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
      }, 'image/png', 1.0); // 使用最高质量
      
    } catch (error) {
      console.error('保存图片过程中出错:', error);
      message.error('生成图片时出错');
      setIsSaving(false);
    }
  };

  // 同样修改handleCopyToClipboard函数中的图片处理逻辑
  const handleCopyToClipboard = async () => {
    try {
      setIsSaving(true);
      
      if (!shareContentRef.current) {
        setIsSaving(false);
        message.error('无法获取分享内容');
        return;
      }

      // 先确保所有图片加载完成
      const images = shareContentRef.current.querySelectorAll('img');
      await Promise.all(Array.from(images).map(img => {
        return new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = () => resolve();
            img.onerror = () => resolve(); // 即使加载失败也继续
          }
        });
      }));

      // 使用与保存图片相同的配置
      const canvas = await html2canvas(shareContentRef.current, {
        backgroundColor: '#1a1a2e',
        useCORS: true,
        logging: false,
        allowTaint: true,
        scale: 2,
        width: shareContentRef.current.scrollWidth,
        height: shareContentRef.current.scrollHeight,
        imageTimeout: 15000,
        onclone: (document, element) => {
          // 调整克隆元素的样式，确保宽高比
          const imgs = element.querySelectorAll('img');
          Array.from(imgs).forEach((img: HTMLImageElement) => {
            img.style.objectFit = 'contain';
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            img.style.width = 'auto';
            img.style.height = 'auto';
          });
          
          return element;
        }
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
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        
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
  
  // 修改renderResult函数，使用组件顶层定义的hooks
  const renderResult = () => {
    if (!result) return null;
    
    const { character, mbtiType, description, dimensionScores } = result;
    // 为威尔·A·齐贝林使用Will_Zeppeli图片，其他角色正常显示
    let characterImagePath = character.name === '威尔·A·齐贝林' 
      ? '/images/jojo/Will_Zeppeli.webp' 
      : `/images/jojo/${characterImageMap[character.name] || 'default'}.webp`;
    
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
    
    // 移动端结果页面
    const renderMobileResult = () => (
      <MobileResultCard>
        <ResultPageWrapper characterImage={characterImagePath}>
          <MobileCharacterImage>
            <CharacterImg 
              src={
                character && characterImageMap[character.name]
                  ? `/images/jojo/${characterImageMap[character.name]}`
                  : character.name === '威尔·A·齐贝林'
                    ? '/images/jojo/Will_Zeppeli.webp'
                    : '/images/jojo/default.webp'
              }
              alt={character.name || ''}
            />
          </MobileCharacterImage>
          <ResultLayout>
            {/* 左侧信息栏 */}
            <ResultLeftColumn>
              <Title level={3} style={{ color: 'white' }}>测试结果</Title>
              
              <MbtiBox>
                <MbtiType level={2}>{mbtiType}</MbtiType>
                <Text style={{ color: '#b8b8b8' }}>{mbtiType.split('').join('-')}</Text>
              </MbtiBox>
              
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
    
    // 根据角色名判断使用哪个图片组件
    const isJonathan = character.name === '乔纳森·乔斯达';
    const isTamakiDamo = character.name === '田最环';
    const isWillZeppeli = character.name === '威尔·A·齐贝林';
    
    return (
      <PageWithCharacterBackground>
        <PCCharacterContainer>
          {isJonathan ? (
            <JonathanImg 
              src={characterImagePath} 
              alt={character.name} 
            />
          ) : isTamakiDamo ? (
            <TamakiDamoImg
              src={characterImagePath}
              alt={character.name}
            />
          ) : isWillZeppeli ? (
            <PCCharacterImg 
              src="/images/jojo/Will_Zeppeli.webp" 
              alt={character.name}
              style={{ 
                height: '75vh', 
                objectFit: 'contain', 
                opacity: '0.9',
                filter: 'brightness(1.1) contrast(1.1)'
              }}
            />
          ) : (
            <PCCharacterImg 
              src={
                character && characterImageMap[character.name]
                  ? `/images/jojo/${characterImageMap[character.name]}`
                  : character.name === '威尔·A·齐贝林'
                    ? '/images/jojo/Will_Zeppeli.webp'
                    : '/images/jojo/default.webp'
              }
              alt={character.name || ''}
              onLoad={(e) => handleImageLoad(e, character.name)}
            />
          )}
        </PCCharacterContainer>
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

  // 修改renderShareCard函数，使用新的ShareContent组件
  const renderShareCard = () => {
    if (!result || !showShareCard) return null;
    
    const { character, mbtiType, description, dimensionScores } = result;
    // 为威尔·A·齐贝林使用Will_Zeppeli图片，其他角色正常显示
    let characterImagePath = character.name === '威尔·A·齐贝林' 
      ? '/images/jojo/Will_Zeppeli.webp' 
      : `/images/jojo/${characterImageMap[character.name] || 'default'}.webp`;
    
    return (
      <ShareCardWrapper>
        <ShareCardContent ref={shareCardRef}>
          <CloseButton onClick={handleCloseShareCard}>×</CloseButton>
          
          {/* 使用新的ShareContent组件包裹要截图的内容 */}
          <ShareContent ref={shareContentRef}>
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
              
              {/* 使用新的CharacterImageContainer组件和ShareCharacterImage组件 */}
              <CharacterImageContainer>
                <ShareCharacterImage 
                  src={
                    character && characterImageMap[character.name]
                      ? `/images/jojo/${characterImageMap[character.name]}`
                      : character.name === '威尔·A·齐贝林'
                        ? '/images/jojo/Will_Zeppeli.webp'
                        : '/images/jojo/default.webp'
                  }
                  alt={character.name || ''}
                />
              </CharacterImageContainer>
              
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
          </ShareContent>
          
          {/* 将操作按钮放在截图内容之外 */}
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
        </ShareCardContent>
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