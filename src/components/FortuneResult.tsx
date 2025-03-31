import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { Spin } from 'antd';

const ResultContainer = styled(motion.div)`
  width: 100%;
  max-width: 800px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  text-align: center;
`;

const Title = styled.h2`
  color: #fff;
  margin-bottom: 2rem;
  font-size: 2rem;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
`;

const ResultSection = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  text-align: left;
`;

const SectionTitle = styled.h3`
  color: #ff8e8e;
  margin-bottom: 1rem;
  font-size: 1.3rem;
`;

const ResultText = styled.p`
  color: #e0e0e0;
  line-height: 1.6;
  margin: 0;
  font-size: 1.1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 20px;
  
  .ant-spin {
    .ant-spin-dot-item {
      background-color: #ff8e8e;
    }
  }
`;

const BackButton = styled(motion.button)`
  margin-top: 2rem;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  background: linear-gradient(45deg, #6b6bff, #8e8eff);
  border: none;
  border-radius: 30px;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(107, 107, 255, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(107, 107, 255, 0.4);
  }
`;

interface FortuneResultProps {
  formData: any;
  onBack: () => void;
  onShare: (content: string) => void;
}

const generateFortuneResult = (formData: FortuneResultProps['formData']) => {
  const results = {
    overview: `亲爱的${formData.name}，根据您的生辰八字和当前星象，我为您解读如下：`,
    mainFortune: `您所询问的"${formData.question}"，显示出您对${formData.category === 'career' ? '事业发展' : 
      formData.category === 'love' ? '感情生活' : 
      formData.category === 'wealth' ? '财务状况' : 
      formData.category === 'health' ? '身体健康' : '人生方向'}的关注。
      从整体运势来看，您正处于一个转折期，机遇与挑战并存。`,
    advice: `建议您：
    1. 保持开放和积极的心态
    2. 适时调整计划和策略
    3. 注意倾听内心的声音
    4. 把握当下，规划未来`,
    timing: `近期运势最佳时机：每月上旬，特别是在周二、周四行事较为顺遂。关键时期将在三个月后出现，届时要保持警觉，把握机会。`
  };
  
  return results;
};

const FortuneResult: React.FC<FortuneResultProps> = ({ formData, onBack, onShare }) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    // 模拟API调用延迟
    setTimeout(() => {
      const fortuneResult = generateFortuneResult(formData);
      setResult(fortuneResult);
      setLoading(false);
    }, 2000);
  }, [formData]);

  const handleShare = () => {
    const content = `
占卜结果
姓名：${formData.name}
问题：${formData.question}
类别：${formData.category}

${result.overview}

详细解读：
${result.mainFortune}

建议：
${result.advice}

时机：
${result.timing}
    `;
    onShare(content);
  };

  if (loading) {
    return (
      <ResultContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <LoadingContainer>
          <Spin size="large" />
          <ResultText>正在推算命运...</ResultText>
        </LoadingContainer>
      </ResultContainer>
    );
  }

  return (
    <ResultContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title>命运解析</Title>
      
      <ResultSection>
        <SectionTitle>总体概述</SectionTitle>
        <ResultText>{result.overview}</ResultText>
      </ResultSection>

      <ResultSection>
        <SectionTitle>详细解读</SectionTitle>
        <ResultText>{result.mainFortune}</ResultText>
      </ResultSection>

      <ResultSection>
        <SectionTitle>建议指引</SectionTitle>
        <ResultText>{result.advice}</ResultText>
      </ResultSection>

      <ResultSection>
        <SectionTitle>时机把握</SectionTitle>
        <ResultText>{result.timing}</ResultText>
      </ResultSection>

      <BackButton
        onClick={handleShare}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        分享结果
      </BackButton>
      <BackButton
        onClick={onBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        返回重新占卜
      </BackButton>
    </ResultContainer>
  );
};

export default FortuneResult; 