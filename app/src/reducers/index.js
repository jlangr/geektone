import { combineReducers } from 'redux';

import SynthReducer from './SynthReducer';
import SongReducer from './SongReducer';
import UIReducer from './UIReducer';

export default combineReducers({
  samples: SynthReducer,
  ui: UIReducer,
  composition: SongReducer
});