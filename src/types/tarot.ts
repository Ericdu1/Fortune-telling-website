export interface TarotCard {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  image: string;
  meaning: string;
  interpretation: string;
  reversedMeaning: string;
  reversedInterpretation: string;
  position?: string;
  isReversed?: boolean;
}

export interface TarotCardResult extends TarotCard {
  position: string;
  isReversed: boolean;
} 