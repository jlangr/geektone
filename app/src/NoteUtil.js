import * as Duration from './Duration';
import { transportTime } from './TimeUtil';

// TODO test sharpen
export const noteObjects = (notes, sharps = []) => {
  const result = [];
  let startSixteenths = 0;
  notes.forEach(note => {
    const startTime = transportTime(startSixteenths);
    let noteName = note.name();
    if (sharps.includes(noteName)) { // note base really
      noteName = noteName.substring(0, 1) + '#' + noteName.substring(1);
    }

    result.push({ name: noteName, duration: note.duration, time: startTime });
    startSixteenths += Duration.time(note.duration);
  });
  return result;
};