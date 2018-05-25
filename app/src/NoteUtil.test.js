import { noteObjects } from './NoteUtil';
import Note from './Note';

describe('noteObjects', ()=> {
  it('creates note objects with time transpoprts', () => {
    let notes = [ new Note('C4', '8n'), new Note('D4', '4n')];

    expect(noteObjects(notes)).toEqual([
      { name: 'C4', duration: '8n', time: '0:0:0'},
      { name: 'D4', duration: '4n', time: '0:0:2'}
    ]);
  });
});