import React from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { Form, Input, Select, DatePicker, Button } from 'antd';

const { Option } = Select;

const FormContainer = styled(motion.div)`
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
`;

const Title = styled.h2`
  color: #fff;
  text-align: center;
  margin-bottom: 2rem;
`;

const StyledForm = styled(Form)`
  .ant-form-item-label > label {
    color: #fff;
  }
  
  .ant-input,
  .ant-select-selector,
  .ant-picker {
    background: rgba(255, 255, 255, 0.1) !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
    color: #fff !important;
  }

  .ant-select-selection-placeholder,
  .ant-picker-input > input::placeholder {
    color: rgba(255, 255, 255, 0.5) !important;
  }

  .ant-select-arrow,
  .ant-picker-suffix {
    color: rgba(255, 255, 255, 0.5) !important;
  }
`;

const SubmitButton = styled(Button)`
  width: 100%;
  height: 45px;
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e) !important;
  border: none !important;
  font-size: 1.1rem;

  &:hover {
    opacity: 0.9;
  }
`;

interface FortuneFormData {
  name: string;
  birthDate: Date;
  gender: string;
  category: string;
  question: string;
}

interface FortuneFormProps {
  onSubmit: (data: FortuneFormData) => void;
}

const FortuneForm: React.FC<FortuneFormProps> = ({ onSubmit }) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    onSubmit(values);
  };

  return (
    <FormContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title>请告诉我关于你的信息</Title>
      <StyledForm
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="姓名"
          name="name"
          rules={[{ required: true, message: '请输入您的姓名' }]}
        >
          <Input placeholder="请输入您的姓名" />
        </Form.Item>

        <Form.Item
          label="出生日期"
          name="birthDate"
          rules={[{ required: true, message: '请选择您的出生日期' }]}
        >
          <DatePicker style={{ width: '100%' }} placeholder="选择出生日期" />
        </Form.Item>

        <Form.Item
          label="性别"
          name="gender"
          rules={[{ required: true, message: '请选择您的性别' }]}
        >
          <Select placeholder="请选择您的性别">
            <Option value="male">男</Option>
            <Option value="female">女</Option>
            <Option value="other">其他</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="占卜类别"
          name="category"
          rules={[{ required: true, message: '请选择占卜类别' }]}
        >
          <Select placeholder="请选择占卜类别">
            <Option value="career">事业运势</Option>
            <Option value="love">感情姻缘</Option>
            <Option value="wealth">财运分析</Option>
            <Option value="health">健康运势</Option>
            <Option value="general">综合运势</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="具体问题"
          name="question"
          rules={[{ required: true, message: '请输入您想问的具体问题' }]}
        >
          <Input.TextArea
            placeholder="请详细描述您想了解的问题"
            rows={4}
          />
        </Form.Item>

        <Form.Item>
          <SubmitButton type="primary" htmlType="submit">
            开始解析
          </SubmitButton>
        </Form.Item>
      </StyledForm>
    </FormContainer>
  );
};

export default FortuneForm; 