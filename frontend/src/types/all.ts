export const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#333333",
  "#a4de6c",
];

export interface FirstEndpointElement {
  biomass: number;
  coal: number;
  imports: number;
  gas: number;
  nuclear: number;
  other: number;
  hydro: number;
  solar: number;
  wind: number;
  data: string;
  cleanEnergy: number;
}

export interface FirstEndpointOutput {
  day: FirstEndpointElement[];
}

export interface SecondEndpointOutput {
  averge: number;
  startBest: string;
  endBest: string;
}
