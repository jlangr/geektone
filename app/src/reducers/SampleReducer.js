import { ADD_SYNTH } from '../actions/types';

export const INITIAL_SAMPLE_STATE = {
  synths: [],
  expectedSynthCount: 2
};

export default(state = INITIAL_SAMPLE_STATE, action) => {
  switch (action.type) {
    case ADD_SYNTH: 
      return {...state, synths: [...state.synths, action.payload]};
    default: 
      return state;
  }
};