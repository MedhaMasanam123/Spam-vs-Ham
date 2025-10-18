export type Classification = 'Spam' | 'Ham';

export interface Reference {
  uri: string;
  title: string;
}

export interface ClassificationResult {
  classification: Classification;
  probability: number;
  references?: Reference[];
}

export interface HistoryItem extends ClassificationResult {
  id: string;
  message: string;
}
