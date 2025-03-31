import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import { Spin, message } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';

interface DailyWallpaper {
  id: string;
  title: string;
  imageUrl: string;
  author: string;
  source?: string;
  date: string;
}

const Container = styled.div`
  margin: 2.5rem 0;
  
  @media (max-width: 768px) {
    margin: 2rem 0;
  }
`;

const Title = styled.h3`
  color: #ffd700;
  font-size: 1.4rem;
  text-align: center;
  margin-bottom: 1.5rem;
  position: relative;
  
  &:before, &:after {
    content: '';
    position: absolute;
    top: 50%;
    height: 1px;
    width: 30%;
    background: rgba(255, 215, 0, 0.3);
  }
  
  &:before {
    left: 0;
  }
  
  &:after {
    right: 0;
  }
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }
`;

const ImageCard = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
`;

const StyledImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.5s ease;
  
  ${ImageCard}:hover & {
    transform: scale(1.02);
  }
`;

const ImageInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  padding: 1rem;
  transition: opacity 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 0.8rem;
  }
`;

const ImageTitle = styled.h4`
  color: #ffd700;
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const DateDisplay = styled.div`
  color: #e0e0e0;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const Author = styled.div`
  color: #e0e0e0;
  font-size: 0.9rem;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const SourceLink = styled.a`
  color: rgba(255, 215, 0, 0.7);
  font-size: 0.8rem;
  text-decoration: none;
  display: block;
  text-align: right;
  margin-top: 0.5rem;
  
  &:hover {
    color: #ffd700;
    text-decoration: underline;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  text-align: center;
  padding: 1rem;
`;

const DailyWallpaperComponent: React.FC = () => {
  const [wallpaper, setWallpaper] = useState<DailyWallpaper | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDailyWallpaper = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/daily-wallpaper');
        setWallpaper(response.data);
        setError(null);
      } catch (err) {
        console.error('获取每日壁纸失败:', err);
        setError('无法加载每日壁纸，请稍后再试');
        message.error('获取每日壁纸失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDailyWallpaper();
  }, []);
  
  if (loading) {
    return (
      <Container>
        <Title>今日壁纸</Title>
        <LoadingContainer>
          <Spin tip="加载中..." />
        </LoadingContainer>
      </Container>
    );
  }
  
  if (error || !wallpaper) {
    return (
      <Container>
        <Title>今日壁纸</Title>
        <ErrorMessage>{error || '无法加载壁纸'}</ErrorMessage>
      </Container>
    );
  }
  
  return (
    <Container>
      <Title>今日壁纸</Title>
      <ImageCard>
        <StyledImage 
          src={wallpaper.imageUrl} 
          alt={wallpaper.title}
          onError={(e) => {
            e.currentTarget.src = '/placeholder-image.jpg';
          }}
        />
        <ImageInfo>
          <ImageTitle>{wallpaper.title}</ImageTitle>
          <DateDisplay>
            <CalendarOutlined /> {wallpaper.date}
          </DateDisplay>
          <Author>制作: {wallpaper.author}</Author>
          {wallpaper.source && (
            <SourceLink 
              href={wallpaper.source} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              查看来源
            </SourceLink>
          )}
        </ImageInfo>
      </ImageCard>
    </Container>
  );
};

export default DailyWallpaperComponent; 