import NoteSequence from './NoteSequence';
import Note from './Note';

describe('NoteSequnce', () => {
  const sequence = new NoteSequence();

  beforeEach(() => {
    sequence.add(new Note('E4', 0));
    sequence.add(new Note('F4', 1));
    sequence.add(new Note('G4', 2));
  });

  describe('note sequence', () => {
    it('allows adding notes', () => {
      const notes = sequence.allNotes();

      expect(notes.length).toEqual(3);
    });
  });

  describe('note selection', () => {
    it('returns null when no note selected', () => {
      const currentNote = sequence.selectedNote();

      expect(currentNote).toBe(null);
    });

    it('returns selected note', () => {
      

    });
  });

  describe('', () => {
    it('', () => {

    });

  });
});
