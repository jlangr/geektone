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
      console.log('action.payload: tracks ', action.payload);
      const newSong = action.payload;
      newSong.tracks = newSong.tracks.map(track => {
        const noteSequence = new NoteSequence();
        track.notes.forEach(note => 
          noteSequence.add(new Note(note.name, note.duration)) // TODO simplify with constructor
        );
        return { ...track, notes: noteSequence };
      });
      return { ...state, song: newSong };
    }
    default:
      return state;
  }
};
