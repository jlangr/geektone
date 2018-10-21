import * as Draw from '../util/Draw'
import * as UIReducer from './UIReducer'
import Rect from '../Rect'
import * as Constants from '../Constants'

describe('accidentals section', () => {
  it('is created with initial state', () => {
    const state = UIReducer.INITIAL_STATE

    expect(state.staff.accidentalsRect).toEqual(new Rect(Draw.accidentalsLeft, 0, Draw.sharpArea * Draw.sharpsInWidth, Draw.y(Constants.MiddleC)))
  })
})

describe('nearest note', () => {
  const state = UIReducer.INITIAL_STATE

  it('selects a staff-line note if dead-on', () => {
    const nearest = UIReducer.nearestNote(state, { x: 1, y: Draw.y('F4')})

    expect(nearest).toEqual('F4')
  })

  it('selects a staff-line note if within tolerance above', () => {
    const justAbove = Draw.y('D4') - 1

    const note = UIReducer.nearestNote(state, { x: 1, y: justAbove })

    expect(note).toEqual('D4')
  })

  it('returns undefined if above staff', () => {
    const tooHigh = Draw.y('A4') - UIReducer.lineClickTolerance - 1

    const nearest = UIReducer.nearestNote(state, { x: 1, y: tooHigh })

    expect(nearest).toBeUndefined()
  })

  it('returns undefined if below staff', () => {
    const tooLow = Draw.y('E1') + UIReducer.lineClickTolerance + 1

    const nearest = UIReducer.nearestNote(state, { x: 1, y: tooLow })

    expect(nearest).toBeUndefined()
  })
  
  it('selects an off-line note in the middle', () => {
    const tooLow = Draw.y('B3') + UIReducer.lineClickTolerance + 1

    const nearest = UIReducer.nearestNote(state, { x: 1, y: tooLow })

    expect(nearest).toEqual('A3')
  })
})