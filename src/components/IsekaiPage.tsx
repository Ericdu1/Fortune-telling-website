import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from '@emotion/styled';
import { Button, Spin, Progress } from 'antd'; // 移除不必要的 antd 组件
import { motion } from 'framer-motion';
import { HomeOutlined } from '@ant-design/icons';
import ImageDisplay from './ImageDisplay';

// --- Enums and Interfaces (保持或微调) ---

enum Stage {
  QUESTIONS = 'questions',
  SIMULATION = 'simulation',
  // CHOICE 状态合并到 SIMULATION 中处理
  END = 'end'
}

enum QuestionSection {
  ATTRIBUTE_POINTS = 'attributes' // 简化问题阶段
}

// 属性定义
interface Attributes {
  strength: number; // 力量/体质
  intelligence: number; // 智力
  charisma: number; // 魅力/颜值
  luck: number; // 运气
  wealth: number; // 家境
}

// 简化为单一问题类型
interface Answer {
  text: string;
  attributeChanges: Partial<Attributes>; // 回答对属性的影响
}

interface Question {
  id: string;
  text: string;
  answers: Answer[];
}

interface ResultType {
  world: string;
  talent: string;
}

interface LifeEvent {
  age: number | string; // 可以是数字年龄或特殊标记
  description: string;
  attributeChanges?: Partial<Attributes>; // 事件对属性的影响
  isChoiceNode?: boolean;
  choiceNodeId?: string;
}

interface ChoiceOption {
  text: string;
  attributeChanges?: Partial<Attributes>; // 选择对属性的影响
  outcomeDescription: string;
  nextEvents: LifeEvent[];
}

interface ChoiceNode {
  id: string;
  title: string;
  description: string;
  options: ChoiceOption[];
  imagePromptEvent?: string; // 用于生成该选择节点图片的事件描述
}

// --- Styled Components (人生重开模拟器风格) ---

const PageContainer = styled.div`
  width: 100%;
  max-width: 700px; // 更窄以聚焦内容
  margin: 1rem auto;
  padding: 1rem;
  background-color: #282c34; // 深灰背景
  color: #e0e0e0;
  font-family: 'SimSun', 'Microsoft YaHei', sans-serif; // 模拟器常用字体
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
`;

const StageTitle = styled.h1`
  color: #e0e0e0;
  text-align: center;
  font-size: 2rem; // 调整以适合整体风格
  margin-bottom: 2rem;
  font-weight: 700;
`;

const QuestionText = styled.p`
  color: #f0f0f0;
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
  text-align: center;
`;

const AttributeBarContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 0.8rem 0.5rem;
  background-color: #3c3f41; // 稍亮灰色
  border-radius: 6px;
  margin-bottom: 1.5rem;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);
`;

const AttributeItem = styled.div`
  text-align: center;
  font-size: 0.95rem;
  color: #b0b3b8;
  span {
    font-weight: bold;
    color: #ffffff;
    margin-left: 4px;
  }
`;

const EventLogContainer = styled.div`
  height: 450px; // 固定高度，可滚动
  overflow-y: auto;
  border: 1px solid #444;
  background-color: #1e1e1e; // 更深背景
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 6px;
  scrollbar-width: thin; // 滚动条样式
  scrollbar-color: #666 #1e1e1e;
`;

const EventLogItem = styled(motion.div)`
  padding: 0.4rem 0;
  font-size: 1.05rem;
  line-height: 1.6;
  border-bottom: 1px dashed #3a3a3a; // 分隔线
  &:last-child {
    border-bottom: none;
  }
`;

const ChoiceAreaContainer = styled(motion.div)`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #444;
`;

const ChoiceTitle = styled.h3`
  color: #ffd700; // 金色标题
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.4rem;
`;

const ChoiceDescription = styled.p`
  color: #e0e0e0;
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
`;

const ChoiceButton = styled(Button)`
  display: block;
  width: 100%;
  margin: 0.6rem auto;
  background-color: #4a4d50;
  border-color: #666;
  color: #e0e0e0;
  font-size: 1rem;
  padding: 0.8rem;
  height: auto;
  text-align: center;
  border-radius: 4px;
  &:hover {
    background-color: #5a5d60;
    border-color: #888;
    color: #fff;
  }
`;

const EndScreenContainer = styled(motion.div)`
  padding: 2rem;
  text-align: center;
`;

const SummaryAttributeContainer = styled.div`
  background-color: #3c3f41;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
`;

const SummaryAttributeItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #555;
  font-size: 1.1rem;
  &:last-child {
    border-bottom: none;
  }
  span:first-of-type {
    color: #b0b3b8;
  }
  span:last-of-type {
    font-weight: bold;
    color: #ffffff;
  }
`;

const LifeSummaryText = styled.p`
  font-size: 1.2rem;
  margin: 1.5rem 0;
  color: #ccc;
`;

const RestartButton = styled(ChoiceButton)` // 复用样式
  margin-top: 2rem;
  background-color: #61dafb; // 亮蓝色
  border-color: #61dafb;
  color: #000;
  font-weight: bold;
  &:hover {
    background-color: #72e6fc;
    border-color: #72e6fc;
  }
`;

const FinalImageContainer = styled.div`
  max-width: 400px; // 结果图小一点
  margin: 1.5rem auto;
`;

// --- Placeholder Data ---

const initialQuestions: Question[] = [
  {
    id: 'q1', text: '你的出身似乎是？', answers: [
      { text: '普通城市家庭', attributeChanges: { wealth: 5, intelligence: 4, charisma: 4, strength: 4, luck: 3 } }, // 平衡
      { text: '乡村农家', attributeChanges: { wealth: 2, strength: 6, intelligence: 3, charisma: 3, luck: 4 } }, // 体力好
      { text: '富裕商贾之家', attributeChanges: { wealth: 8, intelligence: 5, charisma: 5, strength: 3, luck: 2 } }, // 有钱
      { text: '书香门第', attributeChanges: { wealth: 6, intelligence: 7, strength: 2, charisma: 4, luck: 4 } } // 聪明
    ]
  },
  {
    id: 'q2', text: '你童年最大的爱好是？', answers: [
      { text: '读书学习', attributeChanges: { intelligence: 2, strength: -1 } },
      { text: '户外运动', attributeChanges: { strength: 2, intelligence: -1 } },
      { text: '和朋友玩耍', attributeChanges: { charisma: 1, luck: 1 } },
      { text: '宅家幻想', attributeChanges: { luck: 2, charisma: -1 } }
    ]
  },
  {
      id: 'q3', text: '面对困难时，你倾向于？', answers: [
          { text: '独立解决', attributeChanges: { strength: 1, intelligence: 1, luck: -1 } },
          { text: '寻求帮助', attributeChanges: { charisma: 1 } },
          { text: '看运气', attributeChanges: { luck: 2, strength: -1, intelligence: -1 } },
          { text: '逃避', attributeChanges: { luck: -2 } }
      ]
  },
  {
      id: 'q4', text: '你认为什么最重要？', answers: [
          { text: '知识与智慧', attributeChanges: { intelligence: 2 } },
          { text: '财富与地位', attributeChanges: { wealth: 2 } },
          { text: '健康与力量', attributeChanges: { strength: 2 } },
          { text: '人缘与魅力', attributeChanges: { charisma: 2 } }
      ]
  },
];

const choiceNodes: Record<string, ChoiceNode> = {
  'choice_age_18_study': {
    id: 'choice_age_18_study', title: '18岁：高考后的抉择', description: '高考结束，你站在了人生的岔路口：', imagePromptEvent: "A young student contemplating their future after exams, crossroads concept", options: [
      { text: '听从父母，选择热门专业', attributeChanges: { wealth: 1, luck: -1 }, outcomeDescription: '你选择了热门但自己不喜欢的专业。', nextEvents: [ { age: 22, description: '大学毕业，找了一份普通的工作。' }, { age: 25, description: '工作压力大，开始感到迷茫。' }, { age: 30, description: '成家立业，生活平淡。' }, { age: "结局", description: '在平凡中度过一生。' }] },
      { text: '追求梦想，选择冷门爱好', attributeChanges: { intelligence: 1, luck: 1 }, outcomeDescription: '你选择了自己热爱的冷门专业。', nextEvents: [ { age: 22, description: '毕业后在领域内小有成就。' }, { age: 28, description: '遇到瓶颈，但坚持不懈。' }, { age: 35, description: '终于取得突破，成为领域专家。' }, { age: "结局", description: '一生为热爱的事业奋斗，有所成就。' }] },
      { text: '放弃升学，直接闯荡社会', attributeChanges: { strength: 1, wealth: -1 }, outcomeDescription: '你决定提前进入社会打拼。', nextEvents: [ { age: 20, description: '尝试多种工作，积累了经验。' }, { age: 25, description: '抓住机遇，开始创业。' }, { age: 32, description: '创业有成，小有财富。' , isChoiceNode: true, choiceNodeId: 'choice_success_biz'}, { age: "结局", description: '商海沉浮，最终财富自由。' }] }
    ]
  },
  'choice_success_biz': { // 另一个示例
      id: 'choice_success_biz', title: '32岁：商业成功的诱惑', description: '你的事业蒸蒸日上，但新的诱惑也随之而来：', imagePromptEvent: "A successful business person in a modern office facing a tempting offer", options: [
          { text: "继续稳健经营", attributeChanges: {luck: 1}, outcomeDescription: "你选择稳扎稳打。", nextEvents: [{age: 40, description: "公司规模扩大，成为行业翘楚。"}, {age: "结局", description: "成为一代商业巨子，安享晚年。"}]},
          { text: "冒险扩张，涉足灰色地带", attributeChanges: {wealth: 3, luck: -2}, outcomeDescription: "你决定铤而走险，追求更大利润。", nextEvents: [{age: 35, description: "短期获利丰厚，但也引起监管注意。"}, {age: 38, description: "因违规操作，公司遭遇重创，身陷囹圄。"}, {age: "结局", description: "在牢狱中度过余生。"}] }
      ]
  }
};

// --- Component Logic ---

const IsekaiPage: React.FC = () => {
  const [stage, setStage] = useState<Stage>(Stage.QUESTIONS);
  const [questionsList] = useState<Question[]>(initialQuestions); // 问题列表
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [attributes, setAttributes] = useState<Attributes>({ strength: 5, intelligence: 5, charisma: 5, luck: 5, wealth: 5 }); // 初始默认值

  const [result, setResult] = useState<ResultType | null>(null); // 异世界结果 (简化，暂不使用)
  const [lifeEvents, setLifeEvents] = useState<LifeEvent[]>([]); // 完整事件链
  const [displayedEvents, setDisplayedEvents] = useState<LifeEvent[]>([]); // 已显示事件日志

  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [currentTimeoutId, setCurrentTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [isAtChoice, setIsAtChoice] = useState(false);
  const [currentChoiceData, setCurrentChoiceData] = useState<ChoiceNode | null>(null);

  const eventLogRef = useRef<HTMLDivElement>(null); // 用于自动滚动
  const [userId] = useState<string>(`user-${Math.random().toString(36).substring(2, 9)}`);

  // -- Helper Functions --

  // 应用属性变化
  const applyAttributeChanges = useCallback((changes: Partial<Attributes> | undefined) => {
    if (!changes) return;
    setAttributes(prev => {
      const next = { ...prev };
      for (const key in changes) {
        next[key as keyof Attributes] = Math.max(0, Math.min(10, (next[key as keyof Attributes] || 0) + (changes[key as keyof Attributes] || 0))); // 0-10 范围
      }
      return next;
    });
  }, []);

  // 重置状态
  const resetState = useCallback(() => {
    if (currentTimeoutId) clearTimeout(currentTimeoutId);
    setStage(Stage.QUESTIONS);
    setCurrentQuestionIndex(0);
    setAttributes({ strength: 5, intelligence: 5, charisma: 5, luck: 5, wealth: 5 });
    setResult(null);
    setLifeEvents([]);
    setDisplayedEvents([]);
    setIsAutoPlaying(false);
    setCurrentTimeoutId(null);
    setIsAtChoice(false);
    setCurrentChoiceData(null);
  }, [currentTimeoutId]);

  // 生成初始人生事件链 (实现基础逻辑)
  const generateLifeEvents = useCallback((initialAttrs: Attributes) => {
    // 简单示例逻辑：根据初始属性生成几条基础事件
    const events: LifeEvent[] = [];
    events.push({ age: 0, description: '在一个平凡的世界，你出生了。' });

    if (initialAttrs.wealth >= 7) {
      events.push({ age: 3, description: '家境优渥，你从小衣食无忧。' });
    } else if (initialAttrs.wealth <= 3) {
      events.push({ age: 3, description: '家境贫寒，童年生活比较拮据。' });
    }

    events.push({ age: 6, description: '你开始上小学了。' });

    if (initialAttrs.intelligence >= 7) {
      events.push({ age: 8, description: '你在学习上展现出过人的天赋。' });
    } else if (initialAttrs.intelligence <= 3) {
      events.push({ age: 8, description: '学习似乎对你来说有点困难。' });
    }

    if (initialAttrs.strength >= 7) {
      events.push({ age: 10, description: '你精力充沛，是学校里的运动健将。' });
    }

    if (initialAttrs.charisma >= 7) {
      events.push({ age: 12, description: '你很受欢迎，身边总围绕着一群朋友。' });
    }

    events.push({ age: 15, description: '初中毕业，面临第一次重要的升学选择。' });

    // 添加触发关键选择节点的事件
    events.push({ age: 18, description: '高考结束，你站在人生的第一个重要岔路口。' , isChoiceNode: true, choiceNodeId: 'choice_age_18_study'});

    setLifeEvents(events);
    setIsAutoPlaying(true); // 开始自动播放
    setStage(Stage.SIMULATION);
  }, []);

  // 处理回答（用于设置初始属性）
  const handleAnswer = (answer: Answer) => {
    applyAttributeChanges(answer.attributeChanges);

    if (currentQuestionIndex < questionsList.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 所有问题回答完毕，生成初始事件并开始模拟
      generateLifeEvents(attributes);
    }
  };

  // 自动推进事件日志
  useEffect(() => {
    if (stage === Stage.SIMULATION && isAutoPlaying && !isAtChoice) {
      const nextEventIndex = displayedEvents.length;
      if (nextEventIndex < lifeEvents.length) {
        const nextEvent = lifeEvents[nextEventIndex];
        const delay = nextEvent.description.length * 50 + 500; // 根据文字长度调整延迟

        const timeoutId = setTimeout(() => {
          // 显示新事件
          setDisplayedEvents(prev => [...prev, nextEvent]);
          // 应用事件的属性变化
          applyAttributeChanges(nextEvent.attributeChanges);

          // 检查是否是选择节点
          if (nextEvent.isChoiceNode && nextEvent.choiceNodeId) {
            const choiceData = choiceNodes[nextEvent.choiceNodeId];
            if (choiceData) {
              setCurrentChoiceData(choiceData);
              setIsAtChoice(true);
              setIsAutoPlaying(false); // 暂停自动播放
            } else {
              console.error("Choice node not found:", nextEvent.choiceNodeId);
              // 如果没找到选择，继续自动播放下一个（如果存在）
              // 这里可以加一个错误处理事件
            }
          } else if (nextEventIndex + 1 >= lifeEvents.length || nextEvent.age === "结局") {
            // 到达终点
             setIsAutoPlaying(false);
             setStage(Stage.END);
          }

        }, delay);
        setCurrentTimeoutId(timeoutId);
      } else {
        // 所有事件都已展示
        setIsAutoPlaying(false);
        setStage(Stage.END);
      }
    }

    // 清理 timeout
    return () => {
      if (currentTimeoutId) {
        clearTimeout(currentTimeoutId);
      }
    };
  }, [stage, isAutoPlaying, isAtChoice, displayedEvents, lifeEvents, applyAttributeChanges, currentTimeoutId]);

  // 自动滚动日志到底部
  useEffect(() => {
    if (eventLogRef.current) {
      eventLogRef.current.scrollTop = eventLogRef.current.scrollHeight;
    }
  }, [displayedEvents]);

  // 处理玩家选择
  const handleMakeChoice = useCallback((optionIndex: number) => {
    if (!currentChoiceData) return;

    const selectedOption = currentChoiceData.options[optionIndex];

    // 1. 添加选择结果描述到日志
    const outcomeEvent: LifeEvent = {
      age: "选择结果",
      description: selectedOption.outcomeDescription
    };
    setDisplayedEvents(prev => [...prev, outcomeEvent]);

    // 2. 应用选择的属性变化
    applyAttributeChanges(selectedOption.attributeChanges);

    // 3. 更新后续事件链
    const currentEventLogIndex = displayedEvents.length; // 当前显示到的事件索引+1
    // 找到触发选择的那个事件在原始lifeEvents中的索引（近似）
    // 注意：这里简化处理，认为当前日志最后一条是选择节点前的最后事件
    // 更精确需要记录触发选择的原始事件索引
    const choiceTriggerEventIndex = lifeEvents.findIndex(e => e.choiceNodeId === currentChoiceData.id);
    let baseEvents = [];
    if (choiceTriggerEventIndex !== -1) {
        baseEvents = lifeEvents.slice(0, choiceTriggerEventIndex + 1); // 保留到触发节点（包含）
    } else {
        // 如果找不到，就用当前日志作为基础（可能不精确）
        baseEvents = displayedEvents;
    }
    // 合并结果描述和新分支
    const newLifePath = [...baseEvents, outcomeEvent, ...selectedOption.nextEvents];
    setLifeEvents(newLifePath);

    // 4. 恢复自动播放
    setIsAtChoice(false);
    setCurrentChoiceData(null);
    setIsAutoPlaying(true);

  }, [currentChoiceData, displayedEvents, lifeEvents, applyAttributeChanges]);

  // -- Render Functions --

  const renderQuestionPage = () => {
    if (currentQuestionIndex >= questionsList.length) {
      // 理论上不应到达这里，因为最后一个问题后会转到simulation
      return <Spin tip="正在准备人生..."></Spin>;
    }
    const currentQuestion = questionsList[currentQuestionIndex];

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <StageTitle>设定初始属性</StageTitle>
        <QuestionText>{currentQuestion.text}</QuestionText>
        {currentQuestion.answers.map((answer, index) => (
          <ChoiceButton key={index} onClick={() => handleAnswer(answer)}>{answer.text}</ChoiceButton>
        ))}
         <Progress 
             percent={((currentQuestionIndex + 1) / questionsList.length) * 100}
             showInfo={false}
             strokeColor="#61dafb"
             style={{ marginTop: '2rem' }}
         />
      </motion.div>
    );
  };

  const renderSimulationStage = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <AttributeBarContainer>
        <AttributeItem>力量: <span>{attributes.strength}</span></AttributeItem>
        <AttributeItem>智力: <span>{attributes.intelligence}</span></AttributeItem>
        <AttributeItem>魅力: <span>{attributes.charisma}</span></AttributeItem>
        <AttributeItem>运气: <span>{attributes.luck}</span></AttributeItem>
        <AttributeItem>家境: <span>{attributes.wealth}</span></AttributeItem>
      </AttributeBarContainer>
      <EventLogContainer ref={eventLogRef}>
        {displayedEvents.map((event, index) => (
          <EventLogItem
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }} // 延迟出现
          >
            {typeof event.age === 'number' ? `${event.age}岁: ` : ``}{event.description}
          </EventLogItem>
        ))}
        {/* 加载中的提示 */} 
        {isAutoPlaying && stage === Stage.SIMULATION && <Spin size="small" style={{ display: 'block', marginTop: '10px' }} />}
      </EventLogContainer>
      {isAtChoice && currentChoiceData && (
        <ChoiceAreaContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
           <ChoiceTitle>{currentChoiceData.title}</ChoiceTitle>
           {/* 关键选择图片 */}
           <FinalImageContainer>
                <ImageDisplay
                   sceneType="life-choice"
                   worldType={result?.world || ''} // 尝试获取世界类型
                   talent={result?.talent || ''} // 尝试获取天赋
                   event={currentChoiceData.imagePromptEvent || currentChoiceData.description}
                   userId={userId}
               />
           </FinalImageContainer>
           <ChoiceDescription>{currentChoiceData.description}</ChoiceDescription>
           {currentChoiceData.options.map((option, index) => (
               <ChoiceButton key={index} onClick={() => handleMakeChoice(index)}>{option.text}</ChoiceButton>
           ))}
       </ChoiceAreaContainer>
      )}
    </motion.div>
  );

 const renderEndScreen = () => {
    const finalEvent = displayedEvents[displayedEvents.length - 1];
    const lifespan = typeof finalEvent?.age === 'number' ? finalEvent.age : '未知';
    // 简单总评计算
    const totalScore = Object.values(attributes).reduce((sum, val) => sum + val, 0);
    const rating = totalScore >= 40 ? '传奇' : totalScore >= 30 ? '优秀' : totalScore >= 20 ? '普通' : '坎坷';

    return (
        <EndScreenContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
             <StageTitle>人生总结</StageTitle>
             <SummaryAttributeContainer>
                 <SummaryAttributeItem><span>力量:</span> <span>{attributes.strength}</span></SummaryAttributeItem>
                 <SummaryAttributeItem><span>智力:</span> <span>{attributes.intelligence}</span></SummaryAttributeItem>
                 <SummaryAttributeItem><span>魅力:</span> <span>{attributes.charisma}</span></SummaryAttributeItem>
                 <SummaryAttributeItem><span>运气:</span> <span>{attributes.luck}</span></SummaryAttributeItem>
                 <SummaryAttributeItem><span>家境:</span> <span>{attributes.wealth}</span></SummaryAttributeItem>
             </SummaryAttributeContainer>
             <LifeSummaryText>享年: {lifespan}岁</LifeSummaryText>
             <LifeSummaryText>人生总评: {totalScore} ({rating})</LifeSummaryText>
            {/* 最终总结图片 */} 
             <FinalImageContainer>
                 <ImageDisplay
                    sceneType="final-form"
                    worldType={result?.world || ''}
                    talent={result?.talent || ''}
                    event={`最终人生总结: ${rating}, 享年${lifespan}`}
                    userId={userId}
                />
            </FinalImageContainer>
            <RestartButton icon={<HomeOutlined />} onClick={resetState}>再次重开</RestartButton>
        </EndScreenContainer>
    );
 };

  const renderCurrentStage = () => {
    switch (stage) {
      case Stage.QUESTIONS:
        return renderQuestionPage();
      case Stage.SIMULATION:
      case Stage.END: // 结束界面也需要显示模拟过程的最终状态和总结
          // 注意：END 阶段理论上应该渲染 renderEndScreen，但为了保持模拟器的连续性，
          // 可以考虑将总结信息叠加在 Simulation 视图之上，或者单独渲染。
          // 此处简化为直接渲染对应函数。
          if (stage === Stage.END) return renderEndScreen();
          return renderSimulationStage();
      default:
        return <div>加载中或未知阶段...</div>;
    }
  };

  return <PageContainer>{renderCurrentStage()}</PageContainer>;
};

export default IsekaiPage; 