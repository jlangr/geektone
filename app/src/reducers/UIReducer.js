import Range from '../Range'
import Rect from '../Rect'
import * as Draw from '../util/Draw'
import { noteHeight } from '../Note'
import * as Constants from '../Constants'
import * as types from '../actions/types'
import Line, { NullLine } from '../ui/Line'

export const lineClickTolerance = 2
export const SelectGap = 10

const isDrawnOnAStaffLine = note =>
  Constants.allStaffNotes.findIndex(n => n === note) % 2 === 0

export const isClickInAccidentals = (uiState, point) =>
  uiState.staff.accidentalsRect.contains(point)

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

export const isNewEvent = (uiState, event) => uiState.lastKeyEventTimeStamp !== event.timeStamp

export const nearestNote = (uiState, point) => {
  const pair = Object.entries(uiState.staff.noteLineRanges)
    .find(([_, range]) => range.contains(point.y))
  return pair ? pair[0] : undefined
}

export const INITIAL_STATE = {
  staff: {
    noteLineRanges: staffNoteLineRanges(),
    accidentalsRect:  new Rect(Draw.accidentalsLeft, 0, Draw.sharpArea * Draw.sharpsInWidth, Draw.y(Constants.MiddleC)),
    selectionStartLine: new NullLine(),
  },
  lastComponentWithKeyFocus: { handleKeyPress: _e => {} }
}

export default(state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.KEY_FOCUS_UPDATE:
    {
      const { component, event } = action.payload
      return { ...state, lastComponentWithKeyFocus: component, lastKeyEventTimeStamp: event.timeStamp }
    }

    case types.SET_SELECTION_START:
    {
      const { clickPoint, canvasHeight } = action.payload
      const line = new Line(
        { x: clickPoint.x, y: 0 + SelectGap }, 
        { x: clickPoint.x, y: canvasHeight - SelectGap },
        'green')
      return { 
        ...state, 
        staff: { 
          ...state.staff, 
          selectionStartLine: line }}
    }

    default:
      return state
  }
}