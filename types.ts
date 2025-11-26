export interface ComparisonItem {
  id: string;
  name: string;
  sizeOverride?: string;
}

export enum ImageResolution {
  RES_1K = "1K",
  RES_2K = "2K",
  RES_4K = "4K"
}

export interface GenerationResult {
  imageUrl: string | null;
  researchSummary: string;
  groundingLinks: { title: string; uri: string }[];
}

// Extending the Window interface for the AI Studio key selection
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}