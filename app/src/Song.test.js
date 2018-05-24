import NoteSequence from './NoteSequence';
import { toJSON } from './Song';

describe('a song', () => { 
  it('can be converted to json for persistence', () => {
    const song = {
      name: 'default',
      tracks: [{name: 'track 1', notes: new NoteSequence(['E1', 'F1'])},
               {name: 'track 2', notes: new NoteSequence(['G2', 'A2'])}]};

    const json = toJSON(song);

    expect(json).toEqual({
      name: 'default',
      tracks: [{name: 'track 1', notes: [{name: 'E1', duration: '4n'}, {name: 'F1', duration: '4n'}]},
               {name: 'track 2', notes: [{name: 'G2', duration: '4n'}, {name: 'A2', duration: '4n'}]}] });
  });
});

// TODO better way to convert objects to equivalent JSON