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

export interface Category {
  name: string;
  level: 'SSR' | 'SR' | 'R' | 'N';
  description: string;
  advice: string;
}

export interface AnimeRecommend {
  title: string;
  episode: string;
  reason: string;
  image?: string;
}

export interface GameRecommend {
  title: string;
  type: string;
  reason: string;
  image?: string;
}

export interface MusicRecommend {
  title: string;
  artist: string;
  link?: string;
}

export interface DailyRecommend {
  anime?: AnimeRecommend;
  game?: GameRecommend;
  music?: MusicRecommend;
}

export interface Artwork {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  image: string;
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
  releases: string[];
}

export interface DailyFortune {
  date: string;
  content: string;
  luck: number;
  tags: string[];
  categories: {
    game: Category;
    anime: Category;
    create: Category;
    social: Category;
  };
  dailyRecommend: DailyRecommend;
  dailyEvents: DailyEvents;
  dailyArtwork: Artwork;
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