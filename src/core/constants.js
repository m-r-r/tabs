/* @flow */
import type { Accidental, NotesNames, NoteValue, Tuning } from './types';

export const Do: NoteValue = 0;
export const Re: NoteValue = 2;
export const Mi: NoteValue = 4;
export const Fa: NoteValue = 5;
export const Sol: NoteValue = 7;
export const La: NoteValue = 9;
export const Si: NoteValue = 11;

export const Sharp: Accidental = 1;
export const Flat: Accidental = -1;

export const ENGLISH_NAMES: NotesNames = {
  [Do]: 'C',
  [Re]: 'D',
  [Mi]: 'E',
  [Fa]: 'F',
  [Sol]: 'G',
  [La]: 'A',
  [Si]: 'B',
};

export const LATIN_NAMES: NotesNames = {
  [Do]: 'Do',
  [Re]: 'Re',
  [Mi]: 'Mi',
  [Fa]: 'Fa',
  [Sol]: 'Sol',
  [La]: 'La',
  [Si]: 'Si',
};

export const OCTAVE_MIN = -1;
export const OCTAVE_MAX = 10;

export const DEFAULT_TUNINGS: { [key: string]: Tuning } = {
  'ukuleleStd': [
    {value: La, octave: 4},
    {value: Mi, octave: 4},
    {value: Do, octave: 4},
    {value: Sol, octave: 4},
  ],
  'ukuleleLowG': [
    {value: Sol, octave: 3},
    {value: Do, octave: 4},
    {value: Mi, octave: 4},
    {value: La, octave: 4},
  ],
  'guitarStd': [
    {value: Mi, octave: 2},
    {value: La, octave: 2},
    {value: Re, octave: 3},
    {value: Sol, octave: 3},
    {value: Si, octave: 3},
    {value: Mi, octave: 4},
  ],
  'bassStd': [
    { value: Mi, octave: 1},
    { value: La, octave: 1},
    { value: Re, octave: 2},
    { value: Sol, octave: 2},
  ],
  'mandolinStd': [
    { value: Sol, octave: 3},
    { value: Re, octave: 4},
    { value: La, octave: 4},
    { value: Mi, octave: 5},
  ]
};
