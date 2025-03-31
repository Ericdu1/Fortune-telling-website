import { DailyFortune } from '../types/fortune';
import { getRandomPopularArtwork } from './pixiv';
import { formatDate } from './date';
import { generateDailyCategories, generateDailyRecommend, generateDailyEvents } from './otakuFortune';

const FORTUNE_TAGS = {
  GAME: ['手感爆发', '欧气满满', '氪金谨慎', '佛系游戏', '认真练习'],
  ANIME: ['二次元之光', '宅家快乐', '剧情深入', '创作灵感', '社交顺利'],
  GACHA: ['欧皇降临', '概率提升', '量力而行', '重点关注', '保底准备'],
  SOCIAL: ['破圈交友', '展会吉利', '互动良好', '梗王附体', '话题制造']
} as const;

function getRandomElements<T>(array: readonly T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function generateFortuneTags(categories: DailyFortune['categories']): string[] {
  const tags: string[] = [];
  
  // 根据各个类别的等级选择标签
  if (categories.game.level === 'SSR' || categories.game.level === 'SR') {
    tags.push(...getRandomElements(FORTUNE_TAGS.GAME, 1));
  }
  if (categories.anime.level === 'SSR' || categories.anime.level === 'SR') {
    tags.push(...getRandomElements(FORTUNE_TAGS.ANIME, 1));
  }
  if (categories.social.level === 'SSR' || categories.social.level === 'SR') {
    tags.push(...getRandomElements(FORTUNE_TAGS.SOCIAL, 1));
  }
  
  // 如果标签不足3个，从GACHA中随机补充
  while (tags.length < 3) {
    tags.push(...getRandomElements(FORTUNE_TAGS.GACHA, 1));
  }
  
  return tags;
}

function generateFortuneContent(categories: DailyFortune['categories']): string {
  const levels = Object.values(categories).map(cat => cat.level);
  const overallLuck = levels.filter(level => level === 'SSR' || level === 'SR').length;
  
  let content = `今日运势：${overallLuck >= 3 ? '大吉' : overallLuck >= 2 ? '吉' : overallLuck >= 1 ? '平' : '凶'}\n\n`;
  
  // 添加各个类别的运势
  Object.entries(categories).forEach(([key, category]) => {
    content += `${category.name}【${category.level}】：\n`;
    content += `• ${category.description}\n`;
    content += `建议：${category.advice}\n\n`;
  });
  
  return content;
}

export async function generateDailyFortune(): Promise<DailyFortune> {
  const categories = generateDailyCategories();
  const levels = Object.values(categories).map(cat => cat.level);
  const luck = levels.filter(level => level === 'SSR' || level === 'SR').length + 1;
  
  return {
    date: formatDate(),
    content: generateFortuneContent(categories),
    luck,
    tags: generateFortuneTags(categories),
    categories,
    dailyRecommend: generateDailyRecommend(),
    dailyEvents: generateDailyEvents(),
    dailyArtwork: await getRandomPopularArtwork()
  };
} 