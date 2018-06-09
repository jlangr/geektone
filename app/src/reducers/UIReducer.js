import Range from '../Range'; // TODO location?
import Rect from '../Rect';

// ugh
import { lineHeight, sharpArea, sharpsInWidth } from '../Note';

export const MiddleC = 'C4';

// DUP
const trebleStaffNotes = [ 'A6', 'G5', 'F5', 'E5', 'D5', 'C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4' ];
const trebleStaffLines = [ 'F5', 'D5', 'B4', 'G4', 'E4' ];
const trebleStaffInterlineIndices = [ 3, 5, 7, 9 ];
export const lineClickTolerance = 3;

// DUP
export const verticalIndex = noteName => {
  return trebleStaffNotes.indexOf(noteName);
};

// DUP 
export const noteY = noteName => {
  return (verticalIndex(noteName) * lineHeight / 2);
}

export const staffNoteLineRanges = () => {
  const ranges = {};
  trebleStaffLines.forEach(note => {
    const y = noteY(note);
    ranges[note] = new Range(y - lineClickTolerance, y + lineClickTolerance);
  });
  trebleStaffInterlineIndices.forEach(i => {
    const note = trebleStaffNotes[i];
    const higherNote = trebleStaffNotes[i - 1];
    const lowerNote = trebleStaffNotes[i + 1];
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
    accidentalsRect:  new Rect(0, 0, sharpArea  * sharpsInWidth, noteY(MiddleC))
  }
};

export default(state = INITIAL_STATE, action) => {
  return state;
}