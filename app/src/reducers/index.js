import { combineReducers } from 'redux';

import SynthReducer from './SynthReducer';
import SongReducer from './SongReducer';
import UIReducer from './UIReducer';

export default combineReducers({
  samples: SynthReducer,
  composition: SongReducer,
  ui: UIReducer
});