/* @flow */
import type {
  Track,
  Tuning,
  Note
} from './types';

import { Flat, Sharp } from './constants';

export const newTrack = (tuning: Tuning = {}): Track => ({
  tuning,
  data: [],
  stringCount: Object.keys(tuning).length,
});

export function changeTuning(track: Track, outputTuning: Tuning): Track {
  const outputTrack = newTrack(outputTuning);
  
  for (let point of track.data) {
    const newPoint = {...point};
    if (!point.fret) {
      continue;
    }
    const semitones = getSemitones((track.tuning[point.string] : Note)) + point.fret;
    let nearestString = -1;
    let nearestValue = 99999;
    for (let string=0; string < outputTuning.stringCount; string++) {
      if (outputTuning[string] < semitones) {
        continue;
      }
      let delta = Math.abs(getSemitones(outputTuning[string]) - semitones);
      if (delta < nearestValue) {
        nearestValue = delta;
        nearestString = string;
      }
    }
    if (nearestString < 0) {
      continue;
    }
    newPoint.string = nearestString;
    newPoint.fret = semitones - track.tuning[point.string];
    newTrack.data.push(point);
  }
  
  return outputTrack;
}

function getSemitones (note: Note): number {
  let semitones = ((note.octave || 4) * 12) + note.value;
  if (note.accidental == Sharp) {
    semitones ++;
  } else if (note.accidental == Flat) {
    semitones --;
  }
  return semitones;
}