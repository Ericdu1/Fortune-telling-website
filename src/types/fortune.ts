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