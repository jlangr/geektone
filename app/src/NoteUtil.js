import * as Duration from './Duration';
import { transportTime } from './TimeUtil';

export const applyAccidentals = (noteName, sharps = [], flats = []) => {
  const noteBase = noteName.substring(0, 1)
  const octave = noteName.substring(1)
  if (sharps.includes(noteBase))
    return `${noteBase}#${octave}`
  if (flats.includes(noteBase))
  // TODO move this code to Note.js
    return `${noteBase}b${octave}`
  return noteName
};

export const noteObjects = (notes, sharps = [], flats = []) => {
  const result = []
  let startSixteenths = 0
  notes.forEach(note => {
    if (!note.isRest()) {
      const startTime = transportTime(startSixteenths)
      const noteName = applyAccidentals(note.name(), sharps, flats)
      result.push({ name: noteName, duration: note.duration, time: startTime })
    }
    startSixteenths += Duration.time(note.duration)
  });
  return result
};