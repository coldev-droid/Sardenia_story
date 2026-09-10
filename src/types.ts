export interface SardiniaBook {
  id: string;
  title: string;
  subtitle: string;
  setting: string;
  synopsis: string;
  chaptersCount: number;
  status: string;
}

export interface GeneratedChapter {
  bookId: string;
  chapterNumber: number;
  chapterTitle: string;
  prose: string;
  mythologicalLoreNote: string;
  suggestedNextPlotTwist: string;
  timestamp: string;
}

export interface AmuletItem {
  id: string;
  name: string;
  sardinianName: string;
  bookSource: string;
  power: string;
  description: string;
  icon: string;
  discovered: boolean;
}

export interface LoreLocation {
  id: string;
  name: string;
  region: string;
  type: string;
  description: string;
  magicalSecret: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ResolvedThreat {
  id: string;
  ruleId: string;
  ruleCategory: string;
  timestamp: string;
  detectedThreat: string;
  mitigationAction: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'RESOLVED' | 'MITIGATED';
  chapterContext: string;
  swarmAgent: string;
}
