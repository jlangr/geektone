import Note from './Note';
import './js/ArrayProtos';

describe('note increment/decrement', () => {
  it('bumps up a half note', () => {
    const note = new Note("C#4");
    note.incrementHalf();
    expect(note.name()).toEqual("D4");
  });

  it('increments octave when necessary', () => {
    const note = new Note("B4");
    note.incrementHalf();
    expect(note.name()).toEqual("C5");
  });

  it('bumps down a half note', () => {
    const note = new Note("C#4");
    note.decrementHalf();
    expect(note.name()).toEqual("C4");
  });

  it('decrements octave when necessary', () => {
    const note = new Note("C4");
    note.decrementHalf();
    expect(note.name()).toEqual("B3");
  });

  it('ignores attempts to go below octave 1', () => {
    const note = new Note("C1");
    note.decrementHalf();
    expect(note.name()).toEqual("C1");
  });

  it('ignores attempts to go above octave 8', () => {
    const note = new Note("C8");
    note.incrementHalf();
    expect(note.name()).toEqual("C8");
  });
})

describe('is selected', () => {
  it('is false by default', () => {
    const note = new Note("C4");

    expect(note.isSelected).toBeFalsy();

  });

  it('is false when click does not hit', () => {
    const note = new Note("D4", 0);
    const draw = jest.fn();
    note.setListener({ draw: draw });

    note.clickOn({ x: note.x + 1000, y: note.y });

    expect(note.isSelected).toBeFalsy();
  //  expect(draw).toHaveBeenCalledWith(note);
  });

  it('is true when click is a hit', () => {
    const note = new Note("D4", 0);
    const hitFn = jest.fn();

    note.clickOn({ x: note.x, y: note.y }, 1, hitFn);

    expect(note.isSelected).toBeTruthy();
    expect(hitFn).toHaveBeenCalledWith(note, 1);
  });
});
