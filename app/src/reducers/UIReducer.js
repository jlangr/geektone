import Range from '../Range';
import Rect from '../Rect';
import * as Draw from '../util/Draw'

export const MiddleC = 'C4';

export const lineClickTolerance = 3;

export const staffNoteLineRanges = () => {
  const ranges = {};
  Draw.trebleStaffLines.forEach(note => {
    const y = Draw.y(note);
    ranges[note] = new Range(y - lineClickTolerance, y + lineClickTolerance);
  });
  Draw.trebleStaffInterlineIndices.forEach(i => {
    const note = Draw.trebleStaffNotes[i];
    const higherNote = Draw.trebleStaffNotes[i - 1];
    const lowerNote = Draw.trebleStaffNotes[i + 1];
    ranges[note] = 
      new Range(ranges[higherNote].end + 1, ranges[lowerNote].start - 1);
  });
  return ranges;
}

export const nearestNote = (uiState, point) => {
  const pair = Object.entries(uiState.staff.noteLineRanges)
    .find(([_, range]) => range.contains(point.y));
  return pair ? pair[0] : undefined;
};

export const INITIAL_STATE = {
  staff: {
    noteLineRanges: staffNoteLineRanges(),
    accidentalsRect:  new Rect(Draw.accidentalsLeft, 0, Draw.sharpArea * Draw.sharpsInWidth, Draw.y(MiddleC))
  }
};

export default(state = INITIAL_STATE, _action) => {
  return state;
}