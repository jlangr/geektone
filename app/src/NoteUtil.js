import * as Duration from './Duration';
import { transportTime } from './TimeUtil';

export const noteObjects = notes => {
  const result = [];
  let startSixteenths = 0;
  notes.forEach(note => {
    let startTime = transportTime(startSixteenths);
    result.push({ name: note.name(), duration: note.duration, time: startTime });
    startSixteenths += Duration.time(note.duration);
  });
  return result;
};