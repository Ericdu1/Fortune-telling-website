import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Button, Typography, Card, Steps, Progress, Spin, Divider } from 'antd';
import { motion } from 'framer-motion';
import { ArrowLeftOutlined, QuestionOutlined, HomeOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

// 测试阶段枚举
enum TestStage {
  INTRO = 'intro',
  PERSONALITY = 'personality',
  WORLD = 'world',
  TALENT = 'talent',
  DESTINY = 'destiny',
  RESULT = 'result',
  STORY = 'story'
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

// 样式组件
const PageContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const IntroContainer = styled(motion.div)`
  text-align: center;
  background: rgba(30, 0, 60, 0.6);
  padding: 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/images/isekai/banner.svg');
    background-size: cover;
    background-position: center;
    opacity: 0.1;
    z-index: -1;
  }
`;

const TestContainer = styled.div`
  margin: 2rem auto;
  max-width: 800px;
`;

const QuestionCard = styled(Card)`
  background: rgba(30, 0, 60, 0.7);
  border-radius: 12px;
  border: 1px solid rgba(138, 43, 226, 0.3);
  margin-bottom: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  
  .ant-card-body {
    padding: 2rem;
  }
`;

const AnswerButton = styled(Button)`
  margin: 0.5rem 0;
  height: auto;
  padding: 1rem;
  text-align: left;
  border-radius: 8px;
  width: 100%;
  white-space: normal;
  height: unset;
  background: rgba(80, 10, 120, 0.4);
  border: 1px solid rgba(186, 104, 200, 0.3);
  color: white;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(120, 20, 180, 0.5);
    border-color: rgba(186, 104, 200, 0.6);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ResultContainer = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background: rgba(30, 0, 60, 0.8);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    opacity: 0.1;
    z-index: -1;
    border-radius: 16px;
  }
`;

const StoryContainer = styled(motion.div)`
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background: rgba(30, 0, 60, 0.8);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    opacity: 0.1;
    z-index: -1;
    border-radius: 16px;
  }
`;

const FeatureTile = styled.div`
  background: rgba(138, 43, 226, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  margin: 0.5rem;
  display: inline-block;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const EventItem = styled.div`
  padding: 1rem;
  margin: 0.75rem 0;
  background: rgba(138, 43, 226, 0.15);
  border-radius: 8px;
  position: relative;
  padding-left: 3rem;
  
  &::before {
    content: '⟡';
    position: absolute;
    left: 1rem;
    color: #ba68c8;
    font-size: 1.2rem;
  }
`;

const BackButton = styled(Button)`
  margin-right: 1rem;
`;

const LifeStoryTimeline = styled.div`
  margin: 3rem 0;
`;

const TimelineEvent = styled(motion.div)`
  margin-bottom: 2rem;
  padding-left: 2rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 8px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ba68c8;
    box-shadow: 0 0 10px #ba68c8;
  }
  
  &::after {
    content: '';
    position: absolute;
    left: 6px;
    top: 24px;
    width: 1px;
    bottom: -18px;
    background: linear-gradient(to bottom, #ba68c8, transparent);
  }
  
  &:last-child::after {
    display: none;
  }
`;

const Age = styled.div`
  font-weight: bold;
  color: #ba68c8;
  margin-bottom: 0.5rem;
`;

const EventDescription = styled.div`
  color: white;
  line-height: 1.6;
  font-size: 1rem;
`;

// 问题数据
const questions = {
  personality: [
    {
      question: "面对突发危险，你会采取什么行动？",
      answers: [
        "直接面对，迅速制定应对方案", 
        "先观察情况，寻找最安全的解决方案", 
        "根据直觉行动，相信自己的本能", 
        "寻求他人帮助，集体应对危险"
      ]
    },
    {
      question: "你更倾向于哪种类型的力量？",
      answers: [
        "掌握强大的破坏性力量", 
        "拥有高超的恢复治疗能力", 
        "具备操控和改变环境的技能", 
        "拥有增强团队能力的辅助技能"
      ]
    },
    {
      question: "你认为自己最大的优势是什么？",
      answers: [
        "坚韧不拔的意志", 
        "敏锐的观察和判断能力", 
        "丰富的想象力和创造力", 
        "与他人协作的社交能力"
      ]
    }
  ],
  world: [
    {
      question: "如果可以选择，你希望穿越到什么样的世界？",
      answers: [
        "充满魔法与奇迹的幻想世界", 
        "科技发达的未来世界", 
        "充满武力与争斗的武侠世界", 
        "诡异神秘的超自然世界"
      ]
    },
    {
      question: "在新世界中，你最希望拥有什么样的社会地位？",
      answers: [
        "权势显赫的贵族或领导者", 
        "自由自在的冒险者", 
        "具有专业技能的匠人或学者", 
        "普通但拥有特殊能力的平民"
      ]
    },
    {
      question: "你更喜欢什么样的世界氛围？",
      answers: [
        "和平安宁，民风淳朴", 
        "充满挑战，机遇与危险并存", 
        "秩序严明，等级分明", 
        "混乱无序，适者生存"
      ]
    }
  ],
  talent: [
    {
      question: "你更倾向于哪种类型的特殊能力？",
      answers: [
        "元素操控（火、水、风等自然力量）", 
        "精神能力（读心、幻术、心灵力量）", 
        "物理强化（超强力量、速度、耐力）", 
        "特殊技能（空间操控、时间能力）"
      ]
    },
    {
      question: "你希望自己的能力是如何获得的？",
      answers: [
        "天生就有，与生俱来的天赋", 
        "通过修炼和努力习得", 
        "意外事件导致的觉醒", 
        "神秘传承或古老仪式获得"
      ]
    },
    {
      question: "关于能力的使用，你更认同以下哪种观点？",
      answers: [
        "力量意味着责任，应该用于保护他人", 
        "力量是自保的工具，首先要保护好自己", 
        "力量是实现目标的手段，为达目的可以不择手段", 
        "力量需要不断提升，追求极限"
      ]
    }
  ],
  destiny: [
    {
      question: "你认为自己在异世界的命运走向会是什么样的？",
      answers: [
        "成为拯救世界的英雄", 
        "追求个人力量的极致", 
        "平凡但充实的生活", 
        "建立自己的势力或王国"
      ]
    },
    {
      question: "在异世界冒险中，你最看重什么？",
      answers: [
        "收获真挚的友情和爱情", 
        "获得强大的力量和能力", 
        "探索未知和寻找真相", 
        "积累财富和资源"
      ]
    },
    {
      question: "面对最终决战，你会采取何种策略？",
      answers: [
        "正面迎战，凭借自身实力取胜", 
        "寻找敌人弱点，制定周密计划", 
        "联合伙伴，依靠团队力量", 
        "寻找其他解决方案，避免直接冲突"
      ]
    }
  ]
};

// 根据回答生成的人生故事事件
const generateLifeEvents = (result: ResultType) => {
  const { world, talent, events } = result;
  
  // 根据世界和能力生成具体的人生事件
  return [
    { age: 5, description: `你出生在${world}的一个普通家庭，从小就表现出与众不同的特质。` },
    { age: 10, description: `你发现自己能感知到微弱的${talent}能量，但还不能控制它。` },
    { age: 15, description: events[0] },
    { age: 18, description: events[1] },
    { age: 22, description: events[2] },
    { age: 25, description: events[3] },
    { age: 30, description: events[4] },
    { age: 35, description: `经历了重重挑战，你的${talent}能力已达到极致，成为了让所有人敬畏的存在。` },
  ];
};

// 根据用户回答生成结果
const generateResultFromAnswers = (answers: AnswersType) => {
  // 根据世界问题回答确定穿越世界
  const worldTypes = [
    {
      name: '魔法奇幻世界',
      features: ['魔法盛行', '种族多样', '魔物横行'],
      talents: ['元素掌控', '时空魔法', '魔法强化', '秘术召唤']
    },
    {
      name: '未来科技世界',
      features: ['高度发达', '虚拟现实', '人工智能'],
      talents: ['机械改造', '数据分析', '纳米技术', '生物编程']
    },
    {
      name: '修真/仙侠世界',
      features: ['高武', '宗门林立', '灵气充沛'],
      talents: ['天地灵气', '剑气御空', '磁场转动', '五行控制']
    },
    {
      name: '诡异灵异世界',
      features: ['超自然现象', '灵异事件', '诡谲神秘'],
      talents: ['通灵能力', '鬼域掌控', '诅咒之力', '因果转换']
    }
  ];

  // 根据用户的回答确定世界类型
  const worldSum = answers.world.reduce((sum, val) => sum + val, 0);
  const worldIndex = Math.min(Math.floor(worldSum / (answers.world.length * 0.75)), 3);
  const selectedWorld = worldTypes[worldIndex];

  // 根据个性和能力问题确定特殊能力
  const personalityScore = answers.personality.reduce((sum, val) => sum + val, 0);
  const talentScore = answers.talent.reduce((sum, val) => sum + val, 0);
  const talentIndex = Math.min(Math.floor((personalityScore + talentScore) / 4) % 4, 3);
  const selectedTalent = selectedWorld.talents[talentIndex];

  // 能力稀有度和级别
  const talentLevels = ['C级', 'B级', 'A级', 'S级'];
  const talentRarities = ['较为常见的能力', '稀有能力', '非常罕见的能力', '极度罕见的异端能力'];
  const destinySum = answers.destiny.reduce((sum, val) => sum + val, 0);
  const levelIndex = Math.min(Math.floor(destinySum / answers.destiny.length), 3);
  
  // 生成事件
  const eventTypes = [
    [
      `在${selectedWorld.name}的冒险初期意外觉醒${selectedTalent}能力`,
      `因能力独特引来强者注意`,
      `获得神秘传承，${selectedTalent}得到强化`,
      `能力突破至中阶水平`,
      `与${selectedWorld.name}的大能对决，实力得到认可`
    ],
    [
      `研究古老遗迹时发现${selectedTalent}的奥秘`,
      `被神秘组织追捕，因其觊觎你的${selectedTalent}`,
      `在巨大危机中领悟${selectedTalent}的进阶使用方法`,
      `能力提升至高级水平`,
      `成功破解${selectedWorld.name}的重大危机，成为传奇`
    ],
    [
      `在神秘事件中突然觉醒${selectedTalent}`,
      `被传统势力排斥，踏上独行之路`,
      `探索禁地，获得远古强者对${selectedTalent}的理解`,
      `经历生死考验，能力达到巅峰`,
      `创立新的流派，改变${selectedWorld.name}的力量格局`
    ],
    [
      `在意外事故中获得${selectedTalent}能力`,
      `被视为异端遭遇追杀`,
      `寻找到能力源头，完全掌握${selectedTalent}`,
      `打破常规限制，实现能力质变`,
      `最终成为${selectedWorld.name}新一代的顶尖强者`
    ]
  ];
  
  // 根据命运问题选择事件线
  const eventIndex = Math.min(Math.floor(destinySum / (answers.destiny.length * 0.75)), 3);
  const selectedEvents = eventTypes[eventIndex];

  // 生成故事
  const storyBeginnings = [
    `你原本只是${selectedWorld.name}中的一名普通人，过着平凡的生活。某天，你在探索一处废弃的古迹时，接触到了一个神秘的遗物，从那一刻起，你感到体内有什么东西被唤醒了。`,
    `作为${selectedWorld.name}一个小家族的后代，你从小就表现出与众不同的天赋。在一次家族试炼中，你意外触发了沉睡在血脉中的${selectedTalent}能力，令所有人惊讶。`,
    `你曾是${selectedWorld.name}的一名学徒，跟随导师学习基础知识。一次意外的实验事故中，你被神秘能量击中，昏迷不醒。醒来后，你发现自己能够使用${selectedTalent}的力量。`,
    `你原本是地球上的普通人，某天一场意外将你传送到了${selectedWorld.name}。为了在这个陌生的世界生存，你开始探索自己的潜能，最终发现并掌握了${selectedTalent}。`
  ];
  
  const storyMiddles = [
    `随着对${selectedTalent}的不断掌握，你的能力日益精进。然而，这也引来了不少觊觎者的注意。你被迫踏上流浪之路，在旅途中不断提升自己，并结识了志同道合的伙伴。你们一起经历了无数险境，每一次危机都让你对能力有了新的理解和突破。`,
    `你的${selectedTalent}能力引起了${selectedWorld.name}主流势力的警惕，他们视你为潜在威胁。为了证明自己，你开始参与各种挑战和竞争，逐渐在这个世界站稳脚跟。在一次关键的历练中，你发现了能力的进阶秘密，实力大幅提升。`,
    `为了更好地掌控${selectedTalent}，你踏上了寻找古老传承的旅程。这条路充满了危险，但也带来了丰厚的回报。你在一处隐秘的遗迹中获得了完整的修炼法，使得你的能力有了质的飞跃。同时，你也逐渐了解到这个世界的真相和自己的使命。`,
    `被视为异端的你，选择了隐居深山修炼${selectedTalent}。多年后，当一场席卷${selectedWorld.name}的危机爆发，你选择出山相助。在连续的战斗中，你的实力得到了极大的锤炼，并且因为特殊的能力而成为解决危机的关键人物。`
  ];
  
  const storyEndings = [
    `经过多年的历练，你的${selectedTalent}能力已经达到了前所未有的高度。在最终的决战中，你凭借独特的能力和坚定的意志，成功击败了威胁${selectedWorld.name}的最强敌人。你的名字被载入史册，成为后人传颂的传奇。然而，你并未就此停止，而是继续探索能力的更多可能，寻找新的挑战。`,
    `你成功将${selectedTalent}发展出了全新的流派，改变了${selectedWorld.name}的力量格局。你建立了自己的组织，培养了许多拥有相似能力的后继者。在你的带领下，这个组织成为了世界的重要力量，为维护和平作出了巨大贡献。你的传奇故事激励了无数人追求自己的道路。`,
    `当你的${selectedTalent}达到巅峰时，你获得了前所未有的洞察力。你发现了${selectedWorld.name}隐藏的终极秘密，并利用自己的能力为这个世界开创了新的纪元。你被尊为开拓者和先驱，但你知道，真正的冒险才刚刚开始，更广阔的多元宇宙等待着你去探索。`,
    `你最终成为了${selectedWorld.name}的守护者，你的${selectedTalent}能力不仅仅是战斗的工具，更是维护世界平衡的关键。你建立了新的秩序，将知识和力量传授给值得信任的继承者。当你完成使命后，你选择了隐退，但你的传说永远流传在这个世界的每个角落。`
  ];

  // 根据用户选择的综合得分选择故事
  const totalScore = [...answers.personality, ...answers.world, ...answers.talent, ...answers.destiny].reduce((sum, val) => sum + val, 0);
  const storyIndex = Math.min(Math.floor(totalScore / 12) % 4, 3);

  return {
    world: selectedWorld.name,
    worldFeatures: selectedWorld.features,
    talent: selectedTalent,
    talentLevel: talentLevels[levelIndex],
    talentRarity: talentRarities[levelIndex],
    events: selectedEvents,
    story: {
      beginning: storyBeginnings[storyIndex],
      middle: storyMiddles[storyIndex],
      ending: storyEndings[storyIndex]
    }
  };
};

const IsekaiPage: React.FC = () => {
  // 测试阶段状态 - 直接从问题开始
  const [stage, setStage] = useState<TestStage>(TestStage.PERSONALITY);
  
  // 当前问题索引
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // 用户回答记录
  const [answers, setAnswers] = useState<AnswersType>({
    personality: [],
    world: [],
    talent: [],
    destiny: []
  });
  
  // 当前问题章节
  const [currentSection, setCurrentSection] = useState<'personality' | 'world' | 'talent' | 'destiny'>('personality');
  
  // 结果数据
  const [result, setResult] = useState<ResultType | null>(null);
  
  // 人生故事时间线事件
  const [lifeEvents, setLifeEvents] = useState<{ age: number, description: string }[]>([]);
  
  // 当前正在显示的生命历程索引
  const [currentLifeEventIndex, setCurrentLifeEventIndex] = useState(-1);

  // 处理问题回答
  const handleAnswer = (answerIndex: number) => {
    // 更新回答
    const updatedAnswers = { ...answers };
    updatedAnswers[currentSection] = [...updatedAnswers[currentSection], answerIndex];
    setAnswers(updatedAnswers);
    
    // 检查是否完成当前问题集
    if (currentQuestionIndex < questions[currentSection].length - 1) {
      // 移动到下一个问题
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 完成当前章节，进入下一个章节
      setCurrentQuestionIndex(0);
      
      switch (currentSection) {
        case 'personality':
          setCurrentSection('world');
          setStage(TestStage.WORLD);
          break;
        case 'world':
          setCurrentSection('talent');
          setStage(TestStage.TALENT);
          break;
        case 'talent':
          setCurrentSection('destiny');
          setStage(TestStage.DESTINY);
          break;
        case 'destiny':
          // 所有问题已回答完毕，生成结果并直接进入故事页面
          generateResult();
          break;
      }
    }
  };
  
  // 生成结果
  const generateResult = () => {
    // 根据用户回答生成个性化结果
    setTimeout(() => {
      // 使用基于用户选择的生成函数
      const personalizedResult = generateResultFromAnswers(answers);
      setResult(personalizedResult);
      
      // 生成人生历程事件
      const events = generateLifeEvents(personalizedResult);
      setLifeEvents(events);
      
      // 直接进入故事页面
      setStage(TestStage.STORY);
      // 开始逐步显示生命历程
      setCurrentLifeEventIndex(0);
      
      // 设置定时器，每2秒显示下一个事件
      const interval = setInterval(() => {
        setCurrentLifeEventIndex(prev => {
          if (prev < events.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 2000);
    }, 1500);
  };
  
  // 重新开始测试
  const restartTest = () => {
    setStage(TestStage.PERSONALITY);
    setCurrentSection('personality');
    setCurrentQuestionIndex(0);
    setAnswers({
      personality: [],
      world: [],
      talent: [],
      destiny: []
    });
    setResult(null);
    setLifeEvents([]);
    setCurrentLifeEventIndex(-1);
  };
  
  // 返回上一步
  const goBack = () => {
    restartTest();
  };
  
  // 计算测试进度
  const calculateProgress = () => {
    const totalQuestions = 
      questions.personality.length + 
      questions.world.length + 
      questions.talent.length + 
      questions.destiny.length;
    
    let answeredQuestions = 
      answers.personality.length + 
      answers.world.length + 
      answers.talent.length + 
      answers.destiny.length;
    
    // 包括当前正在回答的问题
    if (currentQuestionIndex > 0) {
      answeredQuestions += currentQuestionIndex;
    }
    
    return Math.floor((answeredQuestions / totalQuestions) * 100);
  };
  
  // 渲染问题页面
  const renderQuestionPage = () => {
    // 获取当前问题集
    const currentQuestions = questions[currentSection];
    // 获取当前问题
    const currentQuestion = currentQuestions[currentQuestionIndex];
    
    // 标题映射
    const sectionTitles = {
      personality: '个性测试',
      world: '世界选择',
      talent: '能力倾向',
      destiny: '命运走向'
    };
    
    return (
      <TestContainer>
        <Steps current={
          currentSection === 'personality' ? 0 :
          currentSection === 'world' ? 1 :
          currentSection === 'talent' ? 2 :
          3
        } style={{ marginBottom: '2rem' }}>
          <Step title="个性" />
          <Step title="世界" />
          <Step title="能力" />
          <Step title="命运" />
        </Steps>
        
        <Progress 
          percent={calculateProgress()} 
          status="active" 
          style={{ marginBottom: '2rem' }}
          strokeColor="#ba68c8"
        />
        
        <QuestionCard>
          <Title level={4} style={{ color: '#ba68c8', marginBottom: '1rem' }}>
            {sectionTitles[currentSection]} - 问题 {currentQuestionIndex + 1}/{currentQuestions.length}
          </Title>
          
          <Paragraph style={{ color: 'white', fontSize: '1.2rem', marginBottom: '2rem' }}>
            {currentQuestion.question}
          </Paragraph>
          
          {currentQuestion.answers.map((answer, index) => (
            <AnswerButton 
              key={index}
              onClick={() => handleAnswer(index)}
            >
              {answer}
            </AnswerButton>
          ))}
        </QuestionCard>
      </TestContainer>
    );
  };
  
  // 渲染人生故事页面
  const renderStoryPage = () => {
    if (!result) return null;
    
    const { story } = result;
    
    return (
      <StoryContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Title level={2} style={{ color: '#ba68c8', textAlign: 'center', marginBottom: '2rem' }}>
          你的异世界人生历程
        </Title>
        
        <Paragraph style={{ color: 'white', fontSize: '1.1rem', lineHeight: '1.8', textIndent: '2em' }}>
          {story.beginning}
        </Paragraph>
        
        <LifeStoryTimeline>
          {lifeEvents.slice(0, currentLifeEventIndex + 1).map((event, index) => (
            <TimelineEvent 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Age>{event.age}岁</Age>
              <EventDescription>{event.description}</EventDescription>
            </TimelineEvent>
          ))}
        </LifeStoryTimeline>
        
        {currentLifeEventIndex >= lifeEvents.length - 1 && (
          <>
            <Paragraph style={{ color: 'white', fontSize: '1.1rem', lineHeight: '1.8', textIndent: '2em', marginTop: '2rem' }}>
              {story.middle}
            </Paragraph>
            
            <Paragraph style={{ color: 'white', fontSize: '1.1rem', lineHeight: '1.8', textIndent: '2em', marginTop: '2rem' }}>
              {story.ending}
            </Paragraph>
          </>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
          <BackButton 
            icon={<ArrowLeftOutlined />}
            onClick={goBack}
          >
            返回
          </BackButton>
          
          <Button 
            icon={<HomeOutlined />}
            onClick={restartTest}
          >
            重新测试
          </Button>
        </div>
      </StoryContainer>
    );
  };
  
  // 根据当前阶段渲染对应页面
  const renderCurrentStage = () => {
    switch (stage) {
      case TestStage.INTRO:
        // 不再使用介绍页面
        return renderQuestionPage();
      case TestStage.PERSONALITY:
      case TestStage.WORLD:
      case TestStage.TALENT:
      case TestStage.DESTINY:
        return renderQuestionPage();
      case TestStage.RESULT:
        // 不再单独显示结果页面，直接进入故事页面
        return renderStoryPage();
      case TestStage.STORY:
        return renderStoryPage();
      default:
        return renderQuestionPage();
    }
  };
  
  return (
    <PageContainer>
      {renderCurrentStage()}
    </PageContainer>
  );
};

export default IsekaiPage; 