import { MBTIQuestion, MBTIType, JojoCharacter, MBTITestResult, MBTIDimension } from '../types/mbti';

// 角色名称与英文图片文件名映射
export const characterImageMap: Record<string, string> = {
  '乔纳森·乔斯达': 'Jonathan_Joestar',
  '迪奥·布兰度': 'Dio',
  '约瑟夫·乔斯达': 'Joseph_Joestar',
  '西撒·齐贝林': 'Ceaser_Zeppeli',
  '空条承太郎': 'Jotaro_Kujo',
  '花京院典明': 'Noriaki_Kakyoin',
  '东方仗助': 'Josuke',
  '岸边露伴': 'Rohank',
  '乔鲁诺·乔巴拿': 'Giorno_Giovanna',
  '布加拉提': 'Buccellati',
  '空条徐伦': 'Jolyne (1)',
  '迪亚波罗': 'Diavolo',
  '杰洛·齐贝林': 'Gyro',
  '吉良吉影': 'Yoshikage_Kira',
  '福葛': 'Fugo',
  '纳兰迦': 'Narancia_ASBR',
  '透龙': 'Tooru_Infobox_Manga',
  '田最环': 'Tamaki Damo',
  '乔尼·乔斯达': 'Johnny_Joestar',
  '瓦姆乌': 'Wamuu',
  '普奇神父': 'Pucci',
  '法尼·瓦伦泰': 'Valentine',
  '埃尔梅斯·科斯特洛': 'Ermes',
  '天气预报': 'Weather Reporter',
  '史比特·瓦根': 'Speed_Weed',
  '迪埃哥·布兰度': 'Diego_ASBR',
  '波可洛可': 'Pocoloco_Infobox_Manga',
  '沙男': 'sandman',
  '露西·斯蒂尔': 'Lucy_Steel_Infobox_Manga',
  '纳尔齐索·安纳苏': 'Anasui',
  '福·法特斯': 'Foo_Fighters',
  '安波里欧': 'Emporio_Promotional',
  '东方定助': 'Josuke_8',
  '乔迪欧': 'Jodio'
};

// MBTI测试问题
export const mbtiQuestions: MBTIQuestion[] = [
  {
    id: 1,
    text: '面对危险情况时，你更倾向于：',
    options: [
      { text: '直接面对挑战', value: 'E' },
      { text: '冷静分析局势', value: 'I' },
      { text: '寻求团队协作', value: 'F' },
      { text: '制定详细计划', value: 'J' }
    ]
  },
  {
    id: 2,
    text: '当你遇到强大的对手时：',
    options: [
      { text: '越战越勇，不断突破自己', value: 'E' },
      { text: '观察对方弱点，寻找战胜方法', value: 'T' },
      { text: '思考如何保护同伴安全', value: 'F' },
      { text: '先撤退，等更充分准备后再战', value: 'J' }
    ]
  },
  {
    id: 3,
    text: '你认为力量的本质是：',
    options: [
      { text: '坚定不移的信念和意志', value: 'J' },
      { text: '超越常人的智慧和洞察力', value: 'N' },
      { text: '保护所爱之人的能力', value: 'F' },
      { text: '适应各种情况的灵活战术', value: 'P' }
    ]
  },
  {
    id: 4,
    text: '你更喜欢哪种战斗方式：',
    options: [
      { text: '近距离的强力交锋', value: 'S' },
      { text: '远程操控，策略为主', value: 'N' },
      { text: '快速移动，灵活应对', value: 'P' },
      { text: '精准打击对手弱点', value: 'T' }
    ]
  },
  {
    id: 5,
    text: '面对不公正的事情，你会：',
    options: [
      { text: '挺身而出，主持正义', value: 'E' },
      { text: '详细调查后再采取行动', value: 'I' },
      { text: '从情感角度考虑各方感受', value: 'F' },
      { text: '理性分析是非对错', value: 'T' }
    ]
  },
  {
    id: 6,
    text: '当朋友有困难时，你会：',
    options: [
      { text: '不顾一切去帮助他们', value: 'F' },
      { text: '分析情况，提供实际解决方案', value: 'T' },
      { text: '鼓励他们自己解决问题', value: 'I' },
      { text: '组织资源和人员提供援助', value: 'E' }
    ]
  },
  {
    id: 7,
    text: '你如何看待命运：',
    options: [
      { text: '命运是可以改变的，靠自己的行动', value: 'J' },
      { text: '命运自有安排，顺其自然即可', value: 'P' },
      { text: '命运是复杂的网络，需要理解其规律', value: 'N' },
      { text: '只相信眼前看到的事实，不谈命运', value: 'S' }
    ]
  },
  {
    id: 8,
    text: '你更注重：',
    options: [
      { text: '传承和责任', value: 'J' },
      { text: '自由和可能性', value: 'P' },
      { text: '真相和知识', value: 'T' },
      { text: '人际关系和和谐', value: 'F' }
    ]
  },
  {
    id: 9,
    text: '你更喜欢哪种能力：',
    options: [
      { text: '能改变物理世界的能力', value: 'S' },
      { text: '能洞察人心或预知未来的能力', value: 'N' },
      { text: '能治愈或保护他人的能力', value: 'F' },
      { text: '能控制或操纵环境的能力', value: 'J' }
    ]
  },
  {
    id: 10,
    text: '面对挫折时，你通常会：',
    options: [
      { text: '坚持不懈，直到成功', value: 'J' },
      { text: '寻找替代方案和新思路', value: 'P' },
      { text: '分析失败原因，总结经验', value: 'T' },
      { text: '依靠朋友和同伴的支持', value: 'F' }
    ]
  },
  {
    id: 11,
    text: '当你获得新能力时，你会：',
    options: [
      { text: '立即尝试各种应用方式', value: 'P' },
      { text: '系统地训练掌握它', value: 'J' },
      { text: '思考如何用它解决实际问题', value: 'S' },
      { text: '探索它的深层原理和潜力', value: 'N' }
    ]
  },
  {
    id: 12,
    text: '你的战斗风格更偏向：',
    options: [
      { text: '华丽而不可预测', value: 'N' },
      { text: '简单直接但有效', value: 'S' },
      { text: '灵活多变，随机应变', value: 'P' },
      { text: '有条不紊，步步为营', value: 'J' }
    ]
  },
  {
    id: 13,
    text: '你更看重：',
    options: [
      { text: '忠诚和诚信', value: 'F' },
      { text: '智慧和才能', value: 'T' },
      { text: '勇气和决断', value: 'E' },
      { text: '冷静和克制', value: 'I' }
    ]
  },
  {
    id: 14,
    text: '如果可以选择，你希望成为：',
    options: [
      { text: '受人尊敬的领袖', value: 'E' },
      { text: '智慧的战略家', value: 'I' },
      { text: '守护和平的战士', value: 'F' },
      { text: '追求真理的探索者', value: 'T' }
    ]
  },
  {
    id: 15,
    text: '在团队中，你通常扮演：',
    options: [
      { text: '鼓舞士气的领导者', value: 'E' },
      { text: '解决问题的智囊', value: 'T' },
      { text: '维持团队和谐的调解者', value: 'F' },
      { text: '注重细节的执行者', value: 'S' }
    ]
  },
  {
    id: 16,
    text: '你认为最好的战略是：',
    options: [
      { text: '出其不意，攻其不备', value: 'N' },
      { text: '硬碰硬，正面击败对手', value: 'S' },
      { text: '灵活应变，随机应对', value: 'P' },
      { text: '周密计划，稳步推进', value: 'J' }
    ]
  }
];

// JOJO角色与MBTI类型对应关系
export const jojoCharacters: JojoCharacter[] = [
  {
    name: '乔纳森·乔斯达',
    mbtiType: 'ENFJ',
    description: '正直无畏的绅士，为了正义和保护所爱的人不惜一切代价',
    stand: '无',
    ability: '波纹',
    part: 1
  },
  {
    name: '迪奥·布兰度',
    mbtiType: 'ENTJ',
    description: '野心勃勃，追求力量与支配，聪明而残忍',
    stand: '世界',
    ability: '时间停止',
    part: 1
  },
  {
    name: '约瑟夫·乔斯达',
    mbtiType: 'ESTP',
    description: '机智灵活，善于随机应变，幽默而有策略',
    stand: '隐者紫',
    ability: '波纹与隐者紫的念写',
    part: 2
  },
  {
    name: '西撒·齐贝林',
    mbtiType: 'ENFP',
    description: '充满激情的战士，重视友情，为理想奋斗到最后',
    stand: '无',
    ability: '波纹',
    part: 2
  },
  {
    name: '空条承太郎',
    mbtiType: 'ISTP',
    description: '冷静沉着，极少表露情感，但内心正义感强烈',
    stand: '白金之星',
    ability: '近距离高精度格斗与时间停止',
    part: 3
  },
  {
    name: '花京院典明',
    mbtiType: 'INFJ',
    description: '有智慧且富有洞察力，温和但意志坚定',
    stand: '法皇的绿宝石',
    ability: '操控绿宝石形态的念力',
    part: 3
  },
  {
    name: '东方仗助',
    mbtiType: 'ESFP',
    description: '热情开朗，重视朋友，看似粗犷但内心善良',
    stand: '疯狂钻石',
    ability: '修复物体和治疗',
    part: 4
  },
  {
    name: '岸边露伴',
    mbtiType: 'INTJ',
    description: '才华横溢但傲慢，追求艺术完美，观察力极强',
    stand: '天堂之门',
    ability: '将人变成书并写入命令',
    part: 4
  },
  {
    name: '乔鲁诺·乔巴拿',
    mbtiType: 'INFJ',
    description: '沉着冷静，有远大抱负，追求正义但方式非传统',
    stand: '黄金体验',
    ability: '赋予生命和创造生物',
    part: 5
  },
  {
    name: '布加拉提',
    mbtiType: 'ENFJ',
    description: '正直勇敢的领导者，关心团队每个成员，坚守原则',
    stand: '钢链手指',
    ability: '创造拉链和空间穿越',
    part: 5
  },
  {
    name: '空条徐伦',
    mbtiType: 'ISFP',
    description: '坚韧不拔，表面冷酷但内心敏感，为保护所爱而战',
    stand: '石之自由',
    ability: '将身体变成线并操控',
    part: 6
  },
  {
    name: '迪亚波罗',
    mbtiType: 'ISTJ',
    description: '完美主义者，偏执且谨慎，追求绝对控制',
    stand: '绯红之王',
    ability: '消除时间和预知未来',
    part: 5
  },
  {
    name: '杰洛·齐贝林',
    mbtiType: 'ESTP',
    description: '机智勇敢的赛马手，坚定执着，为目标不惜一切',
    stand: '无',
    ability: '旋转',
    part: 7
  },
  {
    name: '吉良吉影',
    mbtiType: 'ISTJ',
    description: '追求平静生活的连环杀手，有强迫症倾向，谨慎且有条理',
    stand: '杀手皇后',
    ability: '将触碰物体变成炸弹',
    part: 4
  },
  {
    name: '福葛',
    mbtiType: 'INTP',
    description: '聪明冷静的战略家，分析能力强，重视逻辑和效率',
    stand: '紫烟',
    ability: '预测和远程操控',
    part: 5
  },
  {
    name: '纳兰迦',
    mbtiType: 'ESFP',
    description: '热情冲动，情绪化但忠诚，渴望认可',
    stand: '空气史密斯',
    ability: '缩小自己和物体',
    part: 5
  },
  {
    name: '透龙',
    mbtiType: 'INTP',
    description: '冷静沉着，思维缜密，隐藏自己的真实目的',
    stand: 'Wonder of U',
    ability: '因果转移与灾厄制造',
    part: 8
  },
  {
    name: '田最环',
    mbtiType: 'ISTJ',
    description: '条理分明的完美主义者，做事有条不紊，对细节非常关注',
    stand: 'Vitamin C',
    ability: '使物体和人变软',
    part: 8
  },
  {
    name: '乔尼·乔斯达',
    mbtiType: 'INFP',
    description: '敏感内省的理想主义者，有坚定的个人信念，追求成长',
    stand: 'Tusk',
    ability: '旋转与指甲发射',
    part: 7
  },
  {
    name: '瓦姆乌',
    mbtiType: 'ISFJ',
    description: '忠诚尽责的战士，尊重传统和荣誉，遵守战斗规则',
    stand: '无',
    ability: '神圣的沙岚',
    part: 2
  },
  {
    name: '普奇神父',
    mbtiType: 'INTJ',
    description: '有远见的策略家，追求最终目标，不畏艰难',
    stand: 'White Snake/C-Moon/Made in Heaven',
    ability: '记忆与替身提取/重力操控/时间加速',
    part: 6
  },
  {
    name: '法尼·瓦伦泰',
    mbtiType: 'ESTJ',
    description: '果断的领导者，为国家利益不惜一切，遵循自己的道德准则',
    stand: 'D4C',
    ability: '穿越平行世界',
    part: 7
  },
  {
    name: '埃尔梅斯·科斯特洛',
    mbtiType: 'ESFJ',
    description: '外向关爱的保护者，重视人际关系，为家人复仇不惜一切',
    stand: 'Kiss',
    ability: '复制物体和伤害转移',
    part: 6
  },
  {
    name: '天气预报',
    mbtiType: 'INFP',
    description: '沉默但内心富有感情，寻找自我身份，富有同情心',
    stand: 'Weather Report',
    ability: '控制天气现象',
    part: 6
  },
  {
    name: '史比特·瓦根',
    mbtiType: 'ESFJ',
    description: '忠诚可靠的朋友，热情好客，致力于帮助乔斯达家族',
    stand: '无',
    ability: '敏锐的直觉',
    part: 1
  },
  {
    name: '迪埃哥·布兰度',
    mbtiType: 'ENTP',
    description: '机智灵活的策略家，适应力强，追求胜利不择手段',
    stand: 'Scary Monsters',
    ability: '恐龙变形与恐龙控制',
    part: 7
  },
  {
    name: '波可洛可',
    mbtiType: 'ENFP',
    description: '乐观开朗的赛马手，相信运气，随遇而安',
    stand: 'Hey Ya!',
    ability: '给予鼓励和信心',
    part: 7
  },
  {
    name: '沙男',
    mbtiType: 'ISTP',
    description: '独立冷静的战士，遵循自己的道路，精通追踪技巧',
    stand: 'In a Silent Way',
    ability: '声音实体化',
    part: 7
  },
  {
    name: '露西·斯蒂尔',
    mbtiType: 'ISFJ',
    description: '敏感谨慎的少女，忠诚勇敢，在危难中成长',
    stand: '无',
    ability: '策略与情报收集',
    part: 7
  },
  {
    name: '纳尔齐索·安纳苏',
    mbtiType: 'ISTP',
    description: '冷静而不按常理出牌，追求自己的目标，具有战术头脑',
    stand: 'Diver Down',
    ability: '物体内部穿越与储存能量',
    part: 6
  },
  {
    name: '福·法特斯',
    mbtiType: 'INTP',
    description: '好奇心旺盛，喜欢探索世界，学习能力强',
    stand: 'Foo Fighters',
    ability: '控制浮游生物与水',
    part: 6
  },
  {
    name: '安波里欧',
    mbtiType: 'INTP',
    description: '聪明机智的孩子，懂得利用有限资源，适应力强',
    stand: 'Burning Down the House',
    ability: '幽灵房间控制',
    part: 6
  },
  {
    name: '东方定助',
    mbtiType: 'ISFP',
    description: '内敛而坚定，寻找自我身份，有强烈的正义感',
    stand: 'Soft & Wet',
    ability: '泡泡与物质剥离',
    part: 8
  },
  {
    name: '乔迪欧',
    mbtiType: 'ESTP',
    description: '机智灵活的年轻人，热爱冒险，应变能力强',
    stand: 'November Rain',
    ability: '引导雨水攻击',
    part: 9
  }
];

// 添加本地存储键名常量
const JOJO_MBTI_RESULTS = 'jojo-mbti-results';
const JOJO_RECENT_CHARACTERS = 'jojo-recent-characters';

// 计算MBTI测试结果
export function calculateMBTIResult(answers: MBTIDimension[]): MBTITestResult {
  // 统计各维度得分
  const scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };
  
  // 累计得分
  answers.forEach(dimension => {
    scores[dimension]++;
  });
  
  // 确定最终MBTI类型
  const mbtiType = (
    (scores.E > scores.I ? 'E' : 'I') +
    (scores.S > scores.N ? 'S' : 'N') +
    (scores.T > scores.F ? 'T' : 'F') +
    (scores.J > scores.P ? 'J' : 'P')
  ) as MBTIType;
  
  // 匹配JOJO角色
  const matchedCharacter = findMatchingCharacter(mbtiType);
  
  // 生成描述
  const description = generateMBTIDescription(mbtiType, matchedCharacter);
  
  return {
    mbtiType,
    character: matchedCharacter,
    description,
    dimensionScores: scores
  };
}

// 查找匹配的JOJO角色
function findMatchingCharacter(mbtiType: MBTIType): JojoCharacter {
  // 获取最近匹配的角色以避免重复
  const recentCharacters = getRecentCharacters();
  
  // 尝试找完全匹配的角色
  const exactMatches = jojoCharacters.filter(char => char.mbtiType === mbtiType);
  
  if (exactMatches.length > 0) {
    // 过滤出未在最近显示过的角色
    const freshMatches = exactMatches.filter(char => 
      !recentCharacters.some(recent => 
        recent.mbtiType === mbtiType && recent.characterName === char.name
      )
    );
    
    // 如果有未显示过的角色，随机选择一个
    if (freshMatches.length > 0) {
      const selected = freshMatches[Math.floor(Math.random() * freshMatches.length)];
      // 记录这个角色已被选择
      addRecentCharacter(mbtiType, selected.name);
      return selected;
    }
    
    // 如果所有角色都已显示过，或者只有一个角色，随机选择一个
    const selected = exactMatches[Math.floor(Math.random() * exactMatches.length)];
    // 记录这个角色已被选择
    addRecentCharacter(mbtiType, selected.name);
    return selected;
  }
  
  // 如果没有完全匹配，找最接近的（至少3个字母相同）
  const closeMatches = jojoCharacters.filter(char => {
    let matchCount = 0;
    for (let i = 0; i < 4; i++) {
      if (char.mbtiType[i] === mbtiType[i]) matchCount++;
    }
    return matchCount >= 3;
  });
  
  if (closeMatches.length > 0) {
    // 过滤出未在最近显示过的角色
    const freshMatches = closeMatches.filter(char => 
      !recentCharacters.some(recent => 
        recent.mbtiType === mbtiType && recent.characterName === char.name
      )
    );
    
    // 如果有未显示过的角色，随机选择一个
    if (freshMatches.length > 0) {
      const selected = freshMatches[Math.floor(Math.random() * freshMatches.length)];
      addRecentCharacter(mbtiType, selected.name);
      return selected;
    }
    
    const selected = closeMatches[Math.floor(Math.random() * closeMatches.length)];
    addRecentCharacter(mbtiType, selected.name);
    return selected;
  }
  
  // 如果没有接近的匹配，退化为找至少2个字母相同的
  const looseMatches = jojoCharacters.filter(char => {
    let matchCount = 0;
    for (let i = 0; i < 4; i++) {
      if (char.mbtiType[i] === mbtiType[i]) matchCount++;
    }
    return matchCount >= 2;
  });
  
  if (looseMatches.length > 0) {
    // 过滤出未在最近显示过的角色
    const freshMatches = looseMatches.filter(char => 
      !recentCharacters.some(recent => 
        recent.mbtiType === mbtiType && recent.characterName === char.name
      )
    );
    
    if (freshMatches.length > 0) {
      const selected = freshMatches[Math.floor(Math.random() * freshMatches.length)];
      addRecentCharacter(mbtiType, selected.name);
      return selected;
    }
    
    const selected = looseMatches[Math.floor(Math.random() * looseMatches.length)];
    addRecentCharacter(mbtiType, selected.name);
    return selected;
  }
  
  // 最后的情况，随机返回一个角色
  const selected = jojoCharacters[Math.floor(Math.random() * jojoCharacters.length)];
  addRecentCharacter(mbtiType, selected.name);
  return selected;
}

// 获取最近显示的角色列表
interface RecentCharacter {
  mbtiType: MBTIType;
  characterName: string;
  timestamp: number;
}

// 获取最近显示的角色
function getRecentCharacters(): RecentCharacter[] {
  try {
    const stored = localStorage.getItem(JOJO_RECENT_CHARACTERS);
    const characters = stored ? JSON.parse(stored) as RecentCharacter[] : [];
    
    // 只保留最近7天内的记录
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return characters.filter(char => char.timestamp > sevenDaysAgo);
  } catch (error) {
    console.error('获取最近角色记录失败:', error);
    return [];
  }
}

// 添加一个角色到最近显示列表
function addRecentCharacter(mbtiType: MBTIType, characterName: string): void {
  try {
    const characters = getRecentCharacters();
    
    // 添加新记录
    characters.push({
      mbtiType,
      characterName,
      timestamp: Date.now()
    });
    
    // 对于每个MBTI类型，只保留最近的3个记录
    const typeCharacters: { [key: string]: RecentCharacter[] } = {};
    
    // 按类型分组
    characters.forEach(char => {
      if (!typeCharacters[char.mbtiType]) {
        typeCharacters[char.mbtiType] = [];
      }
      typeCharacters[char.mbtiType].push(char);
    });
    
    // 对每个类型，按时间戳排序并只保留最近3个
    const filteredCharacters: RecentCharacter[] = [];
    Object.keys(typeCharacters).forEach(type => {
      const sorted = typeCharacters[type].sort((a, b) => b.timestamp - a.timestamp);
      filteredCharacters.push(...sorted.slice(0, 3));
    });
    
    // 保存更新后的列表
    localStorage.setItem(JOJO_RECENT_CHARACTERS, JSON.stringify(filteredCharacters));
  } catch (error) {
    console.error('保存最近角色记录失败:', error);
  }
}

// 生成MBTI描述
function generateMBTIDescription(mbtiType: MBTIType, character: JojoCharacter): string {
  // MBTI类型描述
  const mbtiDescriptions: Record<MBTIType, string> = {
    'ISTJ': '严谨理性的实干家，注重细节和规则，可靠而负责任',
    'ISFJ': '温和忠诚的守护者，乐于助人，注重传统和稳定',
    'INFJ': '有远见的理想主义者，有深度的洞察力和坚定的价值观',
    'INTJ': '独立思考的策略家，有创新思维和强大的内在驱动力',
    'ISTP': '灵活务实的探险家，有出色的问题解决能力和冷静判断力',
    'ISFP': '敏感艺术的创作者，重视自由和独特体验',
    'INFP': '富有理想的梦想家，追求内在和谐和个人价值',
    'INTP': '创新逻辑的思想家，喜欢分析复杂问题和探索可能性',
    'ESTP': '活力四射的冒险家，灵活应变，享受当下',
    'ESFP': '热情开朗的表演者，喜欢成为焦点，乐于分享快乐',
    'ENFP': '充满激情的创新者，对可能性充满热情，善于激励他人',
    'ENTP': '机智灵活的辩论家，喜欢挑战和创新，思维敏捷',
    'ESTJ': '高效务实的管理者，重视秩序和明确目标',
    'ESFJ': '热心友善的协调者，重视和谐和团队合作',
    'ENFJ': '富有魅力的领导者，善于激励他人，追求共同成长',
    'ENTJ': '果断坚定的指挥官，有战略眼光和领导才能'
  };
  
  return `你的MBTI类型是${mbtiType}，${mbtiDescriptions[mbtiType]}。在JOJO的奇妙冒险中，你最像的角色是${character.name}，${character.description}。你的替身是「${character.stand || '尚未觉醒'}」，能力是${character.ability || '尚未发现'}。`;
}

// 生成分享文案
export function generateShareText(result: MBTITestResult): string {
  return `我在JOJO的奇妙冒险MBTI测试中获得了${result.mbtiType}类型，我最像的角色是${result.character.name}！我的替身是「${result.character.stand || '尚未觉醒'}」！来测测你是谁？`;
}

// 保存测试结果到本地存储
export function saveTestResult(result: MBTITestResult): void {
  try {
    const results = getStoredResults();
    results.push({
      ...result,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(JOJO_MBTI_RESULTS, JSON.stringify(results));
  } catch (error) {
    console.error('保存测试结果失败:', error);
  }
}

// 获取存储的测试结果
export function getStoredResults(): (MBTITestResult & { timestamp: string })[] {
  try {
    const stored = localStorage.getItem(JOJO_MBTI_RESULTS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('获取测试结果失败:', error);
    return [];
  }
}

// 清除所有测试结果
export function clearStoredResults(): void {
  try {
    localStorage.removeItem(JOJO_MBTI_RESULTS);
  } catch (error) {
    console.error('清除测试结果失败:', error);
  }
}

// 获取最新的测试结果
export function getLatestResult(): (MBTITestResult & { timestamp: string }) | null {
  const results = getStoredResults();
  return results.length > 0 ? results[results.length - 1] : null;
} 