/* @flow */
import reduce from 'lodash/reduce';
import { ENGLISH_NAMES, LATIN_NAMES, Flat, OCTAVE_MAX, OCTAVE_MIN, Sharp } from './constants';
import { newTrack } from './core';
import type { Accidental, Note, NoteValue, Octave, Tabulature } from './types';

const TABS_RE = /^\s*\|?\s*((Do|R[eéè]|Mi|Fa|Sol|La|Si|A|B|C|D|E|F|G)m?)?\s*\|?\s*([\d\-hb~p\/\\]+)*\|?\s*$/i;

const notesNames = {};
reduce(ENGLISH_NAMES, valuesByName, notesNames);
reduce(LATIN_NAMES, valuesByName, notesNames);

function parseNoteValue (text: string): ?NoteValue {
  text = text.toLowerCase().replace(/[éè]/gi, 'e');
  if (notesNames.hasOwnProperty(text)) {
    return notesNames[text];
  }
  return null;
}

function parseOctave (text: string): ?Octave {
  let num: number = parseInt(text);
  if (Number.isNaN(num) || num < OCTAVE_MIN || num > OCTAVE_MAX) {
    return null;
  }
  return (num: any);
}

function parseAccidental (text: string): ?Accidental {
  text = String(text).toLowerCase();
  if ('♯#'.indexOf(text) > -1) {
    return Sharp;
  } else if ('♭b'.indexOf(text) > -1) {
    return Flat;
  } else {
    return null;
  }
}

export function parseNote (text: string): ?Note {
  if (typeof text !== 'string') {
    throw new TypeError('Argument #1 must be a string');
  }
  const matches = text.match(/^(do|r[ée]|mi|fa|sol|la|si|[a-g])(\d+)?([♯♭b#])?(\d+)?$/i);
  if (matches) {
    let value = parseNoteValue(matches[1]);
    if (value) {
      const note: Note = {value};
      let octave = parseOctave(matches[2] || matches[4]);
      if (octave !== null) {
        note.octave = octave;
      }
      let accidental = parseAccidental(matches[3]);
      if (accidental !== null) {
        note.accidental = accidental;
      }
      return note;
    }
  }
  return null;
}

export function fromString (text: string): Tabulature {
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
          tuning: [...previousTrack.tuning],
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
        pos++;
      }
      currentTrack.stringCount++;
      currentString++;
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


function notEmptyString (s: any): boolean {
  return typeof s === 'string' && s.length > 0;
}

function valuesByName (acc: {[key: string]: number}, value: string, key: string) {
  acc[value.toLowerCase()] = Number(key);
  return acc;
}

