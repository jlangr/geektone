import { combineReducers } from 'redux';

import SongReducer from './SongReducer';
import SynthReducer from './SynthReducer';
import UIReducer from './UIReducer';

export default combineReducers({
  composition: SongReducer,
  samples: SynthReducer,
  ui: UIReducer
});