import Range from '../Range';
import Rect from '../Rect';
import * as Draw from '../util/Draw'

export const MiddleC = 'C4';

export const lineClickTolerance = 3;

const isDrawnOnAStaffLine = note =>
  Draw.trebleStaffLines.includes(note) ||
  Draw.bassStaffLines.includes(note)

export const staffNoteLineRanges = () => {
  const ranges = {};

  const interlineClickHeight = (Draw.lineHeight / 2) - (lineClickTolerance * 2)

  let previousBottomY = 0
  Draw.allStaffNotes.forEach(note => {
    if (isDrawnOnAStaffLine(note)) {
      const y = Draw.y(note);
      const top = y - lineClickTolerance
      const bottom = y + lineClickTolerance
      ranges[note] = new Range(top, bottom)
      previousBottomY = bottom
    }
    else {
      const top = previousBottomY + 1
      const bottom = top + interlineClickHeight - 1
      ranges[note] = new Range(top, bottom)
    }
  })
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