import create from "zustand";

/**
 * Zustand Store
 *
 * You can add global state to the app using this AppStore, to get & set
 * values from anywhere in the app.
 *
 * Think about it as a global useState.
 */

type Metadata = {
  srcUrl: string | "";
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
};

type TAppStore = {
  // Existing properties
  ethPrice: number;
  setEthPrice: (newEthPriceState: number) => void;

  // New properties
  backgroundImageUrl: string;
  setBackgroundImageUrl: (backgroundImageUrl: string, type: string) => void;
  displayImageUrl: string;
  setdisplayImageUrl: (displayImageUrl: string, type: string) => void;
  metadata: Metadata;
  setMetadata: (metadata: Partial<Metadata>) => void;
  travels: any[];
  setTravels: (newTravel: any) => void;
  apiResponses: any[];
  errors: any[];
  handleApiResponse: (response: any, error: any) => void;
};

type ImageStoreState = {
  imageUrl: string | null;
  setImageUrl: (imageUrl: string) => void;
};

export const useAppStore = create<TAppStore>(set => ({
  // Existing properties
  ethPrice: 0,
  setEthPrice: (newValue: number): void => set(() => ({ ethPrice: newValue })),

  // New properties
  backgroundImageUrl: "",
  setBackgroundImageUrl: (backgroundImageUrl: string, type: string) =>
    set(state => (type === "background" ? { backgroundImageUrl } : state)),

  displayImageUrl: "",
  setdisplayImageUrl: (displayImageUrl: string, type: string) =>
    set(state => (type === "character" ? { displayImageUrl } : state)),

  metadata: {
    // Initialize with default values
    srcUrl: "",
    Level: "",
    Power1: "",
    Power2: "",
    Power3: "",
    Power4: "",
    Alignment1: "",
    Alignment2: "",
    Side: "",
    interplanetaryStatusReport: "",
    selectedDescription: "",
    nijiFlag: false,
    vFlag: false,
  },
  setMetadata: (metadata: Partial<Metadata>) => set(state => ({ metadata: { ...state.metadata, ...metadata } })),
  travels: [],
  setTravels: (newTravel: any) => set(state => ({ travels: [...state.travels, newTravel] })),
  apiResponses: [],
  errors: [],
  handleApiResponse: (response: any, error: any) =>
    set(state => ({
      apiResponses: error ? state.apiResponses : [...state.apiResponses, response],
      errors: error ? [...state.errors, error] : state.errors,
    })),
}));

export const useImageStore = create<ImageStoreState>(set => ({
  imageUrl: null,
  setImageUrl: (imageUrl: string) => set({ imageUrl }),
}));
