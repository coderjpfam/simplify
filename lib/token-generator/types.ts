import { CHARSETS } from "./constants";

export type CharsetKey = keyof typeof CHARSETS;

export interface StrengthLabel {
  text: string;
  color: string;
  bar: string;
}
