import NoteSequence from './NoteSequence';
import Note, { quarter, half, whole } from './Note';
import Bar from './Bar';
import Tie from './Tie';

describe('NoteSequence', () => {
  let sequence;

  describe('empty sequence', () => {
    describe('toJSON', () => {
      it('converts a notesequence to persistable JSON', () => {
        sequence = new NoteSequence([['E4', '4n'], ['F4', '8n'], ['G4', '16n']]);

        expect(sequence.toJSON()).toEqual([
          { name: 'E4', duration: '4n' },
          { name: 'F4', duration: '8n' },
          { name: 'G4', duration: '16n' }
        ]);
      });
    });

    describe('construction', () => {
      it('can be constructed with multiple notes', () => {
        sequence = new NoteSequence(['E4', 'F4']);

        expect(sequence.allNoteNames()).toEqual(['E4', 'F4']);
      });

      it('can be constructed with multiple notes', () => {
        sequence = new NoteSequence([['E4', '4n'], ['F4', '8n']]);

        expect(sequence.note(0).duration).toEqual('4n');
        expect(sequence.note(1).duration).toEqual('8n');
      });
    });
  });

  describe('bar sequence', () => {
    const e = new Note('E4', '4n');
    let sequence;

    beforeEach(() => {
      sequence = new NoteSequence();
    });

    it('fills a bar with four beats', () => {
      sequence.addAll(e, e, e, e);

      const bars = sequence.bars();

      expect(bars.length).toEqual(1);
      expect(bars[0].notes).toEqual([e, e, e, e]);
    });

    it('puts a bar inbetween every 4 beats', () => {
      sequence.addAll(e, e, e, e, e, e, e, e, e);

      const bars = sequence.bars();

      expect(bars.length).toEqual(3);
      expect(bars[0].notes).toEqual([e, e, e, e]);
      expect(bars[1].notes).toEqual([e, e, e, e]);
      expect(bars[2].notes).toEqual([e]);
    });

    it('handles all notes', () => {
      const fHalf = new Note('F4', '2n');
      sequence.addAll(e, e, fHalf, e);

      const bars = sequence.bars();

      expect(bars.length).toEqual(2);
      expect(bars[0].notes).toEqual([e, e, fHalf]);
      expect(bars[1].notes).toEqual([e]);
    });
  });
  
  describe('a rebar', () => {
    const e = new Note('E4', '4n');
    let sequence;
    let rebar;
    let existingRebar;

    beforeEach(() => {
      // TODO better way in Jest?
      existingRebar = NoteSequence.prototype.rebar;
    });

    afterEach(() => {
      NoteSequence.prototype.rebar = existingRebar;
    });

    describe('on construction', () => {
      it('triggers once with any notes', () => {
        rebar = jest.fn();
        NoteSequence.prototype.rebar = rebar;
        sequence = new NoteSequence(['E4', 'E5']);
        expect(rebar).toHaveBeenCalledTimes(1);
      });

      it('does not trigger if no notes added', () => {
        rebar = jest.fn();
        NoteSequence.prototype.rebar = rebar;
        sequence = new NoteSequence([]);
        expect(rebar).not.toHaveBeenCalled();
      });
    });

    describe('after construction', () => {
      beforeEach(() => {
        sequence = new NoteSequence(['E4', 'F4', 'G4']);
        sequence.selectFirst();
        rebar = jest.fn();
        NoteSequence.prototype.rebar = rebar;
      });

      it('triggers on call to add', () => {
        sequence.add(e);
        expect(rebar).toHaveBeenCalled();
      });

      it('triggers on call to deleteSelected', () => {
        sequence.deleteSelected();

        expect(rebar).toHaveBeenCalled();
      });

      it('triggers on call to duplicateNote', () => {
        sequence.duplicateNote();

        expect(rebar).toHaveBeenCalled();
      });

      it('triggers on call to halveSelectedDuration', () => {
        sequence.halveSelectedDuration();

        expect(rebar).toHaveBeenCalled();
      });

      it('triggers on call to doubleSelectedDuration', () => {
        sequence.doubleSelectedDuration();

        expect(rebar).toHaveBeenCalled();
      });

      it('triggers on call to toggleDotForSelected', () => {
        sequence.toggleDotForSelected();
        expect(rebar).toHaveBeenCalled();
      });
    });
  });

  describe('sequence with 3 notes', () => {
    beforeEach(() => {
      sequence = new NoteSequence(['E4', 'F4', 'G4']);
    });

    describe('note sequence', () => {
      it('allows adding notes', () => {
        sequence.add(new Note('A4'));

        expect(sequence.allNoteNames()).toEqual(['E4', 'F4', 'G4', 'A4']);
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

      it('removes selection on deselectAll', () => {
        sequence.selectFirst();

        sequence.deselectAll();

        expect(sequence.isNoteSelected()).toBeFalsy();
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

    describe('clickHitNote', () => {
      it('returns false when no note hit', () => {
        const clickPoint = { x: -1, y: -1 };

        const wasNoteHit = sequence.clickHitNote(clickPoint);

        expect(wasNoteHit).toBeFalsy();
      });

      describe('hit note', () => {
        let firstNoteClickPoint;
        let note;

        beforeEach(() => {
          const position = 1;
          note = sequence.note(position);
          note.position = position;
          firstNoteClickPoint = { x: note.x(), y: note.y() };
        });

        it('returns true when note hit', () => {
          const wasNoteHit = sequence.clickHitNote(firstNoteClickPoint);

          expect(wasNoteHit).toBeTruthy();
        });

        it('clicks note hit', () => {
          sequence.clickHitNote(firstNoteClickPoint);

          expect(note.isSelected);
        });
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

      it('includes duration', () => {
        sequence.note(0).duration = '16n';
        sequence.select(0);

        sequence.duplicateNote();

        expect(sequence.note(1).duration).toEqual('16n');
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

        sequence.setSelectedTo(half);

        expect(sequence.selectedNote().duration).toEqual(half);
      });
    });

    describe('increment/decrement selected', () => {
      beforeEach(() => {
        sequence.selectFirst();
      });

      it('increments selected', () => {
        expect(sequence.firstNote().name()).toEqual('E4');

        sequence.incrementSelected();

        expect(sequence.selectedNote().name()).toEqual('F4');
      });

      it('decrements selected', () => {
        expect(sequence.firstNote().name()).toEqual('E4');

        sequence.decrementSelected();

        expect(sequence.selectedNote().name()).toEqual('D4');
      });

    });

    describe('toggleDotForSelected', () => {
      it('does nothing when note not selected', () => {
        sequence.toggleDotForSelected();
      });

      describe('with first note selected', () => {
        beforeEach(() => {
          sequence.selectFirst();
        });

        it('turns on the dot for the selected note', () => {
          sequence.firstNote().duration = '8n';

          sequence.toggleDotForSelected();

          expect(sequence.firstNote().duration).toEqual('8n.');
        });

        it('turns off the dot for the selected note', () => {
          sequence.firstNote().duration = '8n.';

          sequence.toggleDotForSelected();

          expect(sequence.firstNote().duration).toEqual('8n');
        });
      });
    });
  });
});
