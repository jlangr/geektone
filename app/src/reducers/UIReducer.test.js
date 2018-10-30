import * as Draw from '../util/Draw'
import UIReducer, { SelectGap, INITIAL_STATE, isClickInAccidentals, isNewEvent, lineClickTolerance, nearestNote, staffHeight } from './UIReducer'
import Rect from '../Rect'
import * as Constants from '../Constants'
import * as actions from '../actions/UIActions'
import Line, { NullLine } from '../ui/Line';
import NoteSequence from '../NoteSequence';

describe('accidentals section', () => {
  it('is created with initial state', () => {
    const state = INITIAL_STATE

    expect(state.staff.accidentalsRect).toEqual(new Rect(Draw.accidentalsLeft, 0, Draw.sharpArea * Draw.sharpsInWidth, Draw.y(Constants.MiddleC)))
  })
})

describe('is click in accidentals', () => {
  it('is false when outside rectangle', () => {
    const point = { x: Draw.accidentalsLeft - 1, y: 1}

    expect(isClickInAccidentals(INITIAL_STATE, point)).toBeFalsy()
  })

  it('is true when inside rectangle', () => {
    const point = { x: Draw.accidentalsLeft + 1, y: 1}

    expect(isClickInAccidentals(INITIAL_STATE, point)).toBeTruthy()
  })
})

describe('staff height', () => {
  it('is single staff height if only treble notes', () => {
    const song = { tracks: [{ notes: new NoteSequence(['C4']) }]}

    expect(staffHeight(song, 0)).toEqual(Draw.staffHeight)
  })

  it('is two staff heights if any bass notes', () => {
    const song = { tracks: [{ notes: new NoteSequence(['C2']) }]}

    expect(staffHeight(song, 0)).toEqual(2 * Draw.staffHeight)
  })
})

describe('nearest note', () => {
  const state = INITIAL_STATE

  it('selects a staff-line note if dead-on', () => {
    const nearest = nearestNote(state, { x: 1, y: Draw.y('F4')})

    expect(nearest).toEqual('F4')
  })

  it('selects a staff-line note if within tolerance above', () => {
    const justAbove = Draw.y('D4') - 1

    const note = nearestNote(state, { x: 1, y: justAbove })

    expect(note).toEqual('D4')
  })

  it('returns undefined if above staff', () => {
    const tooHigh = Draw.y('A4') - UIReducer.lineClickTolerance - 1

    const nearest = nearestNote(state, { x: 1, y: tooHigh })

    expect(nearest).toBeUndefined()
  })

  it('returns undefined if below staff', () => {
    const tooLow = Draw.y('E1') + UIReducer.lineClickTolerance + 1

    const nearest = nearestNote(state, { x: 1, y: tooLow })

    expect(nearest).toBeUndefined()
  })
  
  it('selects an off-line note in the middle', () => {
    const tooLow = Draw.y('B3') + lineClickTolerance + 1

    const nearest = nearestNote(state, { x: 1, y: tooLow })

    expect(nearest).toEqual('A3')
  })
})

describe('selection start', () => {
  it('defaults to NullLine', () => {
    const state = UIReducer(undefined, { type: 'whatever' })

    expect(state.staff.selectionStartLine).toEqual(new NullLine())
  })

  it('stores a click point as selection start', () => {
    const point = { x: 1, y: Draw.y('E3') }
    const canvasHeight = 40

    const state = UIReducer(undefined, actions.setSelectionStart(point, canvasHeight))

    expect(state.staff.selectionStartLine).toEqual(
      new Line({ x: 1, y: 0 + SelectGap }, { x: 1, y: 40 - SelectGap }, 'green'))
  })
})

describe('key focus update', () => {
  it('defaults last component with key focus to dummy', () => {
    const newState = UIReducer(undefined, { type: 'whatever' })

    expect(newState.lastComponentWithKeyFocus).toBeDefined()
  })

  it('changes last component with key focus', () => {
    const component = { id: 1 }
    const event = { timeStamp: 10001 }

    const newState = UIReducer(undefined, actions.keyFocusUpdate(component, event))

    expect(newState.lastComponentWithKeyFocus.id).toEqual(1)
    expect(newState.lastKeyEventTimeStamp).toEqual(10001)
  })
})

describe('is new event', () => {
  it('is usually new event', () => {
    const state = INITIAL_STATE

    expect(isNewEvent(state, { timeStamp: 1 })).toBeTruthy()
  })

  it('is not new event when its timestamp matches last event timestamp', () => {
    const state = INITIAL_STATE
    state.lastKeyEventTimeStamp = 1

    expect(isNewEvent(state, { timeStamp: 1 })).toBeFalsy()
  })
})