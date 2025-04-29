import React, { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { Button, Typography, Steps, Progress, Spin } from 'antd';
import { motion } from 'framer-motion';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import ImageDisplay from './ImageDisplay'; // 导入图片显示组件

const { Title, Paragraph } = Typography;
const { Step } = Steps;

// --- Enums and Interfaces ---

enum Stage {
  QUESTIONS = 'questions',
  SIMULATION = 'simulation',
  CHOICE = 'choice',
  END = 'end'
}

enum QuestionSection {
  PERSONALITY = 'personality',
  WORLD = 'world',
  TALENT = 'talent',
  DESTINY = 'destiny'
}

interface AnswersType {
  [QuestionSection.PERSONALITY]: number[];
  [QuestionSection.WORLD]: number[];
  [QuestionSection.TALENT]: number[];
  [QuestionSection.DESTINY]: number[];
}

interface ResultType {
  world: string;
  talent: string;
  // ... other result details ...
}

interface LifeEvent {
  age: string; // e.g., "5岁", "关键选择", "结局"
  description: string;
  isChoiceNode?: boolean; // 标记此事件后是否需要选择
  choiceNodeId?: string; // 关联的选择节点ID
}

interface ChoiceOption {
  text: string;
  outcomeDescription: string; // 选择后的直接结果描述
  nextEvents: LifeEvent[]; // 选择后的事件序列
}

interface ChoiceNode {
  id: string;
  title: string;
  description: string;
  options: ChoiceOption[];
}

// --- Styled Components (极简风格) ---

const PageContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
`;

const StageTitle = styled(Title)`
  color: #e0e0e0; // 更亮的白色
  text-align: center;
  font-size: 2.8rem; // 更大
  margin-bottom: 2.5rem; // 增加间距
  font-weight: 700;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
`;

const QuestionCard = styled(motion.div)`
  background: rgba(30, 30, 60, 0.7);
  padding: 2.5rem; // 增加内边距
  border-radius: 16px;
  border: 1px solid rgba(186, 104, 200, 0.4);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  margin-bottom: 2rem;
`;

const QuestionText = styled(Paragraph)`
  color: #f0f0f0; // 更亮的文字
  font-size: 1.3rem; // 更大
  margin-bottom: 2rem;
  font-weight: 500;
`;

const AnswerButton = styled(Button)`
  // ... (样式保持或微调，确保清晰)
  background: rgba(80, 10, 120, 0.5);
  border: 1px solid rgba(186, 104, 200, 0.5);
  color: white;
  width: 100%;
  margin: 0.7rem 0;
  padding: 1.2rem;
  height: auto;
  white-space: normal;
  text-align: left;
  font-size: 1.1rem;
  border-radius: 10px;
  transition: all 0.3s ease;
  &:hover {
    background: rgba(120, 20, 180, 0.7);
    border-color: #ba68c8;
    transform: translateY(-2px);
  }
`;

const SimulationContainer = styled(motion.div)`
  text-align: center;
`;

const EventCard = styled(motion.div)`
  background: rgba(40, 40, 70, 0.8);
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  border: 1px solid rgba(186, 104, 200, 0.3);
`;

const EventAge = styled(Title)`
  color: #ba68c8 !important; // 强制颜色
  font-size: 1.8rem !important; // 增加大小
  margin-bottom: 1rem !important;
  font-weight: 700 !important;
`;

const EventDescription = styled(Paragraph)`
  color: #e5e5e5; // 亮白色
  font-size: 1.2rem; // 更大
  line-height: 1.8;
  margin-bottom: 1.5rem;
`;

const NextButton = styled(Button)`
  background: linear-gradient(90deg, #ba68c8 0%, #673ab7 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 1rem 3rem;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(186, 104, 200, 0.3);
  margin-top: 1.5rem;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(186, 104, 200, 0.4);
  }
`;

const ChoiceModal = styled(motion.div)`
  background: rgba(25, 25, 55, 0.9);
  padding: 3rem;
  border-radius: 16px;
  margin-top: 2rem;
  border: 1px solid rgba(186, 104, 200, 0.6);
`;

const ChoiceTitle = styled(Title)`
  color: #ba68c8 !important;
  text-align: center;
  font-size: 2rem !important;
  margin-bottom: 1.5rem !important;
`;

const ChoiceDescription = styled(Paragraph)`
  color: #e0e0e0;
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const ChoiceOptionButton = styled(AnswerButton)` // 复用样式
  background: rgba(100, 30, 160, 0.6);
  &:hover {
    background: rgba(130, 50, 190, 0.8);
  }
`;

const EndScreenContainer = styled(motion.div)`
  text-align: center;
  padding: 3rem;
  background: rgba(30, 30, 60, 0.8);
  border-radius: 16px;
`;

const FinalImageContainer = styled.div`
  max-width: 500px;
  margin: 1rem auto 2rem auto;
`;

// --- Dummy Data (需替换为实际逻辑) ---

const questions = {
  [QuestionSection.PERSONALITY]: [
    { question: "面对突发危险，你会采取什么行动？", answers: ["直接面对", "先观察", "凭直觉", "求助"] },
    { question: "你更倾向于哪种力量？", answers: ["破坏", "恢复", "操控环境", "辅助"] },
  ],
  [QuestionSection.WORLD]: [
    { question: "希望穿越到什么样的世界？", answers: ["魔法", "科技", "武侠", "诡异"] },
  ],
  [QuestionSection.TALENT]: [
    { question: "倾向哪种特殊能力？", answers: ["元素", "精神", "物理", "时空"] },
  ],
  [QuestionSection.DESTINY]: [
    { question: "认为自己的命运走向？", answers: ["英雄", "追求力量", "平凡", "建立势力"] },
  ]
};

// 预设的关键节点选项 (示例)
const choiceNodes: Record<string, ChoiceNode> = {
  'choice_age_30_magic': {
    id: 'choice_age_30_magic',
    title: "30岁：魔法之路的关键抉择",
    description: "你的魔法已小有成就，是时候决定未来的方向了：",
    options: [
      {
        text: "钻研禁忌的黑暗魔法",
        outcomeDescription: "你踏入了黑暗魔法的领域，力量飞速增长，但也引来了魔法议会的注意。",
        nextEvents: [
          { age: "35岁", description: "熟练掌握黑暗魔法，击败了一名追捕你的圣殿骑士。" },
          { age: "40岁", description: "成为黑暗魔法大师，但心智也受到侵蚀。", isChoiceNode: true, choiceNodeId: 'choice_dark_master' }, // 下一个选择点
        ]
      },
      {
        text: "追求光明的神圣魔法",
        outcomeDescription: "你选择侍奉光明，加入了神圣教团，学习治愈与守护的魔法。",
        nextEvents: [
          { age: "35岁", description: "成为教团的中坚力量，治愈了无数伤者。" },
          { age: "50岁", description: "晋升为大主教，成为一方信仰的象征。" },
          { age: "结局", description: "你一生致力于传播光明，最终在信徒的祈祷中安详离世，灵魂升入神国。" }
        ]
      },
      // ... 更多选项 ...
    ]
  },
  'choice_dark_master': { // 第二个选择点示例
      id: 'choice_dark_master',
      title: "40岁：黑暗大师的最终道路",
      description: "你已是黑暗魔法的顶尖存在，现在面临最后的选择：",
      options: [
          { text: "挑战魔王，夺取王座", outcomeDescription: "你向现任魔王发起挑战。", nextEvents: [{ age: "结局", description: "一场惊天动地的战斗后，你险胜魔王，成为了新的黑暗君主，统治了魔界千年。" }] },
          { text: "寻求救赎，净化自身", outcomeDescription: "你尝试用仅存的光明力量净化黑暗。", nextEvents: [{ age: "结局", description: "在痛苦的挣扎中，你成功净化了部分黑暗，但力量大减，最终隐居山林，默默守护一方。" }] }
      ]
  }
  // ... 其他选择节点 ...
};

// --- Component Logic ---

const IsekaiPage: React.FC = () => {
  const [stage, setStage] = useState<Stage>(Stage.QUESTIONS);
  const [currentSection, setCurrentSection] = useState<QuestionSection>(QuestionSection.PERSONALITY);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswersType>({
    [QuestionSection.PERSONALITY]: [],
    [QuestionSection.WORLD]: [],
    [QuestionSection.TALENT]: [],
    [QuestionSection.DESTINY]: []
  });

  const [result, setResult] = useState<ResultType | null>(null);
  const [lifeEvents, setLifeEvents] = useState<LifeEvent[]>([]); // 完整的潜在事件列表
  const [displayedEvents, setDisplayedEvents] = useState<LifeEvent[]>([]); // 已展示的事件
  const [currentEventIndex, setCurrentEventIndex] = useState(-1); // 指向 displayedEvents 的最后一个

  const [isAtChoice, setIsAtChoice] = useState(false);
  const [currentChoiceData, setCurrentChoiceData] = useState<ChoiceNode | null>(null);

  const [userId] = useState<string>(`user-${Math.random().toString(36).substring(2, 9)}`);

  // -- Helper Functions --

  // 重置所有状态
  const resetState = useCallback(() => {
    setStage(Stage.QUESTIONS);
    setCurrentSection(QuestionSection.PERSONALITY);
    setCurrentQuestionIndex(0);
    setAnswers({ [QuestionSection.PERSONALITY]: [], [QuestionSection.WORLD]: [], [QuestionSection.TALENT]: [], [QuestionSection.DESTINY]: [] });
    setResult(null);
    setLifeEvents([]);
    setDisplayedEvents([]);
    setCurrentEventIndex(-1);
    setIsAtChoice(false);
    setCurrentChoiceData(null);
  }, []);

  // 生成初始结果和事件（简化版）
  const generateInitialResultAndEvents = useCallback(() => {
    // TODO: 根据 answers 生成 result (world, talent)
    const generatedResult: ResultType = {
      world: "魔法奇幻世界", // 示例
      talent: "精神力量", // 示例
    };
    setResult(generatedResult);

    // TODO: 根据 result 生成初始 lifeEvents 序列
    const initialEvents: LifeEvent[] = [
      { age: "5岁", description: `你在${generatedResult.world}出生，拥有微弱的${generatedResult.talent}天赋。` },
      { age: "10岁", description: "开始接触基础知识，天赋逐渐显现。" },
      { age: "15岁", description: "进入学院学习，遇到了重要的导师。" },
      { age: "20岁", description: "外出历练，首次遭遇真正的危险。" },
      { age: "25岁", description: "完成一项重要成就，声名鹊起。" },
      { age: "30岁", description: "站在人生的十字路口，需要做出关键抉择。", isChoiceNode: true, choiceNodeId: 'choice_age_30_magic' }, // 标记为选择节点
      // 后续事件将在选择后添加
    ];
    setLifeEvents(initialEvents);

    // 显示第一个事件
    setDisplayedEvents([initialEvents[0]]);
    setCurrentEventIndex(0);
    setStage(Stage.SIMULATION);
  }, []);

  // 处理回答
  const handleAnswer = (answerIndex: number) => {
    const currentQuestions = questions[currentSection];
    const updatedAnswers = {
      ...answers,
      [currentSection]: [...answers[currentSection], answerIndex]
    };
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 进入下一部分或结束答题
      const sections = Object.values(QuestionSection);
      const currentSectionIndex = sections.indexOf(currentSection);
      if (currentSectionIndex < sections.length - 1) {
        setCurrentSection(sections[currentSectionIndex + 1]);
        setCurrentQuestionIndex(0);
      } else {
        // 所有问题回答完毕
        generateInitialResultAndEvents();
      }
    }
  };

  // 处理"下一步"
  const handleNextEvent = useCallback(() => {
    if (currentEventIndex >= lifeEvents.length - 1) {
      setStage(Stage.END); // 到达事件列表末尾
      return;
    }

    const nextPotentialEventIndex = currentEventIndex + 1;
    const nextEvent = lifeEvents[nextPotentialEventIndex];

    if (nextEvent.isChoiceNode && nextEvent.choiceNodeId) {
      // 到达选择节点
      const choiceData = choiceNodes[nextEvent.choiceNodeId];
      if (choiceData) {
        setCurrentChoiceData(choiceData);
        setIsAtChoice(true);
        setStage(Stage.CHOICE); // 切换到选择阶段
      } else {
        // 没找到选择节点，跳过，直接显示下一个事件（错误处理）
        console.error("Choice node not found:", nextEvent.choiceNodeId);
        if (nextPotentialEventIndex < lifeEvents.length - 1) {
            setDisplayedEvents(prev => [...prev, lifeEvents[nextPotentialEventIndex + 1]]);
            setCurrentEventIndex(nextPotentialEventIndex + 1);
        } else {
            setStage(Stage.END);
        }
      }
    } else {
      // 普通事件，直接添加到显示列表
      setDisplayedEvents(prev => [...prev, nextEvent]);
      setCurrentEventIndex(nextPotentialEventIndex);
       if (nextPotentialEventIndex === lifeEvents.length - 1) {
         // 如果这是最后一个事件，直接标记为结束
         setTimeout(() => setStage(Stage.END), 1500); // 稍作停留后结束
       }
    }
  }, [currentEventIndex, lifeEvents]);

  // 处理玩家选择
  const handleMakeChoice = useCallback((optionIndex: number) => {
    if (!currentChoiceData || !result) return;

    const selectedOption = currentChoiceData.options[optionIndex];

    // 1. 将选择结果描述作为一个事件添加到 displayedEvents
    const outcomeEvent: LifeEvent = {
      age: "关键决策",
      description: selectedOption.outcomeDescription
    };
    setDisplayedEvents(prev => [...prev, outcomeEvent]);
    const outcomeEventDisplayIndex = currentEventIndex + 1;
    setCurrentEventIndex(outcomeEventDisplayIndex);

    // 2. 更新 lifeEvents 序列 (将选择后的事件插入)
    // 找到当前选择节点在 lifeEvents 中的索引
    const choiceNodeIndexInLifeEvents = lifeEvents.findIndex(event => event.choiceNodeId === currentChoiceData.id);
    if (choiceNodeIndexInLifeEvents !== -1) {
      // 移除选择节点本身及之后的所有事件（因为路径改变了）
      const eventsBeforeChoice = lifeEvents.slice(0, choiceNodeIndexInLifeEvents);
      // 组合新路径
      const newLifePath = [...eventsBeforeChoice, outcomeEvent, ...selectedOption.nextEvents];
      setLifeEvents(newLifePath);
    } else {
        // 如果找不到原始选择节点，将新事件附加到末尾
        const newLifePath = [...lifeEvents, outcomeEvent, ...selectedOption.nextEvents];
        setLifeEvents(newLifePath);
    }

    // 3. 重置选择状态，回到模拟阶段
    setIsAtChoice(false);
    setCurrentChoiceData(null);
    setStage(Stage.SIMULATION);

  }, [currentChoiceData, currentEventIndex, lifeEvents, result]);

  // -- Render Functions --

  const renderQuestionPage = () => {
    const currentQuestions = questions[currentSection];
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const totalQuestions = Object.values(questions).flat().length;
    const answeredQuestions = Object.values(answers).flat().length;
    const progress = Math.floor((answeredQuestions / totalQuestions) * 100);

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <StageTitle>回答问题</StageTitle>
        <Steps current={Object.values(QuestionSection).indexOf(currentSection)} style={{ marginBottom: '2rem' }}>
          {Object.values(QuestionSection).map(sec => <Step key={sec} title={sec.charAt(0).toUpperCase() + sec.slice(1)} />)}
        </Steps>
        <Progress percent={progress} status="active" strokeColor="#ba68c8" style={{ marginBottom: '2rem' }} />
        <QuestionCard>
          <Title level={4} style={{ color: '#ba68c8', marginBottom: '1rem' }}>
            {currentSection.toUpperCase()} - 问题 {currentQuestionIndex + 1}/{currentQuestions.length}
          </Title>
          <QuestionText>{currentQuestion.question}</QuestionText>
          {currentQuestion.answers.map((answer, index) => (
            <AnswerButton key={index} onClick={() => handleAnswer(index)}>{answer}</AnswerButton>
          ))}
        </QuestionCard>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
             <Button icon={<HomeOutlined />} onClick={resetState}>返回主页(重置)</Button>
         </div>
      </motion.div>
    );
  };

  const renderSimulationStage = () => {
    if (currentEventIndex < 0 || !displayedEvents[currentEventIndex] || !result) {
      return <Spin tip="正在生成人生轨迹..."></Spin>;
    }
    const currentEvent = displayedEvents[currentEventIndex];

    return (
      <SimulationContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <StageTitle>你的人生轨迹</StageTitle>
        <EventCard key={currentEventIndex}> {/* 使用 key 强制重新渲染动画 */}
          <EventAge>{currentEvent.age}</EventAge>
          <EventDescription>{currentEvent.description}</EventDescription>
          {/* 强制展示图片 */}
          <ImageDisplay
            sceneType={currentEvent.age === '穿越瞬间' ? 'isekai-moment' : currentEvent.isChoiceNode ? 'life-choice' : 'world-environment'} // 简化场景类型
            worldType={result.world}
            talent={result.talent}
            event={currentEvent.description} // 用事件描述做提示
            userId={userId}
          />
        </EventCard>
        {stage !== Stage.END && (
           <NextButton onClick={handleNextEvent}>下一步</NextButton>
        )}
      </SimulationContainer>
    );
  };

  const renderChoiceModal = () => {
    if (!currentChoiceData) return null;
    const currentEvent = displayedEvents[currentEventIndex]; // 获取触发选择的前一个事件用于配图

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
         {/* 显示触发选择的那个事件和图片 */} 
         {currentEvent && result && (
             <EventCard>
                 <EventAge>{currentEvent.age}</EventAge>
                 <EventDescription>{currentEvent.description}</EventDescription>
                 <ImageDisplay
                    sceneType={'life-choice'} // 标记为选择场景
                    worldType={result.world}
                    talent={result.talent}
                    event={currentEvent.description}
                    userId={userId}
                 />
            </EventCard>
         )}
        <ChoiceModal>
          <ChoiceTitle>{currentChoiceData.title}</ChoiceTitle>
          <ChoiceDescription>{currentChoiceData.description}</ChoiceDescription>
          {currentChoiceData.options.map((option, index) => (
            <ChoiceOptionButton key={index} onClick={() => handleMakeChoice(index)}>
              {option.text}
            </ChoiceOptionButton>
          ))}
        </ChoiceModal>
      </motion.div>
    );
  };

 const renderEndScreen = () => {
    const finalEvent = displayedEvents[displayedEvents.length - 1];
    return (
        <EndScreenContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
             <StageTitle>人生终点</StageTitle>
             {finalEvent && result && (
                <EventCard>
                    <EventAge>{finalEvent.age}</EventAge>
                    <EventDescription>{finalEvent.description}</EventDescription>
                    <FinalImageContainer>
                         <ImageDisplay
                            sceneType={'final-form'}
                            worldType={result.world}
                            talent={result.talent}
                            event={finalEvent.description}
                            userId={userId}
                        />
                    </FinalImageContainer>
                </EventCard>
            )}
            <NextButton icon={<HomeOutlined />} onClick={resetState}>重新开始穿越</NextButton>
        </EndScreenContainer>
    );
 };

  const renderCurrentStage = () => {
    switch (stage) {
      case Stage.QUESTIONS:
        return renderQuestionPage();
      case Stage.SIMULATION:
        return renderSimulationStage();
      case Stage.CHOICE:
        return renderChoiceModal();
       case Stage.END:
            return renderEndScreen();
      default:
        return <div>未知阶段</div>;
    }
  };

  return <PageContainer>{renderCurrentStage()}</PageContainer>;
};

export default IsekaiPage; 