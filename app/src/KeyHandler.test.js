import NoteSequence from './NoteSequence';
import Note from './Note';
import { handleKey } from './KeyHandler';
import * as Duration from './Duration';

describe('keystrokes', () => {
  let noteSequence;
  beforeEach(() => noteSequence = new NoteSequence() );

  it('returns false when key not recognized', () => {
    noteSequence.add(new Note('E4'));
    noteSequence.selectFirst();

    expect(handleKey({key: '`'}, noteSequence)).toBeFalsy();
  });

  it('returns false when nothing selected', () => {
    expect(handleKey({key: 'x'}, noteSequence)).toBeFalsy();
  });

  it('returns true when key recognized', () => {
    noteSequence.add(new Note('E4'));
    noteSequence.selectFirst();

    expect(handleKey({key: 'ArrowUp'}, noteSequence)).toBeTruthy();
  });

  it('increments selected note on up arrow', () => {
    noteSequence.add(new Note('E4'));
    noteSequence.selectFirst();

    handleKey({key: 'ArrowUp'}, noteSequence);

    expect(noteSequence.selectedNote().name()).toEqual('F4');
  });

  it('decrements selected note on down arrow', () => {
    noteSequence.add(new Note('E4'));
    noteSequence.selectFirst();

    handleKey({key: 'ArrowDown'}, noteSequence);

    expect(noteSequence.selectedNote().name()).toEqual('D4');
  });

  it('selects previous note on left arrow', () => {
    noteSequence.add(new Note('E4'));
    noteSequence.add(new Note('F4'));
    noteSequence.select(1);

    handleKey({key: 'ArrowLeft'}, noteSequence);

    expect(noteSequence.selectedNote().name()).toEqual('E4');
  });

  it('selects next note on right arrow', () => {
    noteSequence.add(new Note('E4'));
    noteSequence.add(new Note('F4'));
    noteSequence.select(0);

    handleKey({key: 'ArrowRight'}, noteSequence);

    expect(noteSequence.selectedNote().name()).toEqual('F4');
  });

  describe('selects next/prev bar', () => {
    beforeEach(() => {
      noteSequence.add(new Note('C4'))
      noteSequence.add(new Note('D4'))
      noteSequence.add(new Note('E4'))
      noteSequence.add(new Note('F4'))
      noteSequence.add(new Note('G4'))
    })

    it('selects next bar on shift-right arrow', () => {
      noteSequence.selectFirst()

      handleKey({key: 'ArrowRight', shiftKey: true}, noteSequence)

      expect(noteSequence.selectedNote().name()).toEqual('G4')
    })

    it('selects next bar on shift-right arrow', () => {
      noteSequence.selectLast()

      handleKey({key: 'ArrowLeft', shiftKey: true}, noteSequence)

      expect(noteSequence.selectedNote().name()).toEqual('C4')
    })
  })


  it('duplicates selected note on d', () => {
    noteSequence.add(new Note('E4'));
    noteSequence.selectFirst();

    handleKey({key: 'd'}, noteSequence);

    expect(noteSequence.note(1).name()).toEqual('E4');

  });

  it('deletes selected note on x', () => {
    noteSequence.add(new Note('E4'));
    noteSequence.add(new Note('F4'));
    noteSequence.selectFirst();

    handleKey({key: 'x'}, noteSequence);

    expect(noteSequence.firstNote().name()).toEqual('F4');
  });

  it('sets selected note to 8th on 8', () => {
    noteSequence.add(new Note('E4', Duration.sixteenth));
    noteSequence.selectFirst();

    handleKey({key: '8'}, noteSequence);

    expect(noteSequence.firstNote().duration).toEqual('8n');
  });

  it('sets selected note to quarter on 4', () => {
    noteSequence.add(new Note('E4', Duration.sixteenth));
    noteSequence.selectFirst();

    handleKey({key: '4'}, noteSequence);

    expect(noteSequence.firstNote().duration).toEqual('4n');
  });

  it('sets selected note to half on 2', () => {
    noteSequence.add(new Note('E4', Duration.sixteenth));
    noteSequence.selectFirst();

    handleKey({key: '2'}, noteSequence);

    expect(noteSequence.firstNote().duration).toEqual('2n');
  });

  it('sets selected note to whole on 1', () => {
    noteSequence.add(new Note('E4', Duration.sixteenth));
    noteSequence.selectFirst();

    handleKey({key: '1'}, noteSequence);

    expect(noteSequence.firstNote().duration).toEqual('1n');
  });

  it('toggles dot on selected note on .', () => {
    noteSequence.add(new Note('E4', '4n'));
    noteSequence.selectFirst();

    handleKey({key: '.'}, noteSequence);

    expect(noteSequence.firstNote().duration).toEqual('4n.');
  });

  it('halves selected note duration on /', () => {
    noteSequence.add(new Note('E4', '2n'));
    noteSequence.selectFirst();

    handleKey({key: '/'}, noteSequence);

    expect(noteSequence.firstNote().duration).toEqual('4n');
  });

  it('doubles selected note duration on *', () => {
    noteSequence.add(new Note('E4', '2n'));
    noteSequence.selectFirst();

    handleKey({key: '*'}, noteSequence);

    expect(noteSequence.firstNote().duration).toEqual('1n');
  });

  it('converts note to rest on r', () => {
    noteSequence.add(new Note('E4', '4n'));
    noteSequence.selectFirst();

    handleKey({key: 'r'}, noteSequence);

    expect(noteSequence.firstNote().isRest()).toBeTruthy();
  });
});
