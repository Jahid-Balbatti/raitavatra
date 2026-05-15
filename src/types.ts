export enum CropCategory {
  PADDY = "Paddy",
  ARECA_NUT = "Areca nut",
  COCONUT = "Coconut",
  TOMATO = "Tomato",
}

export interface Tip {
  id: string;
  cropCategory: CropCategory;
  instruction: string;
  instructionKn: string;
  imageUrl: string;
  createdAt: any;
}

export interface SuccessStory {
  id: string;
  farmerName: string;
  story: string;
  storyKn: string;
  imageUrl: string;
  location: string;
  createdAt: any;
}

export interface ExpertAsk {
  id: string;
  userId: string;
  imageUrl: string;
  status: "pending" | "responded";
  reply?: string;
  timestamp: any;
}
