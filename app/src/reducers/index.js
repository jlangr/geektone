import { combineReducers } from 'redux';

import SongReducer from './SongReducer';
import SampleReducer from './SampleReducer';

export default combineReducers({
  composition: SongReducer,
  samples: SampleReducer
});