import * as type from './types';
import axios from 'axios';

const axiosClient = axios.create({ baseURL: 'http://localhost:3001', timeout: 4000});

export const replaceSong = song => ({ type: type.REPLACE_SONG, payload: song });

// TODO test
export const loadSong = () => {
  return dispatch => {
    return axiosClient.get('/song')
      .then(response => {
        dispatch(replaceSong(response.data));
      })
      .catch(error => { 
        // TODO proper error handling
        dispatch({ type: type.ERROR, payload: error.toString() })
      })
  }
};