import * as type from '../actions/types';
import NoteSequence from '../NoteSequence';

export const INITIAL_STATE = {
  song: {
    name: 'default',
    tracks: []
  }
};

const remove = (arr, element) => {
  const i = arr.indexOf(element);
  arr.splice(i, 1);
}

const updateState_toggleSharpsMode = (state, trackIndex) => {
  const changedTrack = state.song.tracks[trackIndex];
  changedTrack.sharpsMode = !changedTrack.sharpsMode;
  const newTracks = 
    [...state.song.tracks.slice(0, trackIndex), changedTrack, ...state.song.tracks.slice(trackIndex+1) ];
  return { ...state, song: {...state.song, tracks: newTracks} };
};


const updateState_addSharp = (state, trackIndex, note) => {
  if (!note) return state;

  const updatedTrack = state.song.tracks[trackIndex];
  if (!updatedTrack.sharps) updatedTrack.sharps = [];

  if (updatedTrack.sharps.includes(note)) 
    remove(updatedTrack.sharps, note);
  else
    updatedTrack.sharps.push(note);

  updatedTrack.sharpsMode = false;

  const newTracks = 
    [...state.song.tracks.slice(0, trackIndex), updatedTrack, ...state.song.tracks.slice(trackIndex+1) ];

  return { ...state, song: {...state.song, tracks: newTracks} };
}

// refactor track update
export default(state = INITIAL_STATE, action) => {
  switch (action.type) {
    case type.ADD_SHARP: 
    {
      const { trackIndex, note } = action.payload;
      return updateState_addSharp(state, trackIndex, note);
    }
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

    case type.TOGGLE_SHARPS_MODE:
      const trackIndex = action.payload;
      return updateState_toggleSharpsMode(state, trackIndex);
    default:
      return state;
  }
};