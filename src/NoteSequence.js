import Note from './Note';

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

  note(position) {
    return this.notes[position];
  }

  firstNote() {
    return this.notes[0];
  }

  lastNote() {
    return this.notes[this.notes.length - 1];
  }

  allNoteNames() {
    return this.notes.map(n => n.name());
  }

  isNoteSelected() {
    return this.currentNote !== -1;
  }

  selectedNote() {
    if (this.currentNote === -1) return nullNote;
    return this.notes[this.currentNote];
  }

  deselectAll() {
    this.currentNote = -1;
  }

  isSelected(position) {
    return this.note(position).isSelected;
  }

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

  select(i) {
    this.currentNote = i;
    this.notes[i].select();
  }

  selectFirst() {
    this.select(0);
  }

  selectLast() {
    this.select(this.notes.length - 1);
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

  deleteSelected() {
    this.notes.splice(this.currentNote, 1);
    this.currentNote = Math.max(0, this.currentNote - 1);
    this.select(this.currentNote);
  }

  duplicateNote() {
    const note = this.selectedNote();
    const copy = new Note(note.name());
    this.notes.splice(this.currentNote + 1, 0, copy);
    this.selectNext();
  }
}
