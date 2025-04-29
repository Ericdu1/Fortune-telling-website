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

// --- New Placeholder Data (前世今生主题) ---

const initialQuestions: Question[] = [
  {
    id: 'q1', text: '回顾你的前世，你最终的结局是？', answers: [
      { text: '寿终正寝，平静离世', attributeChanges: { luck: 1, strength: -1 } },
      { text: '意外身亡，充满不甘', attributeChanges: { luck: -2, strength: 1 } },
      { text: '功成名就，名垂青史', attributeChanges: { wealth: 1, charisma: 1, intelligence: 1 } },
      { text: '默默无闻，无人知晓', attributeChanges: { wealth: -1, charisma: -1 } }
    ]
  },
  {
    id: 'q2', text: '前世你的主要职业或身份更接近？', answers: [
      { text: '钻研知识的学者/法师', attributeChanges: { intelligence: 3, strength: -1 } },
      { text: '保家卫国的战士/骑士', attributeChanges: { strength: 3, intelligence: -1 } },
      { text: '精打细算的商人/工匠', attributeChanges: { wealth: 3, charisma: -1 } },
      { text: '善于交际的艺术家/外交官', attributeChanges: { charisma: 3, wealth: -1 } }
    ]
  },
  {
    id: 'q3', text: '前世最大的遗憾是什么？', answers: [
      { text: '未能实现毕生的追求', attributeChanges: { intelligence: 1, luck: -1 } },
      { text: '错过了重要的人或感情', attributeChanges: { charisma: 1, luck: -1 } },
      { text: '未能保护好珍视之物', attributeChanges: { strength: 1, luck: -1 } },
      { text: '一生过于平凡缺少波澜', attributeChanges: { luck: 1 } } // 遗憾平凡反而增加运气
    ]
  },
  {
    id: 'q4', text: '如果可以，你最希望在新世界获得什么？', answers: [
      { text: '毁天灭地的绝对力量', attributeChanges: { strength: 3 } },
      { text: '通晓万物的无上智慧', attributeChanges: { intelligence: 3 } },
      { text: '颠倒众生的绝世魅力', attributeChanges: { charisma: 3 } },
      { text: '取之不尽的惊人财富', attributeChanges: { wealth: 3 } },
      { text: '逆转乾坤的滔天运气', attributeChanges: { luck: 3 } }
    ]
  },
   {
    id: 'q5', text: '面对一个全新的未知世界，你的第一反应是？', answers: [
      { text: '谨慎观察，收集信息', attributeChanges: { intelligence: 1, luck: 1 } },
      { text: '大胆探索，寻找机遇', attributeChanges: { strength: 1, luck: -1 } },
      { text: '寻找当地势力寻求帮助或庇护', attributeChanges: { charisma: 1, wealth: 1 } },
      { text: '尝试建立自己的规则和秩序', attributeChanges: { intelligence: 1, strength: 1 } }
    ]
  },
  {
    id: 'q6', text: '你更倾向于依赖什么来解决问题？', answers: [
      { text: '逻辑分析与计划', attributeChanges: { intelligence: 2 } },
      { text: '直觉与灵感', attributeChanges: { luck: 2 } },
      { text: '力量与行动', attributeChanges: { strength: 2 } },
      { text: '人脉与沟通', attributeChanges: { charisma: 2 } }
    ]
  },
  {
    id: 'q7', text: '在新世界中，你更看重？', answers: [
      { text: '个人的成长与强大', attributeChanges: { strength: 1, intelligence: 1 } },
      { text: '人际关系与情感连接', attributeChanges: { charisma: 1, luck: 1 } },
      { text: '财富积累与物质享受', attributeChanges: { wealth: 2 } },
      { text: '探索未知与追求真理', attributeChanges: { intelligence: 1, luck: 1 } }
    ]
  },
  {
    id: 'q8', text: '你认为运气在人生中扮演什么角色？', answers: [
      { text: '决定性因素，实力不值一提', attributeChanges: { luck: 3, strength: -1, intelligence: -1 } },
      { text: '重要，但实力是基础', attributeChanges: { luck: 1 } },
      { text: '不重要，我命由我不由天', attributeChanges: { strength: 1, intelligence: 1, luck: -1 } },
      { text: '可以通过努力改变', attributeChanges: { intelligence: 1, luck: 1 } }
    ]
  },
  {
    id: 'q9', text: '面对诱惑（如禁忌知识、强大力量），你会？', answers: [
      { text: '坚守底线，果断拒绝', attributeChanges: { intelligence: 1, luck: 1 } },
      { text: '谨慎评估，可能尝试', attributeChanges: { luck: -1 } },
      { text: '欣然接受，力量至上', attributeChanges: { strength: 2, luck: -2 } },
      { text: '试图掌控它，化为己用', attributeChanges: { intelligence: 2, luck: -1 } }
    ]
  },
  {
    id: 'q10', text: '如果可以选择新世界的初始身份，你希望是？', answers: [
      { text: '没落贵族的后裔，身负复兴使命', attributeChanges: { wealth: 3, charisma: 1, luck: -1 } },
      { text: '天赋异禀的孤儿，潜力无限', attributeChanges: { strength: 1, intelligence: 1, charisma: 1, luck: 2, wealth: 1 } },
      { text: '某个强大组织的底层成员，渴望晋升', attributeChanges: { strength: 1, intelligence: 1, wealth: 2 } },
      { text: '与世隔绝的隐士传人，身怀绝技', attributeChanges: { intelligence: 2, strength: 1, charisma: -1, wealth: 1 } }
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

// 添加新的事件类型和结局
const additionalEvents: LifeEvent[] = [
  { age: 3, description: '你开始展现出与众不同的天赋。' },
  { age: 6, description: '你遇到了人生中的第一个重要选择。' },
  { age: 9, description: '你的特殊能力开始觉醒。' },
  { age: 12, description: '你遇到了改变命运的重要人物。' },
  { age: 15, description: '你开始探索这个世界的奥秘。' },
  { age: 18, description: '你面临着人生的重要转折点。' },
  { age: 21, description: '你的能力得到了显著提升。' },
  { age: 24, description: '你开始建立自己的势力。' },
  { age: 27, description: '你遇到了强大的对手。' },
  { age: 30, description: '你开始思考人生的意义。' }
];

const endings: LifeEvent[] = [
  { age: "结局", description: '你成为了这个世界的传奇，被后人传颂。' },
  { age: "结局", description: '你找到了回家的路，带着异世界的记忆回到现实。' },
  { age: "结局", description: '你建立了自己的王国，成为一代明君。' },
  { age: "结局", description: '你领悟了世界的真理，选择隐居山林。' },
  { age: "结局", description: '你与挚爱之人携手共度余生。' },
  { age: "结局", description: '你成为了世界最强的存在，但感到孤独。' },
  { age: "结局", description: '你选择回到平凡的生活，珍惜当下。' }
];

// --- Component Logic ---

const IsekaiPage: React.FC = () => {
  const [stage, setStage] = useState<Stage>(Stage.QUESTIONS);
  const [questionsList] = useState<Question[]>(initialQuestions); // 问题列表
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [attributes, setAttributes] = useState<Attributes>({ strength: 3, intelligence: 3, charisma: 3, luck: 3, wealth: 3 }); // 重置初始属性为一个基准值，问题会在此基础上修改

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
    setAttributes({ strength: 3, intelligence: 3, charisma: 3, luck: 3, wealth: 3 });
    setResult(null);
    setLifeEvents([]);
    setDisplayedEvents([]);
    setIsAutoPlaying(false);
    setCurrentTimeoutId(null);
    setIsAtChoice(false);
    setCurrentChoiceData(null);
  }, [currentTimeoutId]);

  // 修改 generateLifeEvents 函数
  const generateLifeEvents = useCallback((initialAttrs: Attributes) => {
    console.log("[Debug] Generating life events with initial attributes:", initialAttrs);
    
    // 根据属性生成基础事件
    const baseEvents: LifeEvent[] = [
      { age: 0, description: '前世的记忆消散，你在新的世界睁开了双眼。' },
      { age: 5, description: `基于你的出身(${initialAttrs.wealth > 6 ? '优渥' : '普通'})，你的早期教育开始了。` },
      { age: 7, description: `童年爱好(${initialAttrs.intelligence > initialAttrs.strength ? '偏静' : '偏动'})塑造了你的性格。` },
      { age: 10, description: '你开始思考人生的意义，也许是前世遗憾的影响？' },
      { age: 12, description: `你在${initialAttrs.luck > 5 ? '好运' : '一般运气'}的伴随下度过了少年时光。` },
      { age: 15, description: '第一次面临重大考验，你凭借智慧或力量度过。' },
      { age: 18, description: '成年之际，你必须为自己的未来做出关键抉择。', isChoiceNode: true, choiceNodeId: 'choice_age_18_study' }
    ];

    // 随机选择一些额外事件
    const randomEvents = [...additionalEvents]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // 随机选择一个结局
    const randomEnding = endings[Math.floor(Math.random() * endings.length)];

    // 合并所有事件
    const events = [...baseEvents, ...randomEvents, randomEnding];
    
    console.log("[Debug] Generated events:", events);
    setLifeEvents(events);
    setIsAutoPlaying(true);
    setStage(Stage.SIMULATION);
    console.log("[Debug] Simulation stage set, auto play started.");
  }, []);

  // 处理回答（用于设置初始属性）
  const handleAnswer = (answer: Answer) => {
    console.log("[Debug] Answer selected, applying changes:", answer.attributeChanges);
    applyAttributeChanges(answer.attributeChanges);

    if (currentQuestionIndex < questionsList.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      console.log("[Debug] All questions answered. Final initial attributes:", attributes);
      // 确保在调用 generateLifeEvents 时传递最新的 attributes
      // 使用函数式更新来获取最新的状态值
      setAttributes(currentAttrs => {
          generateLifeEvents(currentAttrs); 
          return currentAttrs; // 返回当前状态，因为 generateLifeEvents 不直接修改它
      });
    }
  };

  // 添加新的状态检查函数
  const checkAndFixLifeEvents = useCallback((events: LifeEvent[]) => {
    if (!events || events.length === 0) {
      console.error("[Debug] Empty or invalid life events detected");
      return false;
    }
    
    const lastEvent = events[events.length - 1];
    if (lastEvent.age !== "结局" && !lastEvent.isChoiceNode) {
      console.warn("[Debug] Life events chain doesn't end properly");
      return false;
    }
    
    return true;
  }, []);

  // 修改后的 useEffect
  useEffect(() => {
    if (stage !== Stage.SIMULATION || !isAutoPlaying || isAtChoice) {
      return;
    }

    const nextEventIndex = displayedEvents.length;
    
    // 检查生命事件链的有效性
    if (!checkAndFixLifeEvents(lifeEvents)) {
      console.error("[Debug] Invalid life events chain detected");
      setIsAutoPlaying(false);
      setStage(Stage.END);
      return;
    }

    if (nextEventIndex >= lifeEvents.length) {
      console.log("[Debug] All events displayed");
      setIsAutoPlaying(false);
      setStage(Stage.END);
      return;
    }

    const nextEvent = lifeEvents[nextEventIndex];
    const delay = Math.min((nextEvent.description.length * 50) + 300, 2000); // 设置最大延迟

    const timeoutId = setTimeout(() => {
      if (stage !== Stage.SIMULATION) {
        console.log("[Debug] Stage changed during timeout, aborting");
        return;
      }

      setDisplayedEvents(prev => [...prev, nextEvent]);
      
      if (nextEvent.attributeChanges) {
        applyAttributeChanges(nextEvent.attributeChanges);
      }

      if (nextEvent.isChoiceNode && nextEvent.choiceNodeId) {
        const choiceData = choiceNodes[nextEvent.choiceNodeId];
        if (choiceData) {
          setCurrentChoiceData(choiceData);
          setIsAtChoice(true);
          setIsAutoPlaying(false);
        } else {
          console.error("[Debug] Choice node not found:", nextEvent.choiceNodeId);
          setIsAutoPlaying(false);
          setStage(Stage.END);
        }
      } else if (nextEventIndex + 1 >= lifeEvents.length || nextEvent.age === "结局") {
        setIsAutoPlaying(false);
        setStage(Stage.END);
      }
    }, delay);

    setCurrentTimeoutId(timeoutId);

    return () => {
      if (currentTimeoutId) {
        clearTimeout(currentTimeoutId);
      }
    };
  }, [stage, isAutoPlaying, isAtChoice, displayedEvents.length, lifeEvents, checkAndFixLifeEvents]);

  // 自动滚动日志到底部
  useEffect(() => {
    if (eventLogRef.current) {
      eventLogRef.current.scrollTop = eventLogRef.current.scrollHeight;
    }
  }, [displayedEvents]);

  // 修改 handleMakeChoice 函数
  const handleMakeChoice = useCallback((optionIndex: number) => {
    if (!currentChoiceData) {
      console.error("[Debug] No choice data available");
      return;
    }

    const selectedOption = currentChoiceData.options[optionIndex];
    if (!selectedOption) {
      console.error("[Debug] Invalid option selected");
      return;
    }

    // 确保选项的后续事件链是有效的
    if (!selectedOption.nextEvents || selectedOption.nextEvents.length === 0) {
      console.error("[Debug] No next events in selected option");
      setIsAutoPlaying(false);
      setStage(Stage.END);
      return;
    }

    const outcomeEvent: LifeEvent = {
      age: "选择结果",
      description: selectedOption.outcomeDescription
    };

    // 使用函数式更新确保状态更新的原子性
    setDisplayedEvents(prev => [...prev, outcomeEvent]);
    
    if (selectedOption.attributeChanges) {
      applyAttributeChanges(selectedOption.attributeChanges);
    }

    const choiceTriggerEventIndex = lifeEvents.findIndex(e => e.choiceNodeId === currentChoiceData.id);
    const baseEvents = choiceTriggerEventIndex !== -1 
      ? lifeEvents.slice(0, choiceTriggerEventIndex + 1)
      : [...displayedEvents];

    // 确保新的事件链以结局结束
    const newEvents = selectedOption.nextEvents;
    const lastEvent = newEvents[newEvents.length - 1];
    if (lastEvent.age !== "结局" && !lastEvent.isChoiceNode) {
      // 根据当前属性选择一个合适的结局
      const totalScore = Object.values(attributes).reduce((sum, val) => sum + val, 0);
      const endingIndex = Math.min(Math.floor(totalScore / 10), endings.length - 1);
      newEvents.push(endings[endingIndex]);
    }

    const newLifePath = [...baseEvents, outcomeEvent, ...newEvents];
    
    // 批量更新状态
    setLifeEvents(newLifePath);
    setIsAtChoice(false);
    setCurrentChoiceData(null);
    setIsAutoPlaying(true);

  }, [currentChoiceData, displayedEvents, lifeEvents, applyAttributeChanges, attributes]);

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