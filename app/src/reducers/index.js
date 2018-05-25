import { combineReducers } from 'redux';

import SongReducer from './SongReducer';
import SynthReducer from './SynthReducer';

export default combineReducers({
  composition: SongReducer,
  samples: SynthReducer
});