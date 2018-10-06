import * as Duration from './Duration';
import { transportTime } from './TimeUtil';

export const applyAccidentals = (noteName, sharps = [], flats = []) => {
  // TODO create common free function in Note or somewhere
  // for this stuff
  const sharpBases = sharps.map(n => n.substring(0, 1))
  const flatBases = flats.map(n => n.substring(0, 1))
  const noteBase = noteName.substring(0, 1)
  const octave = noteName.substring(1)
  if (sharpBases.includes(noteBase))
    return `${noteBase}#${octave}`
  if (flatBases.includes(noteBase))
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
      // TODO changed--see ToneUtil
      result.push({ name: noteName, duration: note.duration, time: startTime /* , context: note.context, x: note.x(), y: note.y() */ })
    }
    startSixteenths += Duration.time(note.duration)
  });
  return result
};