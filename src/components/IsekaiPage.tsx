import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Button, Typography, Card, Steps, Progress, Spin, Divider } from 'antd';
import { motion } from 'framer-motion';
import { ArrowLeftOutlined, QuestionOutlined, HomeOutlined } from '@ant-design/icons';
import ImageDisplay from './ImageDisplay';

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

// 结果类型定义，添加人生选择字段
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

// 人生选择选项接口
interface LifeChoiceOption {
  text: string;
  outcome: string;
  futureEvents: {age: string, description: string}[];
}

// 人生选择接口
interface LifeChoice {
  title: string;
  description: string;
  options: LifeChoiceOption[];
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

// 修改PageTitle样式，使标题更明显
const PageTitle = styled.h1`
  color: #ba68c8;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 1.8rem;
  text-shadow: 0 0 15px rgba(186, 104, 200, 0.7), 0 0 25px rgba(186, 104, 200, 0.5);
  background: rgba(30, 0, 60, 0.6);
  padding: 1.2rem;
  border-radius: 12px;
  border: 2px solid rgba(186, 104, 200, 0.5);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  letter-spacing: 1px;
  font-weight: 700;
`;

const SectionTitle = styled.h2`
  color: #ba68c8;
  font-size: 1.8rem;
  margin-bottom: 1rem;
  text-shadow: 0 0 8px rgba(186, 104, 200, 0.4);
`;

// 增强穿越方式描述
const isekaiMethods = [
  "被卡车撞击后，你的灵魂脱离了原本的世界，穿越到异世界",
  "在睡梦中感受到一股神秘力量将你拉扯，醒来时已身处异世界",
  "翻开一本古老书籍，被书页中散发的光芒吞噬，穿越到异世界",
  "触碰到一个神秘的遗物，瞬间时空扭曲，你被传送到异世界",
  "在电脑前熬夜猝死后，你的意识穿越时空，降临在异世界",
  "被一道闪电击中，你的灵魂与身体分离，重组时已在异世界",
  "实验室爆炸事故中被能量波及，穿越到平行维度的异世界",
  "被异世界的某个存在召唤，你的灵魂被强行拉入了异空间",
  "偶然发现一扇神秘的门，踏入后发现已无法返回原来的世界",
  "触碰家传古物时，激活了沉睡多年的穿越魔法，将你送入异世界",
  "遭遇自然灾害时，空间裂缝将你吸入，降临异世界",
  "通过科学实验意外创造出虫洞，你被吸入并传送到异世界",
  "在神秘仪式中被作为祭品，灵魂穿越到另一个次元",
  "不小心喝下神秘药水，意识模糊间你的灵魂穿越到异世界",
  "乘坐电梯时发生故障，电梯坠落的瞬间你穿越到了异世界"
];

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

// 修改生命事件生成函数，根据能力类型定制不同的人生路线
const generateLifeEvents = (result: ResultType, isekaiMethod: string) => {
  const { world, talent, events } = result;
  
  // 基础事件
  const baseEvents = [
    { age: "前世", description: `你在地球上是一名普通人，过着平凡的生活，没想到命运即将发生转折。` },
    { age: "穿越瞬间", description: `${isekaiMethod}。穿越的过程中，你的灵魂经历了奇特的时空隧道，获得了微弱的异能波动。` },
    { age: "10岁", description: `在新世界的你开始适应新的身份，并发现自己能感知到微弱的${talent}能量，但还不能控制它。` },
    { age: "15岁", description: events[0] },
    { age: "18岁", description: events[1] },
    { age: "22岁", description: events[2] },
    { age: "25岁", description: events[3] },
    { age: "30岁", description: events[4] },
    // 第一个关键节点 - 30岁时的人生选择
  ];
  
  return baseEvents;
};

// 根据能力类型生成不同的生命长度和寿命上限
const getTalentLifespan = (talent: string) => {
  switch(talent) {
    case '元素操控':
      return { normalLifespan: 300, maxLifespan: '数千年' };
    case '精神力量':
      return { normalLifespan: 400, maxLifespan: '永恒' };
    case '身体强化':
      return { normalLifespan: 200, maxLifespan: '千年' };
    case '时空掌控':
      return { normalLifespan: 500, maxLifespan: '超越时间' };
    default:
      return { normalLifespan: 300, maxLifespan: '数千年' };
  }
};

// 生成第一个人生选择
const generateFirstLifeChoice = (result: ResultType): LifeChoice => {
  const { world, talent } = result;
  const { normalLifespan } = getTalentLifespan(talent);
  
  if (world === '修真/仙侠世界') {
    return {
      title: "修行之路",
      description: `30岁的你已经成为一名小有成就的修行者，你的${talent}能力已初具规模。此时，你站在人生的十字路口，需要决定今后的修行方向。`,
      options: [
        {
          text: "追求长生不老",
          outcome: `你决定专注于延长寿命的修炼方法，寻访名山大川，搜集延寿丹方。`,
          futureEvents: [
            { age: "50岁", description: `经过二十年的苦修，你已掌握了基础筑基法，寿命延长至${normalLifespan}岁。` },
            { age: "100岁", description: `百年苦修，你成功结成金丹，容颜不老，成为修真界中备受尊敬的前辈。` },
            { age: "300岁", description: `三百年漫长修行，你已是绝世高人，开始尝试冲击更高境界，寻求永生之道。` }
          ]
        },
        {
          text: "追求极致力量",
          outcome: `你决定全力提升自身战斗力，拜访各路高人，学习各种秘术。`,
          futureEvents: [
            { age: "50岁", description: `经过刻苦修炼，你的${talent}已达到极高水平，能够轻松击败同阶修士。` },
            { age: "100岁", description: `百年苦修，你成为修真界顶尖高手，威名远播，无人敢轻易招惹。` },
            { age: "200岁", description: `你的战力已达巅峰，开始触及天人境界，但因过度追求力量，寿元消耗较大。` }
          ]
        },
        {
          text: "求索大道真理",
          outcome: `你决定探索修真的本质和天地大道，致力于参悟宇宙规则。`,
          futureEvents: [
            { age: "60岁", description: `经过长期闭关，你参透了自身${talent}的本源，对天地大道有了初步理解。` },
            { age: "150岁", description: `多年参悟，你已触摸到天地规则的边缘，开始撰写修真心得，吸引众多拜访者。` },
            { age: "400岁", description: `经过漫长岁月的探索，你已参透部分大道奥秘，开始尝试突破世界壁垒。` }
          ]
        },
        {
          text: "建立宗门传承",
          outcome: `你决定收徒授艺，创建自己的宗门，将自身所学传承下去。`,
          futureEvents: [
            { age: "50岁", description: `你已收下十余名资质上佳的弟子，开始在偏远山脉建立道场。` },
            { age: "120岁", description: `你的宗门已发展壮大，门下弟子遍布各地，成为修真界新兴的一大势力。` },
            { age: "250岁", description: `你的宗门已成为一方大派，你培养的弟子中有多人成为一方宗师，你的修炼体系被广泛认可。` }
          ]
        }
      ]
    };
  } 
  else if (world === '魔法奇幻世界') {
    return {
      title: "魔法之路",
      description: `30岁的你已经掌握了相当精湛的${talent}魔法，在魔法师圈子中小有名气。现在，你需要决定你未来的魔法研究方向。`,
      options: [
        {
          text: "研究生命魔法",
          outcome: `你专注于生命魔法的研究，希望通过魔法的力量延长寿命，甚至实现永生。`,
          futureEvents: [
            { age: "60岁", description: `通过生命魔法，你已经能够延缓衰老，外表仍如30岁一般年轻。` },
            { age: "120岁", description: `经过长期研究，你掌握了生命本质的奥秘，成功将自己的寿命延长到常人的数倍。` },
            { age: "300岁", description: `三百年潜心研究，你已接近实现永生的目标，成为生命魔法领域的第一权威。` }
          ]
        },
        {
          text: "追求元素掌控",
          outcome: `你决定深入研究元素魔法，力求在战斗和自然掌控方面达到巅峰。`,
          futureEvents: [
            { age: "50岁", description: `经过刻苦钻研，你已能同时操控多种元素，战斗力大幅提升。` },
            { age: "100岁", description: `百年苦修，你已达到大魔导师级别，能够引发大范围的元素风暴，改变局部气候。` },
            { age: "200岁", description: `你对元素的掌控已达出神入化之境，被尊为"元素之王"，但寿命仍受限于魔力消耗。` }
          ]
        },
        {
          text: "钻研空间时间魔法",
          outcome: `你沉迷于对空间和时间的研究，希望能够穿梭维度，操控时间流动。`,
          futureEvents: [
            { age: "60岁", description: `你已掌握基础的空间传送魔法，能够在短距离内自由移动。` },
            { age: "130岁", description: `多年研究后，你已能创造小型次元空间，并窥探到时间线的奥秘。` },
            { age: "350岁", description: `几个世纪的探索后，你已能在不同维度间自由穿行，甚至可以短暂地逆转时间。` }
          ]
        },
        {
          text: "创建魔法学院",
          outcome: `你决定将所学传授给后人，创建自己的魔法学院，培养新一代魔法师。`,
          futureEvents: [
            { age: "50岁", description: `你的魔法学院已初具规模，吸引了众多有天赋的学生前来学习。` },
            { age: "100岁", description: `你的学院已成为魔法世界最负盛名的学府之一，培养了无数优秀魔法师。` },
            { age: "200岁", description: `经过两个世纪的发展，你的学院已成为魔法研究的中心，你的教学体系被广泛采用。` }
          ]
        }
      ]
    };
  }
  else if (world === '未来科技世界') {
    return {
      title: "科技与能力的融合",
      description: `30岁的你已经成功将自身的${talent}能力与高科技相结合，取得了一定的成就。现在，你需要决定如何进一步发展。`,
      options: [
        {
          text: "追求身体永生",
          outcome: `你决定利用尖端科技和自身能力，探索延长寿命甚至永生的可能性。`,
          futureEvents: [
            { age: "60岁", description: `通过基因改造和纳米技术，你已成功延缓衰老，保持青春活力。` },
            { age: "100岁", description: `一个世纪的研究后，你开发出了生物机械混合体技术，将意识部分数字化。` },
            { age: "250岁", description: `你已经完全超越了人类寿命的限制，成为半机械半生物的新型生命体，引领人类进入新纪元。` }
          ]
        },
        {
          text: "开发武器系统",
          outcome: `你决定将${talent}能力用于开发先进的防御和武器系统，提升人类的安全。`,
          futureEvents: [
            { age: "50岁", description: `你设计的能力增强装甲已被特种部队采用，大幅提升了作战效能。` },
            { age: "80岁", description: `你开发的防御系统已成为行星防卫的关键组成部分，保护人类免受外星威胁。` },
            { age: "120岁", description: `你的最终作品——量子防御网络已覆盖整个太阳系，你被誉为"人类守护者"。` }
          ]
        },
        {
          text: "探索太空奥秘",
          outcome: `你决定将能力用于太空探索，寻找宇宙中的奇迹和可能的外星文明。`,
          futureEvents: [
            { age: "55岁", description: `你参与设计的星际探测器能够利用你的${talent}能力实现前所未有的探测范围。` },
            { age: "90岁", description: `借助意识上传技术，你亲自指导了第一次载人星际旅行，发现了宜居行星。` },
            { age: "180岁", description: `多次星际穿越后，你已发现多个外星文明遗迹，并解码了部分古老知识。` }
          ]
        },
        {
          text: "改造人类基因",
          outcome: `你决定利用科技和能力改造人类基因，创造更强大的下一代人类。`,
          futureEvents: [
            { age: "50岁", description: `你的基因增强技术已成功应用于自愿者，显著提升了他们的身体素质和能力。` },
            { age: "85岁", description: `你创立的"新人类计划"已获得全球认可，开始塑造人类进化的新方向。` },
            { age: "150岁", description: `在你的引导下，人类已进入有计划的进化阶段，新一代人类拥有更强大的身体素质和精神能力。` }
          ]
        }
      ]
    };
  }
  else {
    // 诡异神秘世界
    return {
      title: "神秘的选择",
      description: `30岁的你已经能够熟练运用${talent}能力，并开始理解这个诡异世界的一些规则。此时，你站在了一个重要的十字路口。`,
      options: [
        {
          text: "追寻不朽之道",
          outcome: `你决定探索世界的隐秘角落，寻找传说中能够获得永生的禁忌知识。`,
          futureEvents: [
            { age: "50岁", description: `你已接触到某些古老存在，了解到生命本质的一些奥秘。` },
            { age: "100岁", description: `通过与一位古老存在的契约，你获得了某种形式的不朽，但也付出了相应代价。` },
            { age: "？？？年", description: `时间对你已失去意义，你游走于现实与虚幻之间，观察着世界的变迁。` }
          ]
        },
        {
          text: "探索世界真相",
          outcome: `你决定揭开这个诡异世界的真相，理解它的本质和起源。`,
          futureEvents: [
            { age: "60岁", description: `多年探索后，你发现这个世界实际上是多个现实叠加的产物，充满了矛盾与悖论。` },
            { age: "90岁", description: `你找到了通往世界核心的通道，但探索过程中受到重创，不得不借助神秘力量维持生命。` },
            { age: "世界重构后", description: `在接触世界核心后，你重构了部分现实，成为了半神般的存在，但也永远无法回归普通人的生活。` }
          ]
        },
        {
          text: "掌控规则之力",
          outcome: `你尝试理解并掌握这个世界的规则，获得改变现实的能力。`,
          futureEvents: [
            { age: "55岁", description: `经过多年研究，你已能够理解并利用部分世界规则，实现一些"奇迹"。` },
            { age: "80岁", description: `你开始能够创造小范围的独立规则空间，在其中拥有近乎神明的权能。` },
            { age: "现实分叉点", description: `当你尝试修改主世界规则时，引发了现实分叉，你的意识同时存在于多个平行宇宙中。` }
          ]
        },
        {
          text: "建立神秘组织",
          outcome: `你决定聚集志同道合者，建立一个致力于研究和保护世界的神秘组织。`,
          futureEvents: [
            { age: "50岁", description: `你的组织已有数十名成员，共同探索这个世界的奥秘，抵抗危险的异常现象。` },
            { age: "75岁", description: `你的组织已成为保护世界稳定的重要力量，与多个异界存在建立了联系。` },
            { age: "120岁", description: `虽然你的肉身已老去，但你的意识被保存在组织的核心装置中，继续指导后人探索世界奥秘。` }
          ]
        }
      ]
    };
  }
};

// 生成第二个人生选择，根据第一次选择的结果来确定
const generateSecondLifeChoice = (result: ResultType, firstChoice: number): LifeChoice => {
  const { world, talent } = result;
  
  // 根据世界类型和第一次选择生成不同的第二次选择
  if (world === '修真/仙侠世界') {
    switch(firstChoice) {
      case 0: // 追求长生不老
        return {
          title: "长生之途",
          description: `经过多年修行，你已经大幅延长了寿命，但距离真正的长生不老还有一段距离。此时，你需要决定如何继续前进。`,
          options: [
            {
              text: "寻找传说中的仙丹",
              outcome: `你决定寻找传说中能够立刻提升境界的仙丹，冒险前往危险的秘境。`,
              futureEvents: [
                { age: "400岁", description: `经过数百年的寻找，你终于在一处远古遗迹中找到了炼制长生不老丹的方法。` },
                { age: "600岁", description: `成功炼制并服用仙丹后，你突破了生命桎梏，寿元大增，成为传说中的"仙人"。` },
                { age: "1000岁", description: `千年修行，你的境界已与天地同寿，肉身化作纯净能量，可随意改变形态。` }
              ]
            },
            {
              text: "修炼古老的不死身法",
              outcome: `你找到一部记载着不死身法的古籍，决定按照上面的方法修炼。`,
              futureEvents: [
                { age: "500岁", description: `苦修不死身法，你的肉身已经开始蜕变，变得坚硬如铁，百毒不侵。` },
                { age: "800岁", description: `经过漫长岁月的淬炼，你的身体几乎不受任何伤害，甚至能在极端环境下生存。` },
                { age: "2000岁", description: `两千年过去，你的身体已完全超越肉体限制，成为传说中的"不死之身"。` }
              ]
            },
            {
              text: "吸收天地灵气",
              outcome: `你决定寻找天地灵气最为浓郁的地方，通过吸收纯净灵气来延续生命。`,
              futureEvents: [
                { age: "400岁", description: `你在一处远离尘世的灵山建立洞府，日夜吸收天地精华，修为大进。` },
                { age: "700岁", description: `长期吸收灵气，你的身体已经半透明，散发着淡淡光芒，寿命大大延长。` },
                { age: "3000岁", description: `三千年修行，你的身体已经完全由精纯灵气构成，不再受肉体局限，可与天地同存。` }
              ]
            },
            {
              text: "突破位面壁垒",
              outcome: `你决定尝试突破位面壁垒，前往传说中的仙界，寻求永生之道。`,
              futureEvents: [
                { age: "500岁", description: `经过多次尝试，你终于找到了通往上界的通道，但需要更强大的力量才能通过。` },
                { age: "900岁", description: `经过漫长的准备，你终于积累了足够的能量，成功突破位面壁垒，飞升成仙。` },
                { age: "仙界纪元", description: `在仙界的时间流逝与凡间不同，你已经成为仙界的一位尊者，拥有近乎永恒的生命。` }
              ]
            }
          ]
        };
      
      case 1: // 追求极致力量
        return {
          title: "力量巅峰",
          description: `你的战力已达到修真界顶尖水平，但你仍不满足，想要追求更强大的力量。此时，你需要选择进一步的方向。`,
          options: [
            {
              text: "融合多种力量",
              outcome: `你决定尝试融合不同类型的力量，创造出前所未有的强大战力。`,
              futureEvents: [
                { age: "300岁", description: `经过多次危险的尝试，你成功将多种能量融合，创造出全新的力量体系。` },
                { age: "500岁", description: `你的力量已经突破常规修真界限，被誉为"力量之主"，无人能敌。` },
                { age: "700岁", description: `你的力量已经接近毁天灭地的程度，引起天道警惕，不得不面对天道之力的挑战。` }
              ]
            },
            {
              text: "追求武道极致",
              outcome: `你专注于纯粹的武道修炼，追求攻击力的极致。`,
              futureEvents: [
                { age: "250岁", description: `你的每一击都能开山裂石，已是修真界最强武者。` },
                { age: "400岁", description: `你创造了独特的武道体系，一招一式都蕴含天地奥义。` },
                { age: "600岁", description: `你的武道已达到可以徒手接仙器的地步，被尊为"武祖"，开创了武道新纪元。` }
              ]
            },
            {
              text: "炼化先天灵宝",
              outcome: `你寻找并尝试炼化传说中的先天灵宝，借助外物提升自身力量。`,
              futureEvents: [
                { age: "350岁", description: `你找到并成功炼化了一件上古灵宝，实力大增。` },
                { age: "600岁", description: `陆续炼化多件灵宝后，你的力量已经超越了肉身极限，成为半仙之体。` },
                { age: "1000岁", description: `千年苦修，你与灵宝完全融合，成为传说中的"器灵体"，拥有几近永恒的生命和毁天灭地的力量。` }
              ]
            },
            {
              text: "修炼禁忌秘术",
              outcome: `你决定冒险修炼一些被认为过于危险的禁忌秘术。`,
              futureEvents: [
                { age: "220岁", description: `修炼禁忌秘术使你的实力暴增，但也带来了身体的不稳定。` },
                { age: "350岁", description: `经过调整，你已能够控制禁忌之力，成为修真界最令人畏惧的存在。` },
                { age: "500岁", description: `你已完全掌握禁忌之力，创造出专属于你的力量体系，但寿命受到了一定限制。` }
              ]
            }
          ]
        };
      
      // ... 其他案例省略 ...
      default:
        // 默认情况，提供一个通用的第二次选择
        return {
          title: "进阶选择",
          description: `你已经在修真之路上取得了显著的成就，此时面临新的选择。`,
          options: [
            {
              text: "寻求突破",
              outcome: `你决定尝试突破当前境界的限制，寻求更高层次的力量。`,
              futureEvents: [
                { age: "400岁", description: `经过长期积累，你终于找到了突破的契机，成功踏入更高境界。` },
                { age: "700岁", description: `你的修为已达到一个新的高度，开始理解天地间更深层次的奥秘。` },
                { age: "1500岁", description: `经过漫长岁月的修行，你已接近传说中的大道境界，拥有改变世界的力量。` }
              ]
            },
            {
              text: "寻找传承",
              outcome: `你决定寻找上古修真者的传承，借助前人智慧提升自己。`,
              futureEvents: [
                { age: "350岁", description: `在一处远古遗迹中，你找到了失传已久的修真秘籍。` },
                { age: "600岁", description: `研习古籍多年，你已融会贯通，创造出自己独特的修炼体系。` },
                { age: "1200岁", description: `你已将古老传承发扬光大，开创了修真史上的新纪元。` }
              ]
            },
            {
              text: "寻求平衡",
              outcome: `你决定在力量与寿命之间寻求平衡，追求更加完善的修行之道。`,
              futureEvents: [
                { age: "400岁", description: `你已找到力量与寿命平衡的修炼方法，进入更加稳定的发展阶段。` },
                { age: "800岁", description: `经过调整，你的修为与寿命达到了完美平衡，成为修真界的典范。` },
                { age: "2000岁", description: `两千年的平衡修行，你已达到人仙合一的境界，拥有近乎永恒的生命。` }
              ]
            },
            {
              text: "游历世界",
              outcome: `你决定游历天下，增长见识，寻找更多的修行机缘。`,
              futureEvents: [
                { age: "300岁", description: `游历过无数秘境后，你的眼界大开，对修行有了全新的理解。` },
                { age: "600岁", description: `你已踏遍世界每一个角落，收集了无数珍贵的修炼资源和知识。` },
                { age: "1000岁", description: `千年游历后，你的经验和见识无人能及，成为修真界最受尊敬的存在之一。` }
              ]
            }
          ]
        };
    }
  }
  
  // 其他世界类型的第二次选择...
  // 这里为了简化，仅提供默认选项
  return {
    title: "人生的重要抉择",
    description: `你已经在这个世界取得了一定的成就，此时面临新的选择。`,
    options: [
      {
        text: "选择突破现有极限",
        outcome: `你决定挑战自我，寻求更大的突破。`,
        futureEvents: [
          { age: "较高年龄", description: `经过不懈努力，你成功突破了现有限制，达到了新的高度。` },
          { age: "更高年龄", description: `你的成就已经超越常人想象，成为这个领域的顶尖存在。` },
          { age: "巅峰时期", description: `你站在了巅峰，拥有了前所未有的能力和视野。` }
        ]
      },
      {
        text: "选择稳健发展",
        outcome: `你选择更加稳健的发展道路，注重基础和可持续性。`,
        futureEvents: [
          { age: "较高年龄", description: `你扎实的基础带来了长期的优势，发展稳定而持久。` },
          { age: "更高年龄", description: `你的成就虽不如一些冒险者那么耀眼，但更加稳固和长久。` },
          { age: "巅峰时期", description: `经过漫长积累，你最终也达到了令人敬仰的高度，而且更加持久。` }
        ]
      },
      {
        text: "选择传承知识",
        outcome: `你决定将自己的知识和经验传授给他人，建立自己的传承。`,
        futureEvents: [
          { age: "较高年龄", description: `你已培养出一批优秀的继承者，他们开始在各自领域崭露头角。` },
          { age: "更高年龄", description: `你的传承体系已经完善，影响力遍及广泛区域。` },
          { age: "巅峰时期", description: `你的教导已经影响了整个世代，你的名字将被永远铭记。` }
        ]
      },
      {
        text: "选择开拓新领域",
        outcome: `你决定探索未知领域，寻求全新的可能性。`,
        futureEvents: [
          { age: "较高年龄", description: `你的探索已经有了初步成果，开辟了前人未至的新天地。` },
          { age: "更高年龄", description: `你的开创性工作已经得到广泛认可，影响了整个领域的发展方向。` },
          { age: "巅峰时期", description: `你的开拓精神创造了全新的可能性，彻底改变了这个世界的面貌。` }
        ]
      }
    ]
  };
};

// 添加选择按钮样式
const ChoiceButton = styled(Button)`
  margin: 0.8rem 0;
  padding: 1rem;
  text-align: left;
  border-radius: 8px;
  width: 100%;
  white-space: normal;
  height: unset;
  background: rgba(100, 20, 150, 0.4);
  border: 1px solid rgba(186, 104, 200, 0.4);
  color: white;
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    background: rgba(140, 30, 200, 0.5);
    border-color: rgba(186, 104, 200, 0.7);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const ChoiceContainer = styled(motion.div)`
  margin: 2rem 0;
  padding: 1.5rem;
  background: rgba(60, 20, 90, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(186, 104, 200, 0.5);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
`;

const ChoiceTitle = styled.h3`
  color: #ba68c8;
  font-size: 1.4rem;
  margin-bottom: 1rem;
  text-shadow: 0 0 8px rgba(186, 104, 200, 0.4);
`;

// 为故事页面添加图像展示容器
const StoryImageContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
`;

const SuperTitle = styled.h1`
  color: #fff;
  text-align: center;
  font-size: 3.2rem;
  margin: 2.5rem 0 1.5rem 0;
  text-shadow: 0 0 24px #ba68c8, 0 0 48px #ba68c8;
  background: linear-gradient(90deg, #ba68c8 0%, #673ab7 100%);
  padding: 1.5rem 0;
  border-radius: 18px;
  font-weight: 900;
  letter-spacing: 2px;
  box-shadow: 0 8px 32px rgba(186,104,200,0.3);
`;

const CleanTimeline = styled.div`
  margin: 2.5rem 0;
  padding: 2rem 0;
  border-left: 4px solid #ba68c8;
  background: rgba(30,0,60,0.15);
  border-radius: 12px;
`;

const CleanEvent = styled.div`
  margin-bottom: 2.2rem;
  padding-left: 2.2rem;
  position: relative;
  color: #fff;
  font-size: 1.18rem;
  font-weight: 500;
  &::before {
    content: '';
    position: absolute;
    left: -14px;
    top: 8px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #ba68c8;
    box-shadow: 0 0 16px #ba68c8;
  }
`;

const CleanAge = styled.div`
  font-weight: bold;
  color: #ba68c8;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;

const CleanDesc = styled.div`
  color: #fff;
  line-height: 1.7;
`;

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
  const [lifeEvents, setLifeEvents] = useState<{ age: string, description: string }[]>([]);
  
  // 当前正在显示的生命历程索引
  const [currentLifeEventIndex, setCurrentLifeEventIndex] = useState(-1);
  
  // 添加人生选择的状态
  const [showingLifeChoice, setShowingLifeChoice] = useState(false);
  const [currentLifeChoice, setCurrentLifeChoice] = useState<LifeChoice | null>(null);
  const [choiceHistory, setChoiceHistory] = useState<number[]>([]);
  const [futureEvents, setFutureEvents] = useState<{age: string, description: string}[]>([]);
  
  // 添加图像生成相关状态
  const [currentSceneType, setCurrentSceneType] = useState<string>('');
  const [currentEvent, setCurrentEvent] = useState<string>('');
  const [userId] = useState<string>(`user-${Math.random().toString(36).substr(2, 9)}`);
  
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
  
  // 生成结果，修改为包含第一个人生选择
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
    
    // 随机选择一种穿越方式
    const isekaiMethod = isekaiMethods[Math.floor(Math.random() * isekaiMethods.length)];
    
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
        `${isekaiMethod}后，在魔法学院中发现自己的${talentType}天赋`,
        '被神秘组织盯上并追杀',
        '找到远古魔法典籍，掌握失传魔法',
        '在魔法竞技场上战胜高等法师',
        '与黑暗魔王对决'
      ];
      
      story = {
        beginning: `你原本是地球上的普通人，${isekaiMethod}。当你醒来时，发现自己身处${worldType}，被一位老法师收为弟子。在10岁那年，你被送入魔法学院学习，原本表现平平，但在一次意外中，你突然觉醒了${talentType}能力，这让所有导师都惊讶不已。`,
        middle: `随着你的能力不断提升，你引起了神秘魔法组织的注意，他们认为你的能力与古老预言有关。在逃亡途中，你偶然发现了一本远古魔法典籍，掌握了失传已久的魔法。通过不断修炼，你在魔法竞技场上战胜了多位高等法师，成为令人畏惧的存在。`,
        ending: `最终，你发现那个追杀你的组织背后站着黑暗魔王，他企图利用你的力量打开世界间的屏障。在激烈的决战中，你完全掌握了${talentType}的奥秘，成功击败了黑暗魔王，并被魔法议会封为守护者，负责维护世界和平。虽然你来自另一个世界，但现在，这里已经成为了你真正的家。`
      };
      
    } else if (worldType === '未来科技世界') {
      events = [
        `${isekaiMethod}后，通过前沿科技实验获得${talentType}能力`,
        '被政府特殊部门追踪',
        '加入反抗军组织',
        '黑入中央数据库揭露阴谋',
        '改变世界科技格局'
      ];
      
      story = {
        beginning: `你曾是地球上一个平凡的大学生，直到有一天${isekaiMethod}。当你恢复意识时，发现自己身处${worldType}的低层区域，这里的科技超出你的想象。为了生存，你努力适应这个新世界，并梦想成为一名科学家。在参与一个秘密科技实验时，意外事故使你获得了${talentType}能力，这在纯科技的世界中被视为异常现象。`,
        middle: `政府特殊部门发现了你的存在，将你列为研究对象。在逃亡途中，你遇到了一群反抗军，他们正在对抗控制世界的AI系统。利用你的特殊能力和前世的知识，你成功黑入了中央数据库，揭露了统治者利用公民数据控制社会的阴谋。`,
        ending: `在最终的对抗中，你将${talentType}与高科技完美结合，创造出全新的技术体系。你的发明打破了大公司对技术的垄断，让所有人都能平等地享受科技的便利。你成为了新时代的科技先驱，引领世界进入更加开放的未来。作为一个穿越者，你用前世的经验和这个世界的知识，创造了一个更美好的未来。`
      };
      
    } else if (worldType === '修真/仙侠世界') {
      events = [
        `${isekaiMethod}后，在宗门试炼中意外觉醒${talentType}能力`,
        '被视为异端遭受追杀',
        '发现远古遗迹中的神秘传承',
        '修为突破至超凡境界',
        '与修真界最强者对决'
      ];
      
      story = {
        beginning: `你本是现代社会中的普通上班族，一次${isekaiMethod}。魂魄穿越时空，降临在了${worldType}。你成为了青山派外门弟子，资质平庸，被同门嘲笑。一次门派试炼中，你偶然跌入古井，发现神秘石碑，触碰后昏迷三日。醒来时，前世的记忆与今生的经历交织，你体内流动着奇特的${talentType}能量。`,
        middle: `被师门视为异端的你被迫逃亡，期间偶入一处远古遗迹，发现完整的${talentType}修炼法。随着修为不断提升，你引来更多修真界强者的觊觎。你的能力对传统修真体系有天然压制作用，开始在修真界闯出名声，被称为"异能修士"。当你的修为突破至超凡境界时，终于引起了传说中的"仙道联盟"注意。`,
        ending: `当仙道联盟围攻你时，你发现${talentType}与传统灵力激烈碰撞产生共鸣，意外领悟到两种力量的融合之法。经过艰苦修炼，你创造出新的修真体系，将截然不同的力量融合，实力飙升至前所未有的境界。最终，你成为了这个世界的新型力量开创者，建立自己的宗门，打破了修真界千年不变的力量格局。你的前世经历和今生努力，成就了一段传奇。`
      };
      
    } else {
      events = [
        `${isekaiMethod}后，发现自己能看到常人看不到的${talentType}现象`,
        '被神秘组织盯上',
        '解开家族隐藏的诅咒之谜',
        '穿越到隐秘的次元空间',
        '与古老存在进行交易'
      ];
      
      story = {
        beginning: `你曾是现代社会中的一名研究生，某天晚上${isekaiMethod}。当你恢复意识时，发现自己身处${worldType}，一切都充满了神秘色彩。从穿越那天起，你就能感知到一些奇怪的现象，但没人相信你的话。在一次意外中，你完全觉醒了${talentType}能力，能够看到隐藏在现实之下的诡异世界。你发现这个世界运行着常人无法理解的规则。`,
        middle: `一个神秘组织发现了你的能力，开始对你进行监视。同时，你发现自己穿越后所附身的家族似乎与某种古老的诅咒有关。在探寻真相的过程中，你学会了利用${talentType}能力穿梭于现实与诡异空间之间，揭开了一个个惊人的秘密。你前世的科学知识与今生的诡异能力相结合，让你能够解开许多难解之谜。`,
        ending: `最终，你发现这个世界被某种古老存在所控制，而你的穿越和能力正是打破这种控制的关键。通过与古老存在进行一场危险的交易，你获得了更强大的力量，同时也承担了守护世界平衡的责任。你成为了现实与诡异之间的行者，在常人不知道的阴影中守护着这个世界的秩序。作为穿越者，你的双重视角让你成为了这个世界独一无二的存在。`
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
    const baseLifeEvents = generateLifeEvents(mockResult, isekaiMethod);
    setLifeEvents(baseLifeEvents);
    
    // 生成第一个人生选择
    const firstChoice = generateFirstLifeChoice(mockResult);
    setCurrentLifeChoice(firstChoice);
    
    // 设置为显示前几个基础事件
    setCurrentLifeEventIndex(baseLifeEvents.length - 1);
    
    // 设置状态为显示选择
    setShowingLifeChoice(true);
    
    // 设置穿越场景类型，用于图像生成
    setCurrentSceneType('isekai-moment');
    setCurrentEvent(isekaiMethod);
  };
  
  // 处理人生选择
  const handleLifeChoice = (optionIndex: number) => {
    if (!currentLifeChoice) return;
    
    // 更新选择历史
    const newChoiceHistory = [...choiceHistory, optionIndex];
    setChoiceHistory(newChoiceHistory);
    
    // 获取选择结果
    const selectedOption = currentLifeChoice.options[optionIndex];
    
    // 添加结果到生命事件中
    const newLifeEvents = [...lifeEvents, 
      { age: "关键决策", description: `${currentLifeChoice.title}：${selectedOption.outcome}` },
      ...selectedOption.futureEvents
    ];
    
    setLifeEvents(newLifeEvents);
    setFutureEvents(selectedOption.futureEvents);
    
    // 重置当前选择
    setShowingLifeChoice(false);
    setCurrentLifeChoice(null);
    
    // 显示选择后的第一个事件
    setCurrentLifeEventIndex(lifeEvents.length);
    
    // 设置定时器，每2秒显示下一个事件
    let currentIndex = lifeEvents.length;
    const interval = setInterval(() => {
      if (currentIndex < newLifeEvents.length - 1) {
        currentIndex++;
        setCurrentLifeEventIndex(currentIndex);
      } else {
        clearInterval(interval);
        
        // 判断是否需要展示第二个选择
        if (newChoiceHistory.length === 1) {
          // 显示第二个人生选择
          const secondChoice = generateSecondLifeChoice(result!, optionIndex);
          setCurrentLifeChoice(secondChoice);
          setShowingLifeChoice(true);
        }
      }
    }, 2000);
    
    return () => clearInterval(interval);
    
    // 设置选择场景类型，用于图像生成
    setCurrentSceneType('life-choice');
    setCurrentEvent(selectedOption.outcome);
  };
  
  // 重新开始测试
  const restartTest = () => {
    // 重置所有状态
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
    setShowingLifeChoice(false);
    setCurrentLifeChoice(null);
    setChoiceHistory([]);
    setFutureEvents([]);
    
    // 重置图像状态
    setCurrentSceneType('');
    setCurrentEvent('');
  };
  
  // 修改返回上一步逻辑，避免回到已删除的步骤
  const goBack = () => {
    if (stage === TestStage.STORY || stage === TestStage.RESULT) {
      // 直接重新开始测试，而不是返回中间状态
      restartTest();
    } else if (stage !== TestStage.INTRO) {
      // 如果不是介绍页，直接回到介绍页
      setStage(TestStage.INTRO);
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
  
  // 修改渲染问题页面，使标题更明显
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
        <PageTitle>多维世界穿越测试</PageTitle>
        
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
          <SectionTitle>
            {sectionTitles[currentSection]} - 问题 {currentQuestionIndex + 1}/{currentQuestions.length}
          </SectionTitle>
          
          <Paragraph style={{ color: 'white', fontSize: '1.2rem', marginBottom: '2rem', fontWeight: '500' }}>
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
        
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1rem' }}>
          <BackButton 
            icon={<ArrowLeftOutlined />}
            onClick={goBack}
          >
            返回首页
          </BackButton>
        </div>
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
  
  // 修改故事页面，添加人生选择功能
  const renderStoryPage = () => {
    if (!result) return null;
    
    const { story } = result;
    
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 0' }}>
        <SuperTitle>🌌 你的异世界穿越历程 🌌</SuperTitle>
        <StoryImageContainer>
          <ImageDisplay
            sceneType="isekai-moment"
            worldType={result.world}
            talent={result.talent}
            event="穿越瞬间"
            userId={userId}
          />
        </StoryImageContainer>
        <CleanTimeline>
          {lifeEvents.map((event, idx) => (
            <CleanEvent key={idx}>
              <CleanAge>{event.age}</CleanAge>
              <CleanDesc>{event.description}</CleanDesc>
              {/* 每个关键节点都展示AI图片 */}
              {(event.age === '穿越瞬间' || event.age === '能力觉醒' || event.age === '30岁' || event.age === '35岁') && (
                <StoryImageContainer>
                  <ImageDisplay
                    sceneType={
                      event.age === '穿越瞬间' ? 'isekai-moment' :
                      event.age === '能力觉醒' ? 'ability-awakening' :
                      event.age === '30岁' ? 'life-choice' :
                      'final-form'
                    }
                    worldType={result.world}
                    talent={result.talent}
                    event={event.description}
                    userId={userId}
                  />
                </StoryImageContainer>
              )}
            </CleanEvent>
          ))}
        </CleanTimeline>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
          <button style={{
            background: 'linear-gradient(90deg, #ba68c8 0%, #673ab7 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '1rem 2.5rem',
            fontSize: '1.2rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(186,104,200,0.2)'
          }} onClick={restartTest}>重新测试</button>
        </div>
      </div>
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