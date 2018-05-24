import { ADD_TRACK, CHANGE_SONG_NAME, REPLACE_SONG } from '../actions/types';
import NoteSequence from '../NoteSequence';
import Note from '../Note';

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
    case REPLACE_SONG:
    {
      const newSong = action.payload;
      newSong.tracks = newSong.tracks.map(track => {
        const notes = track.notes.map(note => [note.name, note.duration]);
        return { ...track, notes: new NoteSequence(notes) };
      });
      return { ...state, song: newSong };
    }
    default:
      return state;
  }
};
