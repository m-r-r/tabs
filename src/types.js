/** @flow */
export type Octave = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type NoteName = "do" | "re" | "mi" | "fa" | "sol" | "la" | "si";

export type Accidental = "sharp" | "flat";

export type Note = {
  octave: ?Octave,
  name: NoteName,
  accidental: ?Accidental,
};

export type NamingSystem = "english" | "doremi";

export type TrackData
  = { start: number
    , string: number
    , fret: number
    } 
  | { start: number
    , string: number
    , text: string
    };

export type Tuning = {[string: number]: ?Note};

export type Track = {
  tuning: Tuning,
  data: TrackData[],
  stringCount: number,
};

export type TextBlock = string;

export type Timestamp = number;

export type Tabulature = {
  title: ?string,
  author: ?string,
  created: ?Timestamp,
  modified: ?Timestamp,
  parts: Array<TextBlock | Track>,
};
