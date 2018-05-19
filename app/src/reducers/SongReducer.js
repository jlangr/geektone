import NoteSequence from '../NoteSequence';
import { ADD_TRACK } from '../actions/types';

export const INITIAL_STATE = {
  song: {
    name: 'default',
    tracks: [] // [{ id: 'track0', name: 'track0', notes: new NoteSequence() }]
  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_TRACK:
      {
        const track = action.payload;
        return { ...state, song: { ...state.song, tracks: [...state.song.tracks, track] } };
      }
    default:
      return state;
  }
};
