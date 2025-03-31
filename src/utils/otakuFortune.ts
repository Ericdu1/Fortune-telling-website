import { FortuneCategory, DailyRecommend, DailyEvents, ReleaseType, Release } from '../types/fortune';

const GAME_EVENTS = {
  GOOD: [
    '今天适合打排位赛，状态会很好',
    '可能会抽到心仪的角色/皮肤',
    '将遇到有趣的游戏队友',
    '有机会获得稀有道具/成就',
    '游戏技术会有突破性提升',
    '适合尝试新游戏，会有惊喜',
    '团队配合会特别顺利',
    'PVP手感极佳',
    '适合farm装备和资源',
    '今天的副本通关率很高'
  ],
  BAD: [
    '容易遇到演员或坑队友',
    '抽卡可能会歪',
    '容易遇到Bug或掉线',
    '手感可能不太好',
    '容易遇到高难度副本',
    '氪金需要谨慎',
    'PVP可能会遇到大佬',
    '容易错过限时活动',
    '游戏容易走神发呆',
    '容易沉迷游戏忘记时间'
  ]
} as const;

const ANIME_EVENTS = {
  GOOD: [
    '今天会遇到喜欢的动漫/漫画更新',
    '可能会发现有趣的新番',
    '适合cos拍照，状态绝佳',
    '将看到令人惊喜的剧情发展',
    '会遇到志同道合的二次元朋友',
    '适合创作同人作品',
    '可能会抽到心仪的手办',
    '会发现隐藏的神作动画',
    '适合参加漫展或线上活动',
    '今天的画风会特别在线'
  ],
  BAD: [
    '可能会遇到剧透',
    '喜欢的角色可能会便当',
    '动画可能会停更或延期',
    '创作灵感可能不足',
    '手办可能会延期发售',
    '可能会错过限定周边',
    '画风可能不在线',
    '容易陷入二次元黑洞',
    '可能会被现充打扰',
    '社死预警'
  ]
} as const;

const FORTUNE_LEVELS = ['SSR', 'SR', 'R', 'N'] as const;
const FORTUNE_LEVEL_WEIGHTS = [10, 20, 40, 30] as const;

function getRandomElement<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getWeightedLevel(): 'SSR' | 'SR' | 'R' | 'N' {
  const total = FORTUNE_LEVEL_WEIGHTS.reduce((a, b) => a + b, 0);
  const rand = Math.random() * total;
  let sum = 0;
  
  for (let i = 0; i < FORTUNE_LEVEL_WEIGHTS.length; i++) {
    sum += FORTUNE_LEVEL_WEIGHTS[i];
    if (rand < sum) {
      return FORTUNE_LEVELS[i];
    }
  }
  
  return 'N';
}

function generateFortuneCategory(
  goodEvents: readonly string[],
  badEvents: readonly string[],
  name: string
): FortuneCategory {
  const level = getWeightedLevel();
  const isGood = level === 'SSR' || level === 'SR';
  const events = isGood ? goodEvents : badEvents;
  
  return {
    name,
    level,
    description: getRandomElement(events),
    advice: isGood 
      ? '今天适合大展身手，相信自己的直觉行动。'
      : '需要谨慎行事，不要轻易冒险。'
  };
}

// 模拟数据，实际应用中应该从API获取
const SAMPLE_ANIME_DATA = {
  updates: [
    { title: '咒术回战', episode: 12, time: '22:00' },
    { title: '葬送的芙莉莲', episode: 8, time: '23:00' },
    { title: '16bit的感动', episode: 5, time: '23:30' }
  ],
  birthdays: [
    { character: '初音未来', from: 'VOCALOID' },
    { character: '雪之下雪乃', from: '我的青春恋爱物语果然有问题' }
  ],
  releases: [
    { title: '葬送的芙莉莲', type: 'ANIME' as ReleaseType },
    { title: '咒术回战 第二季', type: 'ANIME' as ReleaseType },
    { title: '间谍过家家 第二季', type: 'ANIME' as ReleaseType }
  ] as Release[]
};

const SAMPLE_GAME_DATA = {
  events: [
    { game: '原神', event: '新角色限时祈愿', endTime: '2024-03-20' },
    { game: '崩坏：星穹铁道', event: '春节活动', endTime: '2024-03-15' },
    { game: '明日方舟', event: '联动活动', endTime: '2024-03-25' }
  ],
  releases: [
    { title: '原神 4.2', type: 'GAME' as ReleaseType, platform: 'PC/Mobile' },
    { title: '崩坏：星穹铁道 1.5', type: 'GAME' as ReleaseType, platform: 'PC/Mobile' },
    { title: '赛博朋克 2077：幻生', type: 'GAME' as ReleaseType, platform: 'PC/Console' }
  ] as Release[]
};

export function generateDailyCategories() {
  return {
    game: generateFortuneCategory(GAME_EVENTS.GOOD, GAME_EVENTS.BAD, '游戏运势'),
    anime: generateFortuneCategory(ANIME_EVENTS.GOOD, ANIME_EVENTS.BAD, '二次元运势'),
    create: generateFortuneCategory(ANIME_EVENTS.GOOD, ANIME_EVENTS.BAD, '创作运势'),
    social: generateFortuneCategory(GAME_EVENTS.GOOD, GAME_EVENTS.BAD, '社交运势')
  };
}

export function generateDailyRecommend(): DailyRecommend {
  return {
    anime: {
      title: '葬送的芙莉莲',
      episode: '第8话',
      reason: '今天的剧情发展会让你惊喜',
      imageUrl: '/Fortune-telling-website/images/anime/frieren.jpg'
    },
    game: {
      title: 'FF7 REBIRTH',
      type: 'JRPG',
      reason: '今天适合开启新的冒险',
      imageUrl: '/Fortune-telling-website/images/games/ff7r.jpg'
    },
    music: {
      title: 'PHOENIX',
      artist: '陈致逸 / HOYO-MiX',
      type: 'GAME_BGM',
      url: 'https://music.163.com/song?id=2222222'
    }
  };
}

export function generateDailyEvents(): DailyEvents {
  return {
    animeUpdates: SAMPLE_ANIME_DATA.updates,
    gameEvents: SAMPLE_GAME_DATA.events,
    birthdays: SAMPLE_ANIME_DATA.birthdays,
    releases: [...SAMPLE_ANIME_DATA.releases, ...SAMPLE_GAME_DATA.releases]
  };
} 