
export interface IconEntry {
  key: string;
  emoji: string;
}

export interface HookState {
  id: string;
  value: any;
  type: 'state' | 'memo' | 'ref';
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
