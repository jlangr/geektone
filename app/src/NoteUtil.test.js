import { applyAccidentals, noteObjects } from './NoteUtil';
import Note from './Note';

describe('noteObjects', () => {
  it('creates note objects with time transports', () => {
    let notes = [ new Note('C4', '8n'), new Note('D4', '4n')];

    expect(noteObjects(notes, ['C4'])).toEqual([
      { name: 'C#4', duration: '8n', time: '0:0:0'},
      { name: 'D4', duration: '4n', time: '0:0:2'}
    ]);
  });
});

describe('apply accidentals', () => {
  it('does nothing if no accidentals', () => {
    expect(applyAccidentals('F5', [])).toEqual('F5');
  });

  it('adds sharp if needed', () => {
    expect(applyAccidentals('F5', ['F5'])).toEqual('F#5');
  });
});