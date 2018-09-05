import * as Duration from './Duration';

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
    this.sixteenths += Duration.time(note.duration);
  }

  canAccommodate(note) {
    return this.sixteenths + Duration.time(note.duration) <= 16;
  }

  isFull() {
    return this.sixteenths === 16;
  }
};