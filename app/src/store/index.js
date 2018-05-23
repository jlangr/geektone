import { createStore } from 'redux';
import songReducer from '../reducers/SongReducer';

export default createStore(songReducer);