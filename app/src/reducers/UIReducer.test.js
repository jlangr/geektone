import * as Draw from '../util/Draw'
import UIReducer, { SelectGap, INITIAL_STATE, lineClickTolerance, nearestNote } from './UIReducer'
import Rect from '../Rect'
import * as Constants from '../Constants'
import * as actions from '../actions/UIActions'
import Line, { NullLine } from '../ui/Line';

describe('accidentals section', () => {
  it('is created with initial state', () => {
    const state = INITIAL_STATE

    expect(state.staff.accidentalsRect).toEqual(new Rect(Draw.accidentalsLeft, 0, Draw.sharpArea * Draw.sharpsInWidth, Draw.y(Constants.MiddleC)))
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