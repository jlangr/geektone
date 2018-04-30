export default class NoteSequence {
  constructor() {
    this.notes = [];
    this.currentNote = -1;
  }

  add(note) {
    this.notes.push(note);
  }

  allNotes() {
    return this.notes;
  }

  selectedNote() {
    return null;
  }
}
