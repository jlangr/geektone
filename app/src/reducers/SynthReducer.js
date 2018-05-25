import { ADD_SYNTH } from '../actions/types';

export const synthsLoaded = synthState => {
  return Object.keys(synthState.synths).length === synthState.expectedSynthCount;
};

const INITIAL_STATE = {
  synths: {},
  expectedSynthCount: 2
};

export default(state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_SYNTH: {
      const instrument = action.payload.instrument;
      const synth = action.payload.synth;
      return {...state, synths: {...state.synths, [instrument]: synth} };
    }
    default: 
      return state;
  }
};