import SongReducer from './SongReducer';
import NoteSequence from '../NoteSequence';
import Note from '../Note';
import * as actions from '../actions';
import * as type from '../actions/types';

describe('song reducer', () => {
  it('replaces the song', () => {
    const song = {name: 'new song', tracks: [
      {name: 'track1', notes: [{name: 'E4', duration: '4n'}, {name: 'F4', duration: '8n'}]}
    ]};

    const state = SongReducer(undefined, actions.replaceSong(song));

    const noteSequence = state.song.tracks[0].notes;
    expect(noteSequence.note(1).name()).toEqual('F4');
  });

  it('allows changing the song name', () => {
// TODO use action
    const state = SongReducer(undefined, { payload: 'new name', type: type.CHANGE_SONG_NAME });

    expect(state.song.name).toEqual('new name');
  });

  it('adds a track', () => {
    const noteSequence = new NoteSequence(['A3']);
    const newTrack = { id: 'track2', name: 'track2', notes: noteSequence };

// TODO use action
    const state = SongReducer(undefined, { payload: newTrack, type: type.ADD_TRACK });

    expect(state.song.tracks.length).toEqual(1);
    expect(state.song.tracks[0].name).toEqual('track2');
  });
});
