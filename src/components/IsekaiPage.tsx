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

const IsekaiPage: React.FC = () => {
  // 测试阶段状态 - 直接从问题页面开始
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
  
  // 处理开始测试
  const handleStart = () => {
    setCurrentSection('personality');
    setCurrentQuestionIndex(0);
  };
  
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
          // 所有问题已回答完毕，生成结果
          generateResult();
          break;
      }
    }
  };
  
  // 生成结果 - 根据用户选择生成不同的结果
  const generateResult = () => {
    // 收集用户回答
    const personalityAnswers = answers.personality;
    const worldAnswers = answers.world;
    const talentAnswers = answers.talent;
    const destinyAnswers = answers.destiny;
    
    // 根据world问题的选择确定世界类型
    let worldType = '';
    let worldFeatures: string[] = [];
    
    if (worldAnswers.includes(0)) {
      worldType = '魔法奇幻世界';
      worldFeatures = ['魔法', '精灵', '魔法学院'];
    } else if (worldAnswers.includes(1)) {
      worldType = '未来科技世界';
      worldFeatures = ['AI', '太空旅行', '基因改造'];
    } else if (worldAnswers.includes(2)) {
      worldType = '修真/仙侠世界';
      worldFeatures = ['高武', '战乱', '宗门林立'];
    } else {
      worldType = '诡异神秘世界';
      worldFeatures = ['诡谲', '灵异', '神秘规则'];
    }
    
    // 根据talent问题的选择确定能力类型
    let talentType = '';
    let talentLevel = '';
    let talentRarity = '';
    
    if (talentAnswers.includes(0)) {
      talentType = '元素操控';
      talentLevel = 'S级';
      talentRarity = '稀有的自然之力';
    } else if (talentAnswers.includes(1)) {
      talentType = '精神力量';
      talentLevel = 'A级';
      talentRarity = '罕见的心灵能力';
    } else if (talentAnswers.includes(2)) {
      talentType = '身体强化';
      talentLevel = 'SS级';
      talentRarity = '超稀有的体质';
    } else {
      talentType = '时空掌控';
      talentLevel = 'SSS级';
      talentRarity = '传说中的能力';
    }
    
    // 根据destiny问题的选择确定事件和故事
    let events: string[] = [];
    let story: StoryType = {
      beginning: '',
      middle: '',
      ending: ''
    };
    
    // 基于世界和能力生成不同的事件
    if (worldType === '魔法奇幻世界') {
      events = [
        `在魔法学院中发现自己的${talentType}天赋`,
        '被神秘组织盯上并追杀',
        '找到远古魔法典籍，掌握失传魔法',
        '在魔法竞技场上战胜高等法师',
        '与黑暗魔王对决'
      ];
      
      story = {
        beginning: `你出生在${worldType}的一个普通家庭，父母都是微弱的魔法使用者。在10岁那年，你被送入魔法学院学习，原本表现平平，但在一次意外中，你突然觉醒了${talentType}能力，这让所有导师都惊讶不已。`,
        middle: `随着你的能力不断提升，你引起了神秘魔法组织的注意，他们认为你的能力与古老预言有关。在逃亡途中，你偶然发现了一本远古魔法典籍，掌握了失传已久的魔法。通过不断修炼，你在魔法竞技场上战胜了多位高等法师，成为令人畏惧的存在。`,
        ending: `最终，你发现那个追杀你的组织背后站着黑暗魔王，他企图利用你的力量打开世界间的屏障。在激烈的决战中，你完全掌握了${talentType}的奥秘，成功击败了黑暗魔王，并被魔法议会封为守护者，负责维护世界和平。`
      };
      
    } else if (worldType === '未来科技世界') {
      events = [
        `通过前沿科技实验获得${talentType}能力`,
        '被政府特殊部门追踪',
        '加入反抗军组织',
        '黑入中央数据库揭露阴谋',
        '改变世界科技格局'
      ];
      
      story = {
        beginning: `你生活在${worldType}的低层区域，梦想成为一名科学家。在参与一个秘密科技实验时，意外事故使你获得了${talentType}能力，这在纯科技的世界中被视为异常现象。`,
        middle: `政府特殊部门发现了你的存在，将你列为研究对象。在逃亡途中，你遇到了一群反抗军，他们正在对抗控制世界的AI系统。利用你的特殊能力，你成功黑入了中央数据库，揭露了统治者利用公民数据控制社会的阴谋。`,
        ending: `在最终的对抗中，你将${talentType}与高科技完美结合，创造出全新的技术体系。你的发明打破了大公司对技术的垄断，让所有人都能平等地享受科技的便利。你成为了新时代的科技先驱，引领世界进入更加开放的未来。`
      };
      
    } else if (worldType === '修真/仙侠世界') {
      events = [
        `在宗门试炼中意外觉醒${talentType}能力`,
        '被视为异端遭受追杀',
        '发现远古遗迹中的神秘传承',
        '修为突破至超凡境界',
        '与修真界最强者对决'
      ];
      
      story = {
        beginning: `你本是青山派外门弟子，资质平庸，被同门嘲笑。一次门派试炼中，你偶然跌入古井，发现神秘石碑，触碰后昏迷三日。醒来时，你体内流动着奇特的${talentType}能量。`,
        middle: `被师门视为异端的你被迫逃亡，期间偶入一处远古遗迹，发现完整的${talentType}修炼法。随着修为不断提升，你引来更多修真界强者的觊觎。你的能力对传统修真体系有天然压制作用，开始在修真界闯出名声，被称为"异能修士"。当你的修为突破至超凡境界时，终于引起了传说中的"仙道联盟"注意。`,
        ending: `当仙道联盟围攻你时，你发现${talentType}与传统灵力激烈碰撞产生共鸣，意外领悟到两种力量的融合之法。经过艰苦修炼，你创造出新的修真体系，将截然不同的力量融合，实力飙升至前所未有的境界。最终，你成为了这个世界的新型力量开创者，建立自己的宗门，打破了修真界千年不变的力量格局。`
      };
      
    } else {
      events = [
        `发现自己能看到常人看不到的${talentType}现象`,
        '被神秘组织盯上',
        '解开家族隐藏的诅咒之谜',
        '穿越到隐秘的次元空间',
        '与古老存在进行交易'
      ];
      
      story = {
        beginning: `从小你就能感知到一些奇怪的现象，但没人相信你的话。在一次意外中，你完全觉醒了${talentType}能力，能够看到隐藏在现实之下的诡异世界。你发现这个世界运行着常人无法理解的规则。`,
        middle: `一个神秘组织发现了你的能力，开始对你进行监视。同时，你发现自己的家族似乎与某种古老的诅咒有关。在探寻真相的过程中，你学会了利用${talentType}能力穿梭于现实与诡异空间之间，揭开了一个个惊人的秘密。`,
        ending: `最终，你发现这个世界被某种古老存在所控制，而你的能力正是打破这种控制的关键。通过与古老存在进行一场危险的交易，你获得了更强大的力量，同时也承担了守护世界平衡的责任。你成为了现实与诡异之间的行者，在常人不知道的阴影中守护着这个世界的秩序。`
      };
    }
    
    // 综合生成最终结果
    const mockResult: ResultType = {
      world: worldType,
      worldFeatures: worldFeatures,
      talent: talentType,
      talentLevel: talentLevel,
      talentRarity: talentRarity,
      events: events,
      story: story
    };
    
    setResult(mockResult);
    
    // 直接进入人生故事页面，跳过结果概览
    setStage(TestStage.STORY);
    
    // 生成人生历程事件
    const lifeEvents = generateLifeEvents(mockResult);
    setLifeEvents(lifeEvents);
    
    // 开始逐步显示生命历程
    setCurrentLifeEventIndex(0);
    
    // 设置定时器，每2秒显示下一个事件
    const interval = setInterval(() => {
      setCurrentLifeEventIndex(prev => {
        if (prev < lifeEvents.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 2000);
    
    // 清理函数
    return () => clearInterval(interval);
  };
  
  // 重新开始测试
  const restartTest = () => {
    setStage(TestStage.INTRO);
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
    if (stage === TestStage.STORY) {
      setStage(TestStage.RESULT);
    } else {
      restartTest();
    }
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
  
  // 渲染介绍页面
  const renderIntroPage = () => (
    <IntroContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Title level={2} style={{ color: '#ba68c8', marginBottom: '1.5rem' }}>
        多维世界穿越测试
      </Title>
      
      <Paragraph style={{ color: 'white', fontSize: '1.1rem', marginBottom: '2rem' }}>
        探索你专属的穿越故事，测试你在异世界会觉醒什么能力，面临怎样的命运挑战！
        完成所有问题后，我们将为你生成完整的异世界人生轨迹。
      </Paragraph>
      
      <Button 
        type="primary" 
        size="large"
        onClick={handleStart}
        style={{ 
          background: 'linear-gradient(to right, #9c27b0, #673ab7)',
          border: 'none',
          height: '50px',
          fontSize: '1.1rem',
          padding: '0 3rem'
        }}
      >
        开始测试
      </Button>
    </IntroContainer>
  );
  
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
  
  // 渲染结果页面
  const renderResultPage = () => {
    if (!result) {
      return (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <Spin size="large" />
          <Paragraph style={{ color: 'white', marginTop: '1rem' }}>
            正在生成你的异世界命运...
          </Paragraph>
        </div>
      );
    }
    
    return (
      <ResultContainer>
        <Title level={2} style={{ color: '#ba68c8', textAlign: 'center', marginBottom: '2rem' }}>
          你的异世界穿越结果
        </Title>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Title level={3} style={{ color: 'white' }}>
            {result.world}
          </Title>
          
          <div style={{ margin: '1rem 0' }}>
            {result.worldFeatures.map((feature, index) => (
              <FeatureTile key={index}>{feature}</FeatureTile>
            ))}
          </div>
        </div>
        
        <Divider style={{ borderColor: 'rgba(186, 104, 200, 0.3)' }} />
        
        <div style={{ marginBottom: '2rem' }}>
          <Title level={4} style={{ color: '#ba68c8' }}>
            你的能力：{result.talent}
          </Title>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <Text style={{ color: 'white' }}>能力等级：<span style={{ color: '#ba68c8', fontWeight: 'bold' }}>{result.talentLevel}</span></Text>
            <Text style={{ color: 'white' }}>稀有度：<span style={{ color: '#ba68c8', fontWeight: 'bold' }}>{result.talentRarity}</span></Text>
          </div>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <Title level={4} style={{ color: '#ba68c8' }}>关键事件预览</Title>
          
          {result.events.map((event, index) => (
            <EventItem key={index}>
              {event}
            </EventItem>
          ))}
        </div>
        
        <Divider style={{ borderColor: 'rgba(186, 104, 200, 0.3)' }} />
        
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <Title level={4} style={{ color: 'white' }}>
            想了解你在异世界的完整人生历程吗？
          </Title>
          
          <Button 
            type="primary"
            onClick={handleStart}
            style={{ 
              background: 'linear-gradient(to right, #9c27b0, #673ab7)',
              border: 'none',
              height: '46px',
              fontSize: '1rem',
              marginTop: '1rem'
            }}
          >
            查看详细人生故事
          </Button>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <BackButton 
            icon={<ArrowLeftOutlined />}
            onClick={goBack}
          >
            返回
          </BackButton>
          
          <Button 
            icon={<QuestionOutlined />}
            onClick={restartTest}
          >
            重新测试
          </Button>
        </div>
      </ResultContainer>
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
            返回结果
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
        return renderIntroPage();
      case TestStage.PERSONALITY:
      case TestStage.WORLD:
      case TestStage.TALENT:
      case TestStage.DESTINY:
        return renderQuestionPage();
      case TestStage.RESULT:
        return renderResultPage();
      case TestStage.STORY:
        return renderStoryPage();
      default:
        return renderQuestionPage(); // 默认显示问题页面
    }
  };
  
  return (
    <PageContainer>
      {renderCurrentStage()}
    </PageContainer>
  );
};

export default IsekaiPage; 