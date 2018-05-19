import SongReducer from './SongReducer';
import NoteSequence from '../NoteSequence';
import Note from '../Note';
import { ADD_TRACK } from '../actions/types';

describe('song reducer', () => {
  it('adds a track', () => {
    const noteSequence = new NoteSequence();
    noteSequence.add(new Note('A3')); // TODO support in ctor
    const newTrack = { id: 'track2', name: 'track2', notes: noteSequence };

    const state = SongReducer(undefined, { payload: newTrack, type: ADD_TRACK });

    expect(state.song.tracks.length).toEqual(1);
    expect(state.song.tracks[0].name).toEqual('track2');
  });
});
