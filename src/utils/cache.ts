import { DailyFortune } from '../types/fortune';
import { generateDailyFortune } from './fortune';

const CACHE_KEY = 'dailyFortune';

interface CachedFortune {
  date: string;
  fortune: DailyFortune;
  timestamp: number;
}

function isToday(timestamp: number): boolean {
  const today = new Date();
  const date = new Date(timestamp);
  
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function isBeforeNoon(timestamp: number): boolean {
  const now = new Date();
  const noon = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
  return timestamp < noon.getTime();
}

export async function getDailyFortune(): Promise<DailyFortune> {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { fortune, timestamp } = JSON.parse(cached) as CachedFortune;
      
      // 如果是今天的缓存，且：
      // 1. 现在是中午12点前，且缓存是12点前的
      // 2. 现在是中午12点后，且缓存也是12点后的
      // 则使用缓存
      if (
        isToday(timestamp) &&
        isBeforeNoon(Date.now()) === isBeforeNoon(timestamp)
      ) {
        return fortune;
      }
    }
    
    // 生成新的运势
    const newFortune = await generateDailyFortune();
    
    // 缓存运势
    const cacheData: CachedFortune = {
      date: newFortune.date,
      fortune: newFortune,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    
    return newFortune;
  } catch (error) {
    console.error('获取每日运势时出错：', error);
    // 如果出错，返回一个基本的运势
    return {
      date: new Date().toLocaleDateString('zh-CN'),
      content: '今日运势生成遇到问题，请稍后再试。',
      luck: 3,
      tags: ['系统维护中'],
      categories: {
        game: { name: '游戏运势', level: 'N', description: '暂无数据', advice: '请稍后再试' },
        anime: { name: '动画运势', level: 'N', description: '暂无数据', advice: '请稍后再试' },
        create: { name: '创作运势', level: 'N', description: '暂无数据', advice: '请稍后再试' },
        social: { name: '社交运势', level: 'N', description: '暂无数据', advice: '请稍后再试' }
      },
      dailyRecommend: {
        anime: undefined,
        game: undefined,
        music: undefined
      },
      dailyEvents: {
        animeUpdates: [],
        gameEvents: [],
        birthdays: [],
        releases: []
      },
      dailyArtwork: {
        id: '0',
        title: '暂无图片',
        artistId: '0',
        artistName: '系统',
        imageUrl: '/placeholder.jpg'
      }
    };
  }
}

export function clearFortuneCache(): void {
  localStorage.removeItem(CACHE_KEY);
} 