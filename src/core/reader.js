/* @flow */
import reduce from 'lodash/reduce';
import { ENGLISH_NAMES, LATIN_NAMES, Flat, OCTAVE_MAX, OCTAVE_MIN, Sharp } from './constants';
import { newTrack } from './core';
import type {
  Accidental, 
  Note,
  NoteValue,
  PartialNote,
  PartialTrack,
  Octave, 
  Tabulature,
} from './types';

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

export function parseNote (text: string): ?PartialNote {
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

export function fromString (text: string, selectedTuning?: Tuning): Tabulature {
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
          tuning: [],
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

/*

const TRACK_STRING_RE = '';


class Reader {
  construct () {
    this.parts = [];
    this.line = 0;
    this.matches = null;
    this.errors = [];
    this.partialTrack = null;
    this.textBlock = null;
  }
  
  read (text: string) {
    const lines = text.split('\n');
    let inTrack = false;
    
    for (let line of lines) {
      this.matches = line.match(TRACK_STRING_RE);
      this.line ++;
      
      if (this.matches) {
        if (inTrack) {
          
        } else {
          
        }
        this.onMatchTrackLine(matches);
      }
      
      if (inTrack) {
        if (!this.matches) {
          this.onTrackEnd();
          this.onTextBegin();
          this.textBlock += line;
        } else {
          this.onMatchTrackLine(matches);
        }
      } else {
        if (this.matches) {
          if (this.textBlock !== null) {
            this.onTextEnd();
          }
          this.onTrackBegin();
          this.onMatchTrackLine(matches);
        }
      }
    }
  }
  
  onTextBegin () {
    this.textBlock = '';
  }
  
  onTextEnd () {
    this.parts.push(this.textBlock);
    this.textBlock = null;
  }
  
  onTrackBegin () {
    this.track = {
      tuning: [],
      data: [],
      source: '',
      stringCount: 0,
      width: 0,
      startLine: this.line,
      endLine: null,
    };
  }
  
  onTrackEnd () {
    const {partialTrack} = this.partialTrack;
    let partialTuning =  partialTrack.tuning;
    let trackTuning = null;
    if (isEmptyTuning(trackTuning)) {
      if (this.previousTrack && partialTrack.stringCount === this.previousTrack.stringCount) {
        trackTuning = [...this.previousTrack.tuning];
      }
    } else {
      trackTuning = findTuning(trackTuning);
    }
    
    if (trackTuning === null) {
      this.parts.push(this.track.source);
      this.errors.push({
        startLine: partialTrack.startLine,
        endLine: partialTrack.endLine,
        code: Reader.MISSING_TUNING,
      });
    } else {
      const track = {
        tuning: trackTuning,
        data: partialTrack.data,
        stringCount: partialTrack.stringCount,
        width: partialTrack.width,
      };
      this.parts.push(track);
    }
    this.partialTrack = null;
  }
}

Reader.MISSING_TUNING = 'MISSING_TUNING';
*/