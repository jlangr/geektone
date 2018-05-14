import * as Duration from './Duration';

export const transportTime = totalSixteenths => {
  const measures = Math.floor(totalSixteenths / 16);
  const measureSixteenths = totalSixteenths % 16;
  const quarters = Math.floor(measureSixteenths / 4);
  const sixteenths = totalSixteenths % 4;
  return `${measures}:${quarters}:${sixteenths}`;
};

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
