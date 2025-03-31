import React from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

const Container = styled(motion.div)`
  width: 100%;
  max-width: 400px;
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

const StyledForm = styled(Form<RegisterData>)`
  .ant-form-item-label > label {
    color: #fff;
  }
  .ant-input {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    &:hover, &:focus {
      border-color: #6b6bff;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const StyledButton = styled(Button)`
  flex: 1;
  background: linear-gradient(45deg, #6b6bff, #8e8eff);
  border: none;
  color: white;
  &:hover {
    opacity: 0.9;
    color: white;
  }
`;

interface RegisterData {
  username: string;
  password: string;
  email: string;
  confirmPassword: string;
}

interface UserRegisterProps {
  onRegister: (data: RegisterData) => void;
  onBack: () => void;
}

const UserRegister: React.FC<UserRegisterProps> = ({ onRegister, onBack }) => {
  const [form] = Form.useForm<RegisterData>();

  const handleSubmit = async (values: RegisterData) => {
    try {
      await onRegister(values);
    } catch (error) {
      message.error('注册失败，请重试！');
    }
  };

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title>用户注册</Title>
      <StyledForm
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名！' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱！' },
            { type: 'email', message: '请输入有效的邮箱地址！' }
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
        </Form.Item>

        <Form.Item
          name="password"
          label="密码"
          rules={[
            { required: true, message: '请输入密码！' },
            { min: 6, message: '密码长度不能小于6位！' }
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="确认密码"
          dependencies={['password']}
          rules={[
            { required: true, message: '请确认密码！' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致！'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="请确认密码" />
        </Form.Item>

        <ButtonContainer>
          <StyledButton onClick={onBack}>
            返回
          </StyledButton>
          <StyledButton type="primary" htmlType="submit">
            注册
          </StyledButton>
        </ButtonContainer>
      </StyledForm>
    </Container>
  );
};

export default UserRegister; 