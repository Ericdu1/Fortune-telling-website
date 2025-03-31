import React, { useState } from 'react';
import styled from '@emotion/styled';
import { TarotCardResult } from './types/tarot';
import { DailyFortune as DailyFortuneType } from './types/fortune';
import { tarotCards } from './data/tarotCards';
import Home from './components/Home';
import TarotReading from './components/TarotReading';
import TarotResult from './components/TarotResult';
import ShareResult from './components/ShareResult';
import DailyFortune from './components/DailyFortune';
import { HomeOutlined, StarOutlined, CalendarOutlined, UserOutlined, HistoryOutlined } from '@ant-design/icons';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 80px;
  background: rgba(255, 255, 255, 0.05);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
  gap: 2rem;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 60px;
    flex-direction: row;
    justify-content: center;
    padding: 0;
    gap: 0;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const SidebarItem = styled.div<{ active?: boolean }>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  cursor: pointer;
  color: ${props => props.active ? '#ffd700' : '#ffffff'};
  opacity: ${props => props.active ? 1 : 0.6};
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    color: #ffd700;
    opacity: 1;
  }

  ${props => props.active && `
    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 20px;
      background: #ffd700;
      border-radius: 0 3px 3px 0;
    }
  `}

  .anticon {
    font-size: 1.5rem;
  }
  
  @media (max-width: 768px) {
    width: 20%;
    padding: 0.5rem 0;
    
    ${props => props.active && `
      &:before {
        left: 50%;
        top: auto;
        bottom: 0;
        transform: translateX(-50%);
        width: 20px;
        height: 3px;
        border-radius: 3px 3px 0 0;
      }
    `}
    
    .anticon {
      font-size: 1.2rem;
    }
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
`;

type Step = 
  | 'home'
  | 'daily-fortune'
  | 'daily-fortune-share'
  | 'tarot-reading'
  | 'tarot-result'
  | 'tarot-share'
  | 'profile'
  | 'history';

const positions = ['过去', '现在', '未来'];

interface AppState {
  currentStep: Step;
  selectedCards: TarotCardResult[];
  dailyFortune: string | null;
  dailyFortuneResult?: DailyFortuneType;
  tarotResult?: {
    cards: TarotCardResult[];
    interpretations?: {
      past: string;
      present: string;
      future: string;
      guidance: string;
    };
  };
}

const initialState: AppState = {
  currentStep: 'home',
  selectedCards: [],
  dailyFortune: null,
  dailyFortuneResult: undefined,
  tarotResult: undefined
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(initialState);

  // 每次进入塔罗牌阅读页面时重新随机抽取牌
  const getRandomCards = () => {
    // 打乱所有22张塔罗牌
    const shuffled = [...tarotCards].sort(() => Math.random() - 0.5);
    // 从打乱的牌组中选择前8张
    return shuffled.slice(0, 8).map(card => ({
      ...card,
      isReversed: Math.random() < 0.5,
      position: ''
    }));
  };

  const [displayCards, setDisplayCards] = useState(getRandomCards());

  const handleCardSelect = (cards: TarotCardResult[]) => {
    console.log('选择的原始卡片:', cards);
    
    // 为每张卡片设置正确的位置
    const cardsWithPositions = cards.map((card, index) => {
      console.log(`设置卡片 ${card.name} 的位置为 ${positions[index]}`);
      
      // 确保每张卡片都有完整的解读信息
      return {
        ...card,
        position: positions[index],
        meaning: card.meaning || `${card.name}牌代表了改变和转机，这可能影响你的决策和行动。`,
        reversedMeaning: card.reversedMeaning || `${card.name}牌逆位表示你可能面临一些挑战，需要重新审视自己的处境。`
      };
    });
    
    console.log('处理后的卡片:', cardsWithPositions);

    setState(prev => ({
      ...prev,
      currentStep: 'tarot-result',
      selectedCards: cardsWithPositions,
      tarotResult: {
        cards: cardsWithPositions,
        interpretations: {
          past: cardsWithPositions[0]?.isReversed ? cardsWithPositions[0].reversedMeaning : cardsWithPositions[0].meaning,
          present: cardsWithPositions[1]?.isReversed ? cardsWithPositions[1].reversedMeaning : cardsWithPositions[1].meaning,
          future: cardsWithPositions[2]?.isReversed ? cardsWithPositions[2].reversedMeaning : cardsWithPositions[2].meaning,
          guidance: `根据塔罗牌的指引，让我们一起解读您的人生轨迹。在过去的经历中，${cardsWithPositions[0]?.isReversed ? cardsWithPositions[0].reversedMeaning : cardsWithPositions[0].meaning}的状态影响着您的决策和行动。目前，您正处于${cardsWithPositions[1]?.isReversed ? cardsWithPositions[1].reversedMeaning : cardsWithPositions[1].meaning}的阶段。展望未来，${cardsWithPositions[2]?.isReversed ? cardsWithPositions[2].reversedMeaning : cardsWithPositions[2].meaning}的征兆预示着即将到来的变化和机遇。保持开放和谨慎的心态，相信自己的直觉，勇敢地面对即将到来的改变。`
        }
      }
    }));
  };

  // 每次返回塔罗牌阅读页面时重新随机抽取牌
  const handleReturnToReading = () => {
    setDisplayCards(getRandomCards());
    setState(prev => ({ ...prev, currentStep: 'tarot-reading' }));
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 'home':
        return (
          <Home 
            onStartTarot={() => {
              setDisplayCards(getRandomCards());
              setState(prev => ({ ...prev, currentStep: 'tarot-reading' }));
            }}
            onStartDaily={() => setState(prev => ({ ...prev, currentStep: 'daily-fortune' }))}
          />
        );

      case 'tarot-reading':
        return (
          <TarotReading 
            displayCards={displayCards}
            onComplete={handleCardSelect}
          />
        );

      case 'tarot-result':
        return state.tarotResult ? (
          <TarotResult 
            cards={state.tarotResult.cards}
            onBack={handleReturnToReading}
            onShare={() => setState(prev => ({ ...prev, currentStep: 'tarot-share' }))}
          />
        ) : null;

      case 'tarot-share':
        return state.tarotResult ? (
          <ShareResult 
            tarotResult={state.tarotResult}
            onBack={() => setState(prev => ({ ...prev, currentStep: 'tarot-result' }))}
          />
        ) : null;

      case 'daily-fortune':
        return (
          <DailyFortune 
            onBack={() => setState(prev => ({ ...prev, currentStep: 'home' }))}
            onShare={(result) => setState(prev => ({
              ...prev,
              currentStep: 'daily-fortune-share',
              dailyFortuneResult: result
            }))}
          />
        );

      case 'daily-fortune-share':
        return state.dailyFortuneResult ? (
          <ShareResult 
            dailyFortune={state.dailyFortuneResult}
            onBack={() => setState(prev => ({ ...prev, currentStep: 'daily-fortune' }))}
          />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <AppContainer>
      <Sidebar>
        <SidebarItem 
          active={state.currentStep === 'home'}
          onClick={() => setState(prev => ({ ...prev, currentStep: 'home' }))}
        >
          <HomeOutlined />
        </SidebarItem>
        <SidebarItem 
          active={state.currentStep.startsWith('tarot')}
          onClick={() => setState(prev => ({ ...prev, currentStep: 'tarot-reading' }))}
        >
          <StarOutlined />
        </SidebarItem>
        <SidebarItem 
          active={state.currentStep.startsWith('daily')}
          onClick={() => setState(prev => ({ ...prev, currentStep: 'daily-fortune' }))}
        >
          <CalendarOutlined />
        </SidebarItem>
        <SidebarItem 
          active={state.currentStep === 'profile'}
          onClick={() => setState(prev => ({ ...prev, currentStep: 'profile' }))}
        >
          <UserOutlined />
        </SidebarItem>
        <SidebarItem 
          active={state.currentStep === 'history'}
          onClick={() => setState(prev => ({ ...prev, currentStep: 'history' }))}
        >
          <HistoryOutlined />
        </SidebarItem>
      </Sidebar>
      <MainContent>
        {renderStep()}
      </MainContent>
    </AppContainer>
  );
};

export default App;
