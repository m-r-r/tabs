/* @flow */
import {Track, Tuning} from './types';

export const newTrack = (): Track => ({
    tuning: {},
    data: [],
    stringCount: 0,
});

export const transpose = (track: Track, tuning: Tuning): Track => {
    return track;
};
