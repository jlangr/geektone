import * as Duration from './Duration';
import { transportTime } from './TimeUtil';

// TODO use notebase rather than noteName?
export const applyAccidentals = (noteName, sharps = [], flats = []) => {
  if (sharps.includes(noteName))
    return noteName.substring(0, 1) + '#' + noteName.substring(1)
  if (flats.includes(noteName))
  // TODO move this code to Note.js
    return noteName.substring(0, 1) + 'b' + noteName.substring(1)
  return noteName;
};

export const noteObjects = (notes, sharps = [], flats = []) => {
  const result = [];
  let startSixteenths = 0;
  notes.forEach(note => {
    if (!note.isRest()) {
      const startTime = transportTime(startSixteenths);
      const noteName = applyAccidentals(note.name(), sharps, flats);
      result.push({ name: noteName, duration: note.duration, time: startTime });
    }
    startSixteenths += Duration.time(note.duration);
  });
  return result;
};