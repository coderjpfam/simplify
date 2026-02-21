import { ALGORITHMS, ENCODINGS } from "./constants";

export type AlgorithmKey = keyof typeof ALGORITHMS;
export type EncodingKey = keyof typeof ENCODINGS;

export interface StrengthLabel {
  text: string;
  color: string;
  bar: string;
}

