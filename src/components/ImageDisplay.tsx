import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Spin } from 'antd';
import { motion } from 'framer-motion';

interface ImageDisplayProps {
  sceneType: string;
  worldType: string;
  talent?: string;
  event?: string;
  userId?: string;
  className?: string;
}

const ImageContainer = styled(motion.div)`
  width: 100%;
  margin: 1.5rem 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  position: relative;
  aspect-ratio: 1; /* 保持1:1比例 */
  background: rgba(20, 0, 40, 0.6);
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const AnimatedImage = motion(StyledImage);

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const LoadingText = styled.div`
  color: #ba68c8;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const ErrorContainer = styled.div`
  padding: 2rem;
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #e57373;
`;

// API地址
const API_ENDPOINT = '/api/generate-image';

const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
  sceneType, 
  worldType, 
  talent, 
  event, 
  userId = 'anonymous',
  className
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [remainingImages, setRemainingImages] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    
    // 重置状态
    setLoading(true);
    setError(null);
    
    // 生成图像
    const generateImage = async () => {
      try {
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sceneType,
            worldType,
            talent,
            event,
            userId
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (mounted) {
            setError(data.message || data.error || '生成图像失败');
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setImageUrl(data.url);
          setRemainingImages(data.remainingImages || null);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError('请求出错，请稍后再试');
          setLoading(false);
        }
      }
    };

    generateImage();

    // 清理函数
    return () => {
      mounted = false;
    };
  }, [sceneType, worldType, talent, event, userId]);

  // 生成加载消息
  const getLoadingMessage = () => {
    const messages = [
      `正在创造你的${worldType}画面...`,
      `构建${talent || ''}能力的视觉效果...`,
      `捕捉平行世界的画面...`,
      `穿越次元连接中...`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <ImageContainer 
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {loading ? (
        <LoaderContainer>
          <Spin size="large" />
          <LoadingText>{getLoadingMessage()}</LoadingText>
        </LoaderContainer>
      ) : error ? (
        <ErrorContainer>
          <p>{error}</p>
        </ErrorContainer>
      ) : (
        <AnimatedImage 
          src={imageUrl || ''} 
          alt={`${worldType} 场景图`} 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      )}
    </ImageContainer>
  );
};

export default ImageDisplay; 