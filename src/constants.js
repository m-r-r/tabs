/* @flow */
import { NoteName, Accidental } from './types';

export const Do: NoteName = "do";
export const Re: NoteName = "re";
export const Mi: NoteName = "mi";
export const Fa: NoteName = "fa";
export const Sol: NoteName = "sol";
export const La: NoteName = "la";
export const Si: NoteName = "si";

export const Sharp: Accidental = "sharp";
export const Flat: Accidental = "flat";

export const ENGLISH_NAMES: {[key: NoteName]: string} = {
  do: "C",
  re: "D",
  mi: "E",
  fa: "F",
  sol: "G",
  la: "A",
  si: "B",
};

export const LATIN_NAMES: {[key: NoteName]: string} = {
  do: "Do",
  re: "Re",
  mi: "Mi",
  fa: "Fa",
  sol: "Sol",
  la: "La",
  si: "Si",
};

export const OCTAVE_MIN = -1;
export const OCTAVE_MAX = 10;

