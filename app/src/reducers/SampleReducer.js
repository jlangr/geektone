import { ADD_SYNTH } from '../actions/types';

const INITIAL_STATE = {
  synths: [],
  expectedSynthCount: 2
};

export default(state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_SYNTH: 
      return {...state, synths: [...state.synths, action.payload]};
    default: 
      return state;
  }
};