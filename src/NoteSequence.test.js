import './js/ArrayProtos';
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

      expect(currentNote.name()).toEqual('null');
    });

    it('returns selected note', () => {
      sequence.selectFirst();

      expect(sequence.selectedNote().name()).toEqual('E4');
    });
  });

  describe('next/prev note', () => {
    it('sets selected to subsequent note', () => {
      sequence.selectFirst();
      const first = sequence.selectedNote();

      sequence.selectNext();

      const note = sequence.selectedNote();
      expect(note.name()).toEqual('F4');
      expect(note.isSelected).toBeTruthy();
      expect(first.isSelected).toBeFalsy();
    });

    it('sets selected to previous note', () => {
      sequence.selectFirst();
      const first = sequence.selectedNote();

      sequence.selectPrev();

      const note = sequence.selectedNote();
      expect(note.name()).toEqual('G4');
      expect(note.isSelected).toBeTruthy();
      expect(first.isSelected).toBeFalsy();
    });

    it('sets selected to null if no current selection is empty', () => {
      sequence.deselectAll();

      sequence.selectNext();

      expect(sequence.selectedNote().name()).toBe('null');
    });

    it('prev sets selected to null if no current selection is empty', () => {
      sequence.deselectAll();

      sequence.selectPrev();

      expect(sequence.selectedNote().name()).toBe('null');
    });
  });
});
