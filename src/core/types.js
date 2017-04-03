/** @flow */
export type Octave = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type NoteValue = 0 | 2 | 4 | 5 | 7 | 9 | 11;

export type Accidental = 1 | -1;

export type Note = {
  value: NoteValue,
  octave: Octave,
  accidental?: Accidental,
};

export type PartialNote = {
  value: NoteValue,
  octave?: Octave,
  accidental?: Accidental,
}

export type PartialTuning = PartialNote[];

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
  length: number,
};

export type ReaderError = {
  code: string,
  span: {
    start: {
      line: number,
      column: number,
    },
    end: {
      line: number,
      column: number,
    },
  },
};

export type ReaderResult = {
  tabulature: Tabulature,
  errors: ReaderError[],
}

export type TextBlock = string;

export type Tabulature = Array<TextBlock | Track>;

export type NotesNames = {[key: NoteValue]: string};

