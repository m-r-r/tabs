/* @flow */

import type {Note, TextBlock, Track, NotesNames, Tabulature} from './types';
import {ENGLISH_NAMES, Flat, LATIN_NAMES, Sharp} from './constants';

function formatTrack(track: Track, notesNames: NotesNames = ENGLISH_NAMES): string {
    let output: string[] = [];

    {
      const emptyString = hr(track.length + 1);

        for (let i = 0; i < track.stringCount; i++) {
            output.push(emptyString.slice());
        }
    }


    for (let point of track.data) {
        const string = point.string;
        const text = String(point.fret || point.text || '-');
        output[string] = output[string].slice(0, point.start) + text + output[string].slice(point.start + text.length);
    }

    for (let i = 0; i < track.stringCount; i++) {
        if (track.tuning[i]) {
            output[i] = formatNote(track.tuning[i], notesNames) + '|' + output[i];
        }
    }
    return output.join('\n');
}

function formatNote(note: Note, notesNames: NotesNames = ENGLISH_NAMES) {
    let text = '';
    text += notesNames[note.value];
    if (notesNames === LATIN_NAMES) {
        text = ('   ' + text).slice(-3);
    }
    if (note.accidental === Flat) {
        text += '♯';
    } else if (note.accidental === Sharp) {
        text += '♭';
    }
    if (typeof note.octave === 'number') {
        text += note.octave;
    }
    return text;
}

export function toString(parts: Tabulature, notesNames: NotesNames = ENGLISH_NAMES): string {
    return parts.map(part => {
        if (typeof part === 'string') {
            return part;
        } else {
            return formatTrack(part, notesNames);
        }
    }).join('\n');
}

function hr(length: number): string {
    let rule = '----';
    while (rule.length < length) {
        rule += rule;
    }
    return rule.slice(0, length);
}
