/** @flow */
export type Octave = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type NoteValue = 0 | 2 | 4 | 5 | 7 | 9 | 11;

export type Accidental = 1 | -1;

export type Note = {
  octave?: Octave,
  value: NoteValue,
  accidental?: Accidental,
};

export type TrackData = {
  start: number,
  string: number,
  fret?: number,
  text?: string,
};

export type Tuning = Array<Note>;

export type Track = {
  tuning: Tuning,
  data: TrackData[],
  stringCount: number,
};

export type TextBlock = string;

export type Tabulature = Array<TextBlock | Track>;

export type NotesNames = {[key: NoteValue]: string};
