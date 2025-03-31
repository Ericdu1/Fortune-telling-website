import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Button, Radio, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  color: white;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: white;
`;

const QuestionContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const Question = styled.div`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: white;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const StyledButton = styled(Button)`
  background: linear-gradient(45deg, #6b6bff, #8e8eff);
  border: none;
  color: white;
  height: 40px;
  padding: 0 2rem;
  
  &:hover {
    opacity: 0.9;
    color: white;
  }
`;

const Progress = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  color: #e0e0e0;
`;

interface MBTITestProps {
  onComplete: (result: string) => void;
  onBack: () => void;
}

const questions = [
  {
    id: 1,
    text: '在社交场合中，你通常会：',
    options: [
      { value: 'E', text: '积极主动与他人交谈，享受社交' },
      { value: 'I', text: '倾向于安静观察，选择性社交' }
    ]
  },
  {
    id: 2,
    text: '在获取信息时，你更倾向于：',
    options: [
      { value: 'S', text: '关注具体的细节和事实' },
      { value: 'N', text: '关注整体概念和可能性' }
    ]
  },
  {
    id: 3,
    text: '在做决定时，你通常会：',
    options: [
      { value: 'T', text: '依据逻辑和客观分析' },
      { value: 'F', text: '考虑他人感受和价值观' }
    ]
  },
  {
    id: 4,
    text: '在处理事务时，你更喜欢：',
    options: [
      { value: 'J', text: '按计划有序地完成' },
      { value: 'P', text: '灵活应变，保持开放' }
    ]
  }
];

const MBTITest: React.FC<MBTITestProps> = ({ onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 计算MBTI结果
      const result = calculateMBTIResult(newAnswers);
      onComplete(result);
    }
  };

  const calculateMBTIResult = (answers: string[]): string => {
    const result = [];
    result.push(answers[0]); // E/I
    result.push(answers[1]); // S/N
    result.push(answers[2]); // T/F
    result.push(answers[3]); // J/P
    return result.join('');
  };

  const question = questions[currentQuestion];

  return (
    <Container>
      <Title>MBTI 性格测试</Title>
      <Progress>
        问题 {currentQuestion + 1} / {questions.length}
      </Progress>
      
      <QuestionContainer>
        <Question>{question.text}</Question>
        <Radio.Group onChange={(e) => handleAnswer(e.target.value)}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {question.options.map((option) => (
              <Radio key={option.value} value={option.value} style={{ color: 'white', marginBottom: '1rem' }}>
                {option.text}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </QuestionContainer>

      <ButtonContainer>
        <StyledButton 
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
        >
          返回首页
        </StyledButton>
      </ButtonContainer>
    </Container>
  );
};

export default MBTITest; 