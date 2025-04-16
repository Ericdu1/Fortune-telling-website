export interface PixivArtwork {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  imageUrl: string;
  tags?: string[];
  series?: string;
  relatedWorks?: string[];
  description?: string;
  date?: string;
}

export interface AnimeRecommend {
  title: string;
  episode: string;
  reason: string;
  imageUrl?: string;
}

export interface GameRecommend {
  title: string;
  type: string;
  reason: string;
  imageUrl?: string;
}

export interface MusicRecommend {
  title: string;
  artist: string;
  type: 'ANIME_OP' | 'ANIME_ED' | 'GAME_BGM' | 'VOCALOID';
  url?: string;
}

export interface DailyRecommend {
  anime?: {
    title: string;
    episode: string;
    reason: string;
    link?: string;
    image?: string;
  };
  game?: {
    title: string;
    type: string;
    reason: string;
    link?: string;
    image?: string;
  };
  music?: {
    title: string;
    artist: string;
    link?: string;
    image?: string;
  };
}

export interface AnimeUpdate {
  title: string;
  episode: number;
  time: string;
}

export interface GameEvent {
  game: string;
  event: string;
  endTime: string;
}

export interface Birthday {
  character: string;
  from: string;
}

export type ReleaseType = 'ANIME' | 'MANGA' | 'GAME';

export interface Release {
  title: string;
  type: ReleaseType;
  platform?: string;
}

export interface DailyEvents {
  animeUpdates: AnimeUpdate[];
  gameEvents: GameEvent[];
  birthdays: Birthday[];
  releases: Release[];
  list?: Array<{
    title: string;
    description: string;
    time?: string;
  }>;
}

export interface FortuneCategory {
  name: string;
  level: 'SSR' | 'SR' | 'R' | 'N';
  description: string;
  advice?: string;
}

export interface DailyFortune {
  date: string;
  content: string;
  luck: number; // 1-5
  tags: string[];
  categories: {
    game: FortuneCategory;
    anime: FortuneCategory;
    create: FortuneCategory;
    social: FortuneCategory;
    [key: string]: FortuneCategory;
  };
  dailyRecommend: DailyRecommend;
  events?: DailyEvents;
  dailyArtwork?: PixivArtwork;
  mysticMessage: string;
  activeTab?: 'overall' | 'zodiac' | 'animal' | 'lucky';
  isFullShare?: boolean;
  
  // 新增星座运势信息
  zodiacInfo?: {
    sign?: string;
    analysis: {
      overall: string; // 星级表示，如"★★★★☆"
      career: string;
      wealth: string;
      love: string;
      health: string;
      luck: string;
    };
    description?: string;
    advice?: string;
  };
  
  // 新增生肖运势信息
  animalInfo?: {
    animal?: string;
    analysis: {
      overall: string;
      career: string;
      wealth: string;
      love: string;
      health: string;
      compatibility: string;
    };
    description?: string;
    advice?: string;
  };
  
  // 新增幸运提示信息
  luckyInfo?: {
    color: string;
    number: string;
    keyword: string;
    goodActivity: string[] | string;
    badActivity: string[] | string;
    behavior: string;
  };
}

export interface TarotCardResult {
  cards: Array<{
    name: string;
    position: string;
    isReversed: boolean;
    image: string;
    meaning: {
      upright: string;
      reversed: string;
    };
  }>;
  interpretation: string;
} 