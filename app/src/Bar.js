import * as Duration from './Duration';

// TODO test this stuff directly

const SixteenthsCapacity = 16;

export default class Bar {
  constructor() {
    this.notes = [];
    this.sixteenths = 0;
  }

  isEmpty() {
    return this.notes.length === 0;
  }

  push(note) {
    this.notes.push(note);
    this.sixteenths += note.sixteenths();
  }

  canAccommodate(note) {
    return this.sixteenths + note.sixteenths() <= SixteenthsCapacity;
  }

  isFull() {
    return this.sixteenths === SixteenthsCapacity;
  }

  positionsRequired() {
    const smallestIncrement = Math.min(...this.notes.map(note => {
      if (note.isDotted())
        return note.dotSixteenths();
      else
        return note.sixteenths()
    }));
    return SixteenthsCapacity / smallestIncrement;
  }
};