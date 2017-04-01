/* @flow */
import type {
  Track,
  Tuning,
  Note, TrackData, Tabulature,
} from './types';

import { Flat, Sharp } from './constants';

export const newTrack = (tuning: Tuning = []): Track => ({
  tuning,
  data: [],
  stringCount: tuning.length,
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
  debugger;
  const outputTrack = newTrack(outputTuning);
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
