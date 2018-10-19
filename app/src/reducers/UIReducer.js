import Range from '../Range'
import Rect from '../Rect'
import * as Draw from '../util/Draw'
import { noteHeight } from '../Note'
import * as Constants from '../Constants'

export const lineClickTolerance = 2

const isDrawnOnAStaffLine = note =>
  Constants.allStaffNotes.findIndex(n => n === note) % 2 === 0

export const staffNoteLineRanges = () => {
  const ranges = {}
  Constants.allStaffNotes.forEach(note => {
    const y = Draw.y(note)
    if (isDrawnOnAStaffLine(note))
      ranges[note] = new Range(y - lineClickTolerance, y + lineClickTolerance)
    else
      ranges[note] = new Range(y - noteHeight, y + noteHeight)
  })
  return ranges
}

export const nearestNote = (uiState, point) => {
  const pair = Object.entries(uiState.staff.noteLineRanges)
    .find(([_, range]) => range.contains(point.y))
  return pair ? pair[0] : undefined
}

export const INITIAL_STATE = {
  staff: {
    noteLineRanges: staffNoteLineRanges(),
    accidentalsRect:  new Rect(Draw.accidentalsLeft, 0, Draw.sharpArea * Draw.sharpsInWidth, Draw.y(Constants.MiddleC))
  }
}

export default(state = INITIAL_STATE, _action) => {
  return state
}