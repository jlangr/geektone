import UIReducer, { INITIAL_STATE } from './UIReducer';
import * as actions from '../actions';
import * as type from '../actions/types';

describe('toggle sharps mode', () => {
  it('is off by default', () => {
    const state = UIReducer(undefined, 'no action');

    expect(state.sharpsMode).toBeFalsy();
  });

  it('turns on with first toggle', () => {
    const state = UIReducer(INITIAL_STATE, actions.toggleSharpsMode());

    expect(state.sharpsMode).toBeTruthy();
  });
});