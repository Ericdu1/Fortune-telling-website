import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import { Spin, message } from 'antd';

interface AnimeImage {
  id: string;
  title: string;
  imageUrl: string;
  author: string;
  source?: string;
}

const RecommendationContainer = styled.div`
  margin: 2rem 0;
  
  @media (max-width: 768px) {
    margin: 1.5rem 0;
  }
`;

const Title = styled.h3`
  color: #ffd700;
  font-size: 1.3rem;
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
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.8rem;
  }
`;

const ImageCard = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  position: relative;
  overflow: hidden;
`;

const StyledImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${ImageCard}:hover & {
    transform: scale(1.05);
  }
`;

const ImageInfo = styled.div`
  padding: 0.8rem;
  
  @media (max-width: 480px) {
    padding: 0.6rem;
  }
`;

const ImageTitle = styled.h4`
  color: #ffd700;
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const ImageAuthor = styled.p`
  color: #e0e0e0;
  font-size: 0.8rem;
  margin: 0;
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

const SourceLink = styled.a`
  color: rgba(255, 215, 0, 0.7);
  font-size: 0.7rem;
  text-decoration: none;
  display: block;
  text-align: right;
  margin-top: 0.3rem;
  
  &:hover {
    color: #ffd700;
    text-decoration: underline;
  }
  
  @media (max-width: 480px) {
    font-size: 0.6rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  text-align: center;
  padding: 1rem;
`;

const AnimeRecommendation: React.FC = () => {
  const [animeImages, setAnimeImages] = useState<AnimeImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAnimeRecommendations = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/anime-recommendations');
        setAnimeImages(response.data);
        setError(null);
      } catch (err) {
        console.error('获取动漫推荐失败:', err);
        setError('无法加载动漫推荐，请稍后再试');
        message.error('获取动漫推荐失败');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnimeRecommendations();
  }, []);
  
  if (loading) {
    return (
      <RecommendationContainer>
        <Title>今日动漫推荐</Title>
        <LoadingContainer>
          <Spin tip="加载中..." />
        </LoadingContainer>
      </RecommendationContainer>
    );
  }
  
  if (error) {
    return (
      <RecommendationContainer>
        <Title>今日动漫推荐</Title>
        <ErrorMessage>{error}</ErrorMessage>
      </RecommendationContainer>
    );
  }
  
  return (
    <RecommendationContainer>
      <Title>今日动漫推荐</Title>
      <ImagesGrid>
        {animeImages.map(image => (
          <ImageCard key={image.id}>
            <ImageContainer>
              <StyledImage 
                src={image.imageUrl} 
                alt={image.title}
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-image.jpg';
                }}
              />
            </ImageContainer>
            <ImageInfo>
              <ImageTitle title={image.title}>{image.title}</ImageTitle>
              <ImageAuthor>{image.author}</ImageAuthor>
              {image.source && (
                <SourceLink 
                  href={image.source} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  查看来源
                </SourceLink>
              )}
            </ImageInfo>
          </ImageCard>
        ))}
      </ImagesGrid>
    </RecommendationContainer>
  );
};

export default AnimeRecommendation; 