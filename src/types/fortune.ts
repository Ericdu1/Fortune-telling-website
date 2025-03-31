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
  anime?: AnimeRecommend;
  game?: GameRecommend;
  music?: MusicRecommend;
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
}

export interface FortuneCategory {
  name: string;
  level: 'SSR' | 'SR' | 'R' | 'N';
  description: string;
  advice: string;
}

export interface DailyFortune {
  date: string;
  content: string;
  luck: number;
  tags: string[];
  categories: {
    game: FortuneCategory;
    anime: FortuneCategory;
    create: FortuneCategory;
    social: FortuneCategory;
  };
  dailyRecommend: DailyRecommend;
  dailyEvents: DailyEvents;
  dailyArtwork: PixivArtwork;
} 