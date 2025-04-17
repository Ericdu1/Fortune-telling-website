export type MBTIType = 'ISTJ' | 'ISFJ' | 'INFJ' | 'INTJ' | 'ISTP' | 'ISFP' | 'INFP' | 'INTP' | 'ESTP' | 'ESFP' | 'ENFP' | 'ENTP' | 'ESTJ' | 'ESFJ' | 'ENFJ' | 'ENTJ';

export type MBTIDimension = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

export interface MBTIQuestion {
  id: number;
  text: string;
  options: {
    text: string;
    value: MBTIDimension;
  }[];
}

export interface JojoCharacter {
  name: string;
  mbtiType: MBTIType;
  description: string;
  stand?: string;
  ability?: string;
  imageUrl?: string;
  part?: number;
}

export interface MBTITestResult {
  mbtiType: MBTIType;
  character: JojoCharacter;
  description: string;
  dimensionScores: {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
  };
} 