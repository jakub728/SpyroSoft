export interface GenerationMixItem {
  fuel: string;
  perc: number;
}

export interface ApiElement {
  from: string;
  to: string;
  generationmix: GenerationMixItem[];
}

export interface IObject {
  from: string;
  to: string;
  cleanFuel: number;
}
