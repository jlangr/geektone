import * as type from '../actions/types';

export const INITIAL_STATE = {
  sharpsMode: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case type.TOGGLE_SHARPS_MODE:
      return { ...state, sharpsMode: !state.sharpsMode };
    default:
      return state;
  }
};
