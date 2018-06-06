import * as type from '../actions/types';
import NoteSequence from '../NoteSequence';

export const INITIAL_STATE = {
  song: {
    name: 'default',
    tracks: []
  }
};

const SongReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case type.ADD_TRACK:
    {
      const track = action.payload;
      return { ...state, song: { ...state.song, tracks: [...state.song.tracks, track] } };
    }
    case type.CHANGE_BPM:
    {
      return { ...state, song: { ...state.song, bpm: action.payload }};
    }
    case type.CHANGE_SONG_NAME:
    {
      return { ...state, song: { ...state.song, name: action.payload }};
    }
    case type.CHANGE_TRACK_INSTRUMENT:
    {
      const trackId = action.payload.trackId;
      const updatedTrack = state.song.tracks[trackId];
      updatedTrack.instrument = action.payload.instrument;

      const tracks = state.song.tracks.map(track => ( track.id === trackId ? updatedTrack: track));

      return { ...state, song: {...state.song, tracks: tracks }};
    }
    case type.NEW_TRACK:
    {
      return state;
  // const updatedSong = {...this.state.song,
  //   tracks: [...this.state.song.tracks, { name: 'track 2', notes: new NoteSequence() }]};
    }
    case type.REPLACE_SONG:
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

export default SongReducer;