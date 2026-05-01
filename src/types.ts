export enum Difficulty {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
}

export interface ControlStep {
  id: string;
  title: string;
  description: string;
  command?: string;
  expectedOutput?: string;
  codeSnippet?: string;
  language?: string;
}

export interface TutorialModule {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  estimatedTime: string; // e.g. "15 mins"
  steps: ControlStep[];
}
