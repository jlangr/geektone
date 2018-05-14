import Note from './Note';
import * as timeUtil from './TimeUtil'; // needed?
import * as Duration from './Duration';
import { prev, next } from './js/ArrayUtil';

const nullNote = {
  name: () => 'null',
  select: () => {},
  deselect: () => {},
  toggleDot: () => {},
  isSelected: false
};

export default class NoteSequence {
  constructor() {
    this.notes = [];
    this.currentNote = -1;
    // is this used anymore
    this.noteChangeFn = () => {};
  }

  onNoteChange(fn) {
    this.noteChangeFn = fn;
  }

  add(note) {
    this.notes.push(note);
  }

  // ==

  allNotes() {
    return this.notes;
  }

  allNoteNames() {
    return this.notes.map(n => n.name());
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

  // ==

  isNoteSelected() {
    return this.currentNote !== -1;
  }

  selectedNote() {
    if (this.currentNote === -1) return nullNote;
    return this.notes[this.currentNote];
  }

  isSelected(position) {
    return this.note(position).isSelected;
  }

  clickHitNote(clickPoint) {
    for (let i = 0; i < this.notes.length; i++)
      if (this.notes[i].isHit(clickPoint, i)) {
        this.click(i);
        return true;
      }
    return false;
  }

  click(position) {
    if (this.isSelected(position))
      this.deselect(position);
    else {
      this.deselectAll();
      this.select(position);
    }
  }

  isClickOnThisNote(position) {
    return this.currentNote === position;
  }

  deselect(position) {
    this.note(position).deselect();
    this.currentNote = -1;
  }

  deselectAll() {
    this.selectedNote().deselect();
    this.currentNote = -1;
  }

  select(position) {
    this.currentNote = position;
    this.notes[position].select();
    this.noteChangeFn(this.note(this.currentNote));
  }

  selectFirst() {
    this.select(0);
  }

  selectLast() {
    this.select(this.notes.length - 1);
  }

  selectNext() {
    this.selectedNote().deselect();
    this.currentNote = next(this.notes, this.currentNote);
    this.selectedNote().select();
  }

  selectPrev() {
    this.selectedNote().deselect();
    this.currentNote = prev(this.notes, this.currentNote);
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
    copy.duration = note.duration;
    this.notes.splice(this.currentNote + 1, 0, copy);
    this.selectNext();
  }

  setSelectedTo(duration) {
    this.selectedNote().duration = duration;
  }

  halveSelectedDuration() {
    this.selectedNote().duration = Duration.halveDuration(this.selectedNote().duration);
  }

  doubleSelectedDuration() {
    this.selectedNote().duration = Duration.doubleDuration(this.selectedNote().duration);
  }

  toggleDotForSelected() {
    this.selectedNote().toggleDot();
  }

  incrementSelected() {
    this.selectedNote().increment();
  }

  decrementSelected() {
    this.selectedNote().decrement();
  }
}
