import * as UIReducer from './UIReducer';
import Rect from '../Rect';
import { sharpArea, sharpsInWidth } from '../Note';

describe('accidentals section', () => {
  it('is created with initial state', () => {
    const state = UIReducer.INITIAL_STATE;

    expect(state.staff.accidentalsRect).toEqual(new Rect(0, 0, sharpArea * sharpsInWidth, UIReducer.noteY(UIReducer.MiddleC)));
  });
});

describe('nearest note', () => {
  const state = UIReducer.INITIAL_STATE;

  it('selects a staff-line note if dead-on', () => {
    const nearest = UIReducer.nearestNote(state, { x: 1, y: UIReducer.noteY('F5')});

    expect(nearest).toEqual('F5');
  });

  it('selects a staff-line note if within tolerance above', () => {
    const justAbove = UIReducer.noteY('D5') - 1;

    const note = UIReducer.nearestNote(state, { x: 1, y: justAbove });

    expect(note).toEqual('D5');
  });

  it('returns undefined if above staff', () => {
    const tooHigh = UIReducer.noteY('F5') - UIReducer.lineClickTolerance - 1;

    const nearest = UIReducer.nearestNote(state, { x: 1, y: tooHigh });

    expect(nearest).toBeUndefined();
  });

  it('returns undefined if below staff', () => {
    const tooLow = UIReducer.noteY('E4') + UIReducer.lineClickTolerance + 1;

    const nearest = UIReducer.nearestNote(state, { x: 1, y: tooLow });

    expect(nearest).toBeUndefined();
  });
  
  it('selects an off-line note in the middle', () => {
    const tooLow = UIReducer.noteY('B4') + UIReducer.lineClickTolerance + 1;

    const nearest = UIReducer.nearestNote(state, { x: 1, y: tooLow });

    expect(nearest).toEqual('A4');
  });
});