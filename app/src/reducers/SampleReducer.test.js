import * as type from '../actions/types';
import * as actions from '../actions/SampleActions';
import SampleReducer from './SampleReducer';

describe('add synth', () => {
  it('updates instrument-to-synth object', ()=> {
    const synth = 'flugelhornSynth';

    const state = SampleReducer(
      { 
        expectedSynthCount: 2,
        synths: { 'x': 'y' }
      },
      actions.addSynthAction('flugelhorn', synth));

    expect(state).toEqual({
      synths: { 'x': 'y', 'flugelhorn': 'flugelhornSynth' },
      expectedSynthCount: 2
    });
  });
});