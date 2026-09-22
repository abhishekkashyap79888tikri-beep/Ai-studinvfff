export interface StyleOption {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  colors: string[];
  keyElements: string[];
  thumbnail: string;
  promptDescription: string;
}

export interface PresetRoom {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  description: string;
  styleImages: Record<string, string>;
  initialShoppableItems: ShoppableItem[];
}

export interface ShoppableItem {
  id: string;
  name: string;
  category: string;
  price: string;
  retailer: string;
  searchUrl: string;
  imageUrl?: string;
  description: string;
  styleMatch: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  shoppableItems?: ShoppableItem[];
  refinedImageUrl?: string;
  actionSummary?: string;
}

export interface DesignState {
  originalImage: string;
  originalImageName: string;
  currentStyleId: string;
  renderedImage: string;
  isGenerating: boolean;
  sliderPosition: number; // 0 to 100
  styleHistory: Array<{
    styleId: string;
    imageUrl: string;
    timestamp: number;
    prompt?: string;
  }>;
}
