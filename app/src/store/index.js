import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import songReducer from '../reducers/SongReducer';

export default createStore(songReducer, applyMiddleware(thunk));