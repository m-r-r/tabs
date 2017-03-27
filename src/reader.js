/* @flow */
import { Track, TextBlock, Note, Octave, NoteName, Accidental } from './types';
import { ENGLISH_NAMES, LATIN_NAMES, Sharp, Flat, OCTAVE_MIN, OCTAVE_MAX } from './constants';
import { newTrack } from './core';

const TABS_RE = /^\s*\|?\s*((Do|R[eé]|Mi|Fa|Sol|La|Si|A|B|C|D|E|F|G)m?)?\s*\|?\s*([\d\-hb~p\/\\]+)*\|?\s*$/i;

const notesNames = {
  ...flipObject(ENGLISH_NAMES),
  ...flipObject(LATIN_NAMES),
};

function parseNoteName(text: string): ?NoteName {
  text = text.toLowerCase().replace('é', 'e');
  if (notesNames.hasOwnProperty(text)) {
    return notesNames[text];
  }
  return null;
}

function parseOctave(text: string): ?Octave {
  let num: number = parseInt(text);
  if (Number.isNaN(num) || num < OCTAVE_MIN || num > OCTAVE_MAX) {
    return null;
  }
  return (num: any);
}

function parseAccidental(text: string): ?Accidental {
  text = String(text).toLowerCase();
  if ('♯#'.indexOf(text) > -1) {
    return Sharp;
  } else if ('♭b'.indexOf(text) > -1) {
    return Flat;
  } else {
    return null;
  }
}

export function parseNote(text: string): ?Note {
  if (typeof text !== 'string') {
    throw new TypeError("Argument #1 must be a string");
  }
  var matches = text.match(/^(do|r[ée]|mi|fa|sol|la|si|[a-g])(\d+)?([♯♭b#])?(\d+)?$/i);
  if (matches) {
    let name = parseNoteName(matches[1]);
    if (name) {
      let octave = parseOctave(matches[2] || matches[4]);
      let accidental = parseAccidental(matches[3]);
      return {
        octave,
        name,
        accidental,
      };
    }
  }
  return null;
}

export function fromString(text: string): Array<TextBlock | Track> {
  let lines = text.split(/\n/);
  let parts = [];
  let previousTrack = newTrack();
  let currentTrack = null;

  let currentString = 0;
  for (let line of lines) {
    let matches = line.match(TABS_RE);
    if (matches && notEmptyString(matches[3])) {
      let tuningStr = matches[1];
      let pointsStr = matches[3];
      let tunning = null;

      if (tuningStr) {
        tunning = parseNote(tuningStr);
        if (!tunning) {
          parts.push(line);
          continue;
        }
      }

      if (!currentTrack) {
        currentTrack = {
            tuning: {...previousTrack.tuning},
            data: [],
            stringCount: 0,
        };
        parts.push(currentTrack);
      }

      if (tunning) {
        currentTrack.tuning[currentString] = tunning;
      }

      let pos = 0;
      let trackData = currentTrack.data;
      for (let text of pointsStr) {
        if (text === '-') {
          pos++;
          continue;
        }
        let fret = parseInt(text);
        if (Number.isNaN(fret)) {
          trackData.push({start: pos, string: currentString, text});
        } else {
            trackData.push({start: pos, string: currentString, fret});
        }
        pos ++;
      }
      currentTrack.stringCount++;
      currentString ++;
    } else {
      if (currentTrack !== null) {
        previousTrack = currentTrack;
        currentTrack = null;
        currentString = 0;
      }
      parts.push(line);
    }
  }
  return parts;
}


function notEmptyString(s: any): boolean {
  return typeof s === 'string' && s.length > 0;
}

function flipObject<K, V>(object: {[key: K]: V}): {[key: V]: K} {
  return Object.keys(object).reduce((acc, k) => {
    acc[object[k]] = k;
    return acc;
  }, {});
}

