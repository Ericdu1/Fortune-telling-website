import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Button, Input, Form } from 'antd';
import { ArrowLeftOutlined, SendOutlined } from '@ant-design/icons';

const { TextArea } = Input;

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

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const Description = styled.p`
  color: #e0e0e0;
  margin-bottom: 2rem;
  line-height: 1.6;
  text-align: center;
`;

const StyledForm = styled(Form)`
  .ant-form-item-label > label {
    color: white;
  }
  
  .ant-input, .ant-input-textarea {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
    
    &:focus, &:hover {
      border-color: #6b6bff;
      background: rgba(255, 255, 255, 0.15);
    }
  }
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

const ResponseContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  margin-top: 2rem;
  white-space: pre-wrap;
`;

interface AIInterpretationProps {
  onBack: () => void;
}

const AIInterpretation: React.FC<AIInterpretationProps> = ({ onBack }) => {
  const [form] = Form.useForm();
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 这里应该调用实际的AI API
      const mockResponse = `基于您的描述，我为您进行如下解读：

1. 当前状况
您目前正处在一个需要做出重要决定的阶段。内心的困惑和外部的压力可能让您感到些许迷茫。

2. 潜在机遇
您所面临的挑战实际上是一个难得的成长机会。这个时期的经历将帮助您更好地认识自己，明确未来的方向。

3. 建议
• 保持开放和积极的心态
• 相信自己的直觉和判断
• 适当寻求他人的建议和支持
• 给自己一些时间来思考和调整

4. 未来展望
通过这段时期的努力和成长，您将会收获宝贵的经验，这些经验将在未来的人生道路上发挥重要作用。`;
      
      setResponse(mockResponse);
    } catch (error) {
      console.error('AI解读失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>AI 智能解读</Title>
      <Description>
        通过先进的AI技术，为您提供个性化的命运解读和建议。
        请详细描述您当前的困惑或想要了解的问题。
      </Description>

      <FormContainer>
        <StyledForm
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="question"
            label="您的问题或困惑"
            rules={[{ required: true, message: '请输入您的问题' }]}
          >
            <TextArea
              placeholder="例如：我最近在事业发展方面遇到了一些困惑..."
              rows={6}
              maxLength={1000}
              showCount
            />
          </Form.Item>

          <ButtonContainer>
            <StyledButton 
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
            >
              返回首页
            </StyledButton>
            <StyledButton 
              type="primary"
              icon={<SendOutlined />}
              loading={loading}
              onClick={() => form.submit()}
            >
              获取解读
            </StyledButton>
          </ButtonContainer>
        </StyledForm>
      </FormContainer>

      {response && (
        <ResponseContainer>
          {response}
        </ResponseContainer>
      )}
    </Container>
  );
};

export default AIInterpretation; 