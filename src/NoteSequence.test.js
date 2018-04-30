import NoteSequence from './NoteSequence';
import Note from './Note';

describe('note up', () => {
  it('', () => {
    const sequence = new NoteSequence();
    sequence.add(new Note('E4', 0));
    sequence.add(new Note('F4', 1));
    sequence.add(new Note('G4', 2));
  });
});
