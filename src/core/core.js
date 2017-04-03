/* @flow */
import type {
  Track,
  Tuning,
  PartialTuning,
  Note,
  TrackData,
  Tabulature,
  PartialNote,
} from './types';

import { DEFAULT_TUNINGS, Flat, Sharp } from './constants';

export function findTuning (partialTuning: PartialTuning, selectedTuning?: Tuning): ?Tuning {
  if (selectedTuning) {
    if (partialTuning.length === selectedTuning.length) {
      return selectedTuning;
    } else {
      return null;
    }
  }
  let validNotes = partialTuning.filter((note: ?PartialNote) => note && typeof note.octave === 'number');
  if (validNotes.length === partialTuning.length) {
    return (validNotes : any);
  }
  
  let hash = tuningHash(partialTuning);
  let tuningId: ?string = Object.keys(DEFAULT_TUNINGS).find((key) => {
    return hash === tuningHash(DEFAULT_TUNINGS[key]);
  });
  return tuningId ? DEFAULT_TUNINGS[tuningId] : null;
}

function tuningHash (tuning: PartialTuning | Tuning) {
  return tuning.map((note) => note ? String(note.value) : '').join(':');
}

export const newTrack = (tuning: Tuning = [], length?: number = 0): Track => ({
  tuning,
  data: [],
  stringCount: tuning.length,
  length,
});

export function changeTuning (tab: Tabulature, outputTuning: Tuning): Tabulature {
  return tab.map((part) => {
    if (typeof part === 'string') {
      return part;
    } else {
      return changeTrackTuning(part, outputTuning);
    }
  });
}

function changeTrackTuning(track: Track, outputTuning: Tuning): Track {
  const outputTrack = newTrack(outputTuning, track.length);
  for (let point of track.data) {
    if (typeof point.fret !== 'number') {
      continue;
    }
    const newPoint: TrackData = {...point};
    const semitones = getSemitones((track.tuning[point.string])) + point.fret;
    let nearestString = -1;
    let nearestValue = 99999;
    for (let string=0; string < outputTuning.length; string++) {
      const stringSemitones = getSemitones(outputTuning[string]);
      if (stringSemitones > semitones) {
        continue;
      }
      if (stringSemitones < nearestValue) {
        nearestString = string;
      }
      nearestValue = Math.min(nearestValue, stringSemitones);
    }
    if (nearestString < 0) {
      continue;
    }
    newPoint.string = nearestString;
    newPoint.fret = semitones - nearestValue;
    outputTrack.data.push(newPoint);
  }
  
  return outputTrack;
}

function getSemitones (note: Note): number {
  let semitones = ((note.octave || 4) * 12) + note.value;
  if (note.accidental === Sharp) {
    semitones ++;
  } else if (note.accidental === Flat) {
    semitones --;
  }
  return semitones;
}
