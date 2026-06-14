export interface GenerationMixItem {
  fuel: string;
  perc: number;
}

export interface Input {
  from: string;
  to: string;
  generationmix: GenerationMixItem[];
}

export interface IObject {
  from: string;
  to: string;
  cleanFuel: number;
}
