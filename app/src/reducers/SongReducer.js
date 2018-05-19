import NoteSequence from '../NoteSequence';
import { ADD_TRACK, CHANGE_SONG_NAME } from '../actions/types';

export const INITIAL_STATE = {
  song: {
    name: 'default',
    tracks: []
  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_TRACK:
    {
      const track = action.payload;
      return { ...state, song: { ...state.song, tracks: [...state.song.tracks, track] } };
    }
    case CHANGE_SONG_NAME:
    {
      return { ...state, song: { ...state.song, name: action.payload }};
    }
    default:
      return state;
  }
};
