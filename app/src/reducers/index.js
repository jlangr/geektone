import { combineReducers } from 'redux';

import SynthReducer from './SynthReducer';
import SongReducer from './SongReducer';

export default combineReducers({
  samples: SynthReducer,
  composition: SongReducer
});