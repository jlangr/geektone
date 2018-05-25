import { ADD_SYNTH } from '../actions/types';

const INITIAL_STATE = {
  synths: [],
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