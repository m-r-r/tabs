/* @flow */
import {parse} from './parser';
import type { ReaderResult, ReaderError, Tuning, TrackData, PartialTuning, Track } from './types';
import { findTuning } from './core';

type ParseTrack = {
  tuning: ?PartialTuning,
  data: TrackData[],
  source: string,
  span: $PropertyType<ReaderError, 'span'>,
  stringCount: number,
  length: number,
};

export function fromString (source: string, selectedTuning?: Tuning): ReaderResult {
  const errors: ReaderError[] = [];
  const result = parse(source);

  let previousTunings: {[key: number]: Tuning} = {};

  const tabulature = result.map((part: ParseTrack | string): Track | string => {
    if (typeof part === 'string') {
      return part;
    }

    let tuning = null;
    if (part.tuning) {
      tuning = findTuning(part.tuning);
    } else if (previousTunings[part.stringCount]) {
      tuning = previousTunings[part.stringCount];
    }

    if (!tuning && selectedTuning) {
      if (part.stringCount === selectedTuning.length) {
        tuning = selectedTuning;
      }
      errors.push({
        code: 'STRING_COUNT_MISMATCH',
        span: part.span,
      });
      return part.source;
    }

    if (!tuning) {
      errors.push({
        code: 'MISSING_TUNING',
        span: part.span,
      });
      return part.source;
    }
    previousTunings[part.stringCount] = tuning;
    return {
      tuning,
      data: part.data,
      stringCount: part.stringCount,
      length: part.length,
    }
  });
  return {
    tabulature,
    errors,
  };
}
