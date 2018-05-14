import Note from './Note';
import { quarter } from './TimeUtil';

describe('a note', () => {
  it('defaults to quarter note', () => {
    expect(new Note('F3').duration).toEqual(quarter);
  });
});

describe('whole note increment/decrement', () => {
  it('bumps up', () => {
    const note = new Note("C4");
    note.increment();
    expect(note.name()).toEqual("D4");
  });

  it('increments octave when necessary', () => {
    const note = new Note("B4");
    note.increment();
    expect(note.name()).toEqual("C5");
  });

  it('bumps down a half note', () => {
    const note = new Note("D4");
    note.decrement();
    expect(note.name()).toEqual("C4");
  });

  it('decrements octave when necessary', () => {
    const note = new Note("C4");
    note.decrement();
    expect(note.name()).toEqual("B3");
  });

  it('ignores attempts to go below octave 1', () => {
    const note = new Note("C1");
    note.decrement();
    expect(note.name()).toEqual("C1");
  });

  it('ignores attempts to go above octave 8', () => {
    const note = new Note("C8");
    note.increment();
    expect(note.name()).toEqual("C8");
  });
})

describe('to JSON', () => {
  expect(new Note('F3', '8n').toJSON()).toEqual({name: 'F3', duration: '8n'});
});

describe('dotted notes', () => {
  describe('toggle', () => {
    it('toggles dot to non dotted note', () => {
      const note = new Note('F2', '4n');

      note.toggleDot();

      expect(note.duration).toEqual('4n.');
    });

    it('removes dot from dotted note', () => {
      const note = new Note('F2', '2n.');

      note.toggleDot();

      expect(note.duration).toEqual('2n');
    });

    it('does not toggle whole notes', () => {
      const note = new Note('G4', '1n');

      note.toggleDot();

      expect(note.duration).toEqual('1n');
    });

    it('does not toggle 16th notes', () => {
      const note = new Note('G4', '16n');

      note.toggleDot();

      expect(note.duration).toEqual('16n');
    });
  });

  describe('is dotted', () => {
    expect(new Note('E4', '4n').isDottedDuration()).toBeFalsy();
    expect(new Note('E4', '4n.').isDottedDuration()).toBeTruthy();
  });

});

describe('hit testing', () => {
  it('is false when click does not hit', () => {
    const note = new Note("D4");
    const position = 0;

    const isHit = note.isHit({ x: note.x(position) + 1000, y: note.y() }, position);

    expect(isHit).toBeFalsy();
  });

  it('is true when click is a hit', () => {
    const note = new Note("D4");
    const position = 0;

    const isHit = note.isHit({ x: note.x(position), y: note.y() }, position);

    expect(isHit).toBeTruthy();
  });
});
