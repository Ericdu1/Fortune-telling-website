import React from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

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

const StyledForm = styled(Form<LoginData>)`
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

interface LoginData {
  username: string;
  password: string;
}

interface UserLoginProps {
  onLogin: (data: LoginData) => void;
  onRegister: () => void;
}

const UserLogin: React.FC<UserLoginProps> = ({ onLogin, onRegister }) => {
  const [form] = Form.useForm<LoginData>();

  const handleSubmit = async (values: LoginData) => {
    try {
      await onLogin(values);
    } catch (error) {
      message.error('登录失败，请重试！');
    }
  };

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Title>用户登录</Title>
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
          name="password"
          label="密码"
          rules={[{ required: true, message: '请输入密码！' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
        </Form.Item>

        <ButtonContainer>
          <StyledButton type="primary" htmlType="submit">
            登录
          </StyledButton>
          <StyledButton onClick={onRegister}>
            注册
          </StyledButton>
        </ButtonContainer>
      </StyledForm>
    </Container>
  );
};

export default UserLogin; 