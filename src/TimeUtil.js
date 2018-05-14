import { isDotted, noteBase } from './Duration';

export const sixteenth = '16n';
export const eighth = '8n';
export const quarter = '4n';
export const half = '2n';
export const whole = '1n';

const sixteenths = {[sixteenth]: 1, [eighth]: 2, [quarter]: 4, [half]: 8, [whole]: 16};

export const transportTime = totalSixteenths => {
  const measures = Math.floor(totalSixteenths / 16);
  const measureSixteenths = totalSixteenths % 16;
  const quarters = Math.floor(measureSixteenths / 4);
  const sixteenths = totalSixteenths % 4;
  return `${measures}:${quarters}:${sixteenths}`;
};

export const time = noteDuration => {
  let result = sixteenths[noteBase(noteDuration)];
  if (isDotted(noteDuration))
    result += (result / 2);
  return result;
};

export const noteForSixteenths = sixteenths => {
  switch (sixteenths) {
    case 1: return sixteenth;
    case 2: return eighth;
    case 4: return quarter;
    case 8: return half;
    case 16: return whole;
    default: return quarter;
  }
};

export const noteObjects = notes => {
  const result = [];
  let startSixteenths = 0;
  notes.forEach(note => {
    let startTime = transportTime(startSixteenths);
    result.push({ name: note.name(), duration: note.duration, time: startTime });
    startSixteenths += time(note.duration);
  });
  return result;
};

export const halveDuration = duration => {
  if (duration === sixteenth) return duration;
  return noteForSixteenths(time(duration) / 2);
};

export const doubleDuration = duration => {
  if (duration === whole) return duration;
  return noteForSixteenths(time(duration) * 2);
};
