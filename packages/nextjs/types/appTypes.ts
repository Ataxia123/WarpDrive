export type Metadata = {
  srcUrl: string;
  Level: string;
  Power1: string;
  Power2: string;
  Power3: string;
  Power4: string;
  Alignment1: string;
  Alignment2: string;
  Side: string;
  interplanetaryStatusReport: string;
  selectedDescription: string;
  nijiFlag: boolean;
  vFlag: boolean;
  equipment: string;
  healthAndStatus: string;
  abilities: string;
  funFact: string;

  alienMessage: string;
};

export type ProgressResponseType = {
  progress: number | "incomplete";
  response: {
    createdAt?: string;
    buttons?: string[];
    imageUrl?: string;
    buttonMessageId?: string;
    originatingMessageId?: string;
    content?: string;
    ref?: string;
    responseAt?: string;
  };
};

export type StoreState = {
  interplanetaryStatusReports: string[];
  scanningResults: string[][];
  imagesStored: string[];
};

export type Sounds = {
  spaceshipHum?: AudioBuffer | null;
  spaceshipOn?: AudioBuffer | null;
  holographicDisplay?: AudioBuffer | null;
  warpSpeed?: AudioBuffer | null;
};
