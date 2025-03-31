import React from 'react';
import styled from '@emotion/styled';
import { Button } from 'antd';
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

const ResultCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const TypeTitle = styled.h3`
  color: #ffd700;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Description = styled.p`
  color: #e0e0e0;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
`;

const Traits = styled.div`
  margin: 2rem 0;
`;

const TraitTitle = styled.h4`
  color: #ffd700;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const TraitList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    color: #e0e0e0;
    margin-bottom: 0.5rem;
    padding-left: 1.5rem;
    position: relative;
    
    &:before {
      content: "•";
      color: #ffd700;
      position: absolute;
      left: 0;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
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

interface MBTIResultProps {
  result: string;
  onBack: () => void;
}

const mbtiDescriptions: Record<string, {
  title: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  career: string[];
}> = {
  'INTJ': {
    title: '建筑师',
    description: '具有创新思维的战略家，擅长制定复杂的计划。追求不断的自我提升，重视知识和能力的积累。独立性强，有很强的分析能力和洞察力。',
    strengths: [
      '战略性思维',
      '独立性强',
      '创新能力出众',
      '追求卓越'
    ],
    weaknesses: [
      '可能显得过于冷漠',
      '有时过于完美主义',
      '不擅长处理情感问题'
    ],
    career: [
      '科学研究',
      '系统分析师',
      '战略规划师',
      '建筑师'
    ]
  },
  // 可以添加其他MBTI类型的描述...
};

const MBTIResult: React.FC<MBTIResultProps> = ({ result, onBack }) => {
  const typeInfo = mbtiDescriptions[result] || {
    title: '个性类型',
    description: '您的MBTI类型是 ' + result + '。每个MBTI类型都有其独特的特点和优势。',
    strengths: ['独特的个性特征', '个人化的思维方式'],
    weaknesses: ['需要进一步探索的领域'],
    career: ['根据个人特点选择适合的职业道路']
  };

  return (
    <Container>
      <Title>您的MBTI测试结果</Title>
      
      <ResultCard>
        <TypeTitle>{result} - {typeInfo.title}</TypeTitle>
        <Description>{typeInfo.description}</Description>

        <Traits>
          <TraitTitle>性格优势</TraitTitle>
          <TraitList>
            {typeInfo.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </TraitList>
        </Traits>

        <Traits>
          <TraitTitle>需要注意</TraitTitle>
          <TraitList>
            {typeInfo.weaknesses.map((weakness, index) => (
              <li key={index}>{weakness}</li>
            ))}
          </TraitList>
        </Traits>

        <Traits>
          <TraitTitle>职业建议</TraitTitle>
          <TraitList>
            {typeInfo.career.map((career, index) => (
              <li key={index}>{career}</li>
            ))}
          </TraitList>
        </Traits>
      </ResultCard>

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

export default MBTIResult; 