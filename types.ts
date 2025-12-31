
export enum Role {
  USER = 'user',
  BOT = 'bot'
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
}

export interface MoodEntry {
  date: string;
  score: number; // 1-5
  label: string;
}

export interface CopingSkill {
  title: string;
  description: string;
  category: 'Mindfulness' | 'CBT' | 'Physical' | 'Creative';
  icon: string;
}
