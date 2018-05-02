import './js/ArrayProtos';
import NoteSequence from './NoteSequence';
import Note, { quarter, half, whole } from './Note';

describe('NoteSequnce', () => {
  let sequence;

  beforeEach(() => {
    sequence = new NoteSequence();
    sequence.add(new Note('E4', 0));
    sequence.add(new Note('F4', 1));
    sequence.add(new Note('G4', 2));
  });

  describe('note sequence', () => {
    it('allows adding notes', () => {
      expect(sequence.allNotes().length).toEqual(3);
    });
  });

  describe('isNoteSelected', () => {
    it('returns true after selection', () => {
      sequence.selectFirst();

      expect(sequence.isNoteSelected()).toBeTruthy();
    });

    it('returns false by default', () => {
      expect(sequence.isNoteSelected()).toBeFalsy();
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

  describe('click on position', () => {
    it('deselects if already selected', () => {
      sequence.selectFirst();

      sequence.click(0);

      expect(sequence.firstNote().isSelected).toBeFalsy();
    });

    it('selects if not selected', () => {
      sequence.selectLast();

      sequence.click(0);

      const note = sequence.firstNote();
      expect(sequence.firstNote().isSelected).toBeTruthy();
      expect(sequence.lastNote().isSelected).toBeFalsy();
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

  describe('duplicate note', () => {
    it('introduces new note following selected', () => {
      sequence.selectFirst();

      sequence.duplicateNote();

      expect(sequence.allNoteNames()).toEqual(['E4', 'E4', 'F4', 'G4']);
    });

    it('introduces new note following selected', () => {
      sequence.selectFirst();

      sequence.duplicateNote();

      const firstNote = sequence.note(0);
      const newNote = sequence.note(1);
      expect(firstNote.isSelected).toBeFalsy();
      expect(newNote.isSelected).toBeTruthy();
    });
  });

  describe('delete selected', () => {
    it('removes the currently selected note', () => {
      sequence.select(1);
      sequence.deleteSelected();

      expect(sequence.allNoteNames()).toEqual(['E4', 'G4']);
    });

    it('selects the previous note', () => {
      sequence.select(1);
      sequence.deleteSelected();

      expect(sequence.isSelected(0)).toBeTruthy();
    });

    it('re-selects if the first note is selected', () => {
      sequence.selectFirst();
      sequence.deleteSelected();

      expect(sequence.isSelected(0)).toBeTruthy();
    });
  });

  describe('set note length', () => {
    it('sets to half note', () => {
      sequence.selectFirst();

      sequence.setSelectedToHalfNote();

      expect(sequence.selectedNote().duration).toEqual(half);
    });
  });
});
