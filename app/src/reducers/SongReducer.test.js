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
    const state = SongReducer(undefined, actions.changeSongName('newName'));

    expect(state.song.name).toEqual('new name');
  });

  it('adds a track', () => {
    const noteSequence = new NoteSequence(['A3']);
    const newTrack = { id: 'track2', name: 'track2', notes: noteSequence };

    const state = SongReducer(undefined, actions.addTrack(newTrack));

    expect(state.song.tracks.length).toEqual(1);
    expect(state.song.tracks[0].name).toEqual('track2');
  });

  it('changes track instrument', () => {
    const state = { song: { tracks: [{instrument: 'piano'}]}};

    const newState = SongReducer(state, actions.changeTrackInstrument('cornet', 0));

    expect(newState.song.tracks[0].instrument).toEqual('cornet');
  });
});
