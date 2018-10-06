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
  console.log('sharps', sharps)
  console.log('flats', flats)
  const result = []
  let startSixteenths = 0
  notes.forEach(note => {
    if (!note.isRest()) {
      const startTime = transportTime(startSixteenths)
      const noteName = applyAccidentals(note.name(), sharps, flats)
      // TODO changed--see ToneUtil
      result.push({ name: noteName, duration: note.duration, time: startTime, context: note.context, x: note.x(), y: note.y() })
    }
    startSixteenths += Duration.time(note.duration)
  });
  return result
};