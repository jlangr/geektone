const nullNote = {
  name: () => 'null',
  select: () => {},
  deselect: () => {},
  isSelected: false
};

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

  // TODO test
  isNoteSelected() {
    return this.currentNote !== -1;
  }

  // TODO rename to current note
  selectedNote() {
    if (this.currentNote === -1) return nullNote;
    return this.notes[this.currentNote];
  }

  deselectAll() {
    this.currentNote = -1;
  }

  selectFirst() {
    this.currentNote = 0;
  }

  note(position) {
    return this.notes[position];
  }

  isSelected(position) {
    return this.note(position).isSelected;
  }

  // F'ing tabs & spaces

  // untested
  click(position) {
    if (this.isSelected(position)) {
      this.note(position).deselect();
      this.currentNote = -1;
    }
    else {
      this.selectedNote().deselect();
      this.note(position).select();
      this.currentNote = position;
    }
  }

  isClickOnThisNote(position) {
    return this.currentNote === position;
  }

  selectNext() {
    this.selectedNote().deselect();
    this.currentNote = this.notes.next(this.currentNote);
    this.selectedNote().select();
  }

  selectPrev() {
    this.selectedNote().deselect();
    this.currentNote = this.notes.prev(this.currentNote);
    this.selectedNote().select();
  }
}
