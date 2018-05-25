import * as type from '../actions/types';
import * as actions from '../actions/SynthActions';
import SynthReducer from './SynthReducer';

describe('add synth', () => {
  it('updates instrument-to-synth object', () => {
    const synth = 'flugelhornSynth';

    const state = SynthReducer(
      { synths: { 'x': 'y' }, expectedSynthCount: 2 },
      actions.addSynthAction('flugelhorn', synth));

    expect(state).toEqual({
      synths: { 'x': 'y', 'flugelhorn': 'flugelhornSynth' },
      expectedSynthCount: 2
    });
  });
});