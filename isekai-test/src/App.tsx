import React, { useState } from 'react';
import './App.css';
import IntroPage from './components/IntroPage';
import TestPage from './components/TestPage';
import ResultPage from './components/ResultPage';

// 测试阶段枚举
enum TestStage {
  INTRO = 'intro',
  PERSONALITY = 'personality',
  WORLD = 'world',
  TALENT = 'talent',
  DESTINY = 'destiny',
  RESULT = 'result'
}

// 结果类型定义
interface StoryType {
  beginning: string;
  middle: string;
  ending: string;
}

interface ResultType {
  world: string;
  worldFeatures: string[];
  talent: string;
  talentLevel: string;
  talentRarity: string;
  events: string[];
  story: StoryType;
}

// 答案类型定义
interface AnswersType {
  personality: number[];
  world: number[];
  talent: number[];
  destiny: number[];
}

function App() {
  // 测试阶段状态
  const [stage, setStage] = useState<TestStage>(TestStage.INTRO);
  
  // 用户回答记录
  const [answers, setAnswers] = useState<AnswersType>({
    personality: [],
    world: [],
    talent: [],
    destiny: []
  });
  
  // 结果数据
  const [result, setResult] = useState<ResultType | null>(null);

  // 处理问题回答
  const handleAnswer = (section: string, answer: number[]) => {
    setAnswers({
      ...answers,
      [section]: [...answers[section as keyof AnswersType], ...answer]
    });
    
    // 进入下一阶段
    switch(section) {
      case 'personality':
        setStage(TestStage.WORLD);
        break;
      case 'world':
        setStage(TestStage.TALENT);
        break;
      case 'talent':
        setStage(TestStage.DESTINY);
        break;
      case 'destiny':
        generateResult();
        break;
      default:
        break;
    }
  };

  // 生成结果
  const generateResult = async () => {
    // 这里将调用AI接口生成结果
    // 模拟异步操作
    setTimeout(() => {
      const mockResult: ResultType = {
        world: '修真/仙侠世界',
        worldFeatures: ['高武', '战乱', '宗门林立'],
        talent: '磁场转动',
        talentLevel: 'A级',
        talentRarity: '极度罕见的异端能力',
        events: [
          '在宗门试炼中意外觉醒磁场力量',
          '被视为异端遭受追杀',
          '发现远古遗迹中的海虎传承',
          '匹数突破至二十万',
          '与修真界最强者对决'
        ],
        story: {
          beginning: '你本是青山派外门弟子，资质平庸，被同门嘲笑。一次门派试炼中，你偶然跌入古井，发现神秘石碑，触碰后昏迷三日。醒来时，你体内不再有灵力流动，而是产生了奇特的磁场能量，匹数达五万。',
          middle: '被师门视为异端的你被迫逃亡，期间偶入一处远古遗迹，发现"海虎传承"石碑，获得完整的磁场修炼法。随着战纹觉醒，你的力量不断提升，却也引来更多修真界强者的觊觎。磁场对灵力有天然压制作用，你开始在修真界闯出名声，被称为"磁场魔头"。你的匹数突破二十万时，终于引起了传说中的"剑仙盟"注意。',
          ending: '当剑仙盟围攻你时，你发现磁场与剑气激烈碰撞产生共鸣，意外领悟到两种力量的融合之法。经过艰苦修炼，你创造出"磁剑道"，将两种截然不同的力量体系融合，实力飙升，匹数达到惊人的七十万。最终，你成为了这个世界的新型力量开创者，建立"磁剑宗"，打破了修真界千年不变的力量格局。'
        }
      };
      setResult(mockResult);
      setStage(TestStage.RESULT);
    }, 1500);
  };

  // 重新开始测试
  const restartTest = () => {
    setStage(TestStage.INTRO);
    setAnswers({
      personality: [],
      world: [],
      talent: [],
      destiny: []
    });
    setResult(null);
  };

  // 根据当前阶段渲染对应页面
  const renderCurrentStage = () => {
    switch (stage) {
      case TestStage.INTRO:
        return <IntroPage onStart={() => setStage(TestStage.PERSONALITY)} />;
      case TestStage.PERSONALITY:
        return <TestPage 
          section="personality"
          onAnswer={(answer) => handleAnswer('personality', answer)}
        />;
      case TestStage.WORLD:
        return <TestPage 
          section="world"
          onAnswer={(answer) => handleAnswer('world', answer)}
        />;
      case TestStage.TALENT:
        return <TestPage 
          section="talent"
          onAnswer={(answer) => handleAnswer('talent', answer)}
        />;
      case TestStage.DESTINY:
        return <TestPage 
          section="destiny"
          onAnswer={(answer) => handleAnswer('destiny', answer)}
        />;
      case TestStage.RESULT:
        return <ResultPage result={result} onRestart={restartTest} />;
      default:
        return <IntroPage onStart={() => setStage(TestStage.PERSONALITY)} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentStage()}
    </div>
  );
}

export default App; 