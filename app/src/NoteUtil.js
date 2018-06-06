import * as Duration from './Duration';
import { transportTime } from './TimeUtil';

export const applyAccidentals = (noteName, sharps) => {
  return (sharps.includes(noteName))  // TODO note base really
    ? noteName.substring(0, 1) + '#' + noteName.substring(1)
    : noteName;
};

export const noteObjects = (notes, sharps = []) => {
  const result = [];
  let startSixteenths = 0;
  notes.forEach(note => {
    const startTime = transportTime(startSixteenths);
    const noteName = applyAccidentals(note.name(), sharps);
    result.push({ name: noteName, duration: note.duration, time: startTime });
    startSixteenths += Duration.time(note.duration);
  });
  return result;
};