export default class NoteSequence {
  constructor() {
    this.notes = [];
    this.currentNote = -1;
  }

  add(note) {
    this.notes.push(note);
  }
}
