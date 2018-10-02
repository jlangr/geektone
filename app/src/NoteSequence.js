import Note from './Note'
import Tie from './Tie'
import * as Duration from './Duration'
import { prev, next } from './js/ArrayUtil'
import Bar from './Bar'
// TODO index
import DuplicateNoteCommand from './notesequence_commands/DuplicateNoteCommand'
import ToggleDotCommand from './notesequence_commands/ToggleDotCommand'
import ChangeDurationCommand from './notesequence_commands/ChangeDurationCommand'
import DeleteCommand from './notesequence_commands/DeleteCommand'
import IncrementCommand from './notesequence_commands/IncrementCommand'
import DecrementCommand from './notesequence_commands/DecrementCommand'
import Commander from './Commander'

const nullNote = {
  name: () => 'null',
  select: () => {},
  deselect: () => {},
  toggleDot: () => {},
  isSelected: false
}

export default class NoteSequence {
  constructor(noteNames = []) {
    this.notes = []
    noteNames.forEach(n => {
      if (Array.isArray(n))
        this.baseAdd(new Note(n[0], n[1]))
      else {
        const noteName = n
        this.baseAdd(new Note(noteName))
      }
    })
    if (noteNames.length > 0) this.rebar()
    this.currentNoteSequenceIndex = -1

    this.commander = new Commander(this)
  }

  undo() {
    this.commander.undo()
  }

  add(note) {
    this.baseAdd(note)
    this.rebar()
  }
  
  baseAdd(note) {
    this.notes.push(note)
  }

  addAll() {
    this.notes = Array.prototype.concat.apply(this.notes, arguments)
    this.rebar()
  }

  length() {
    return this.notes.length
  }

  allNotes() {
    return this.notes
  }

  allNoteNames() {
    return this.notes.map(n => n.name())
  }

  note(position) {
    return this.notes[position]
  }

  firstNote() {
    return this.notes[0]
  }

  lastNote() {
    return this.notes[this.notes.length - 1]
  }

  toJSON() {
    return this.allNotes().map(note => note.toJSON())
  }

  isNoteSelected() {
    return this.currentNoteSequenceIndex !== -1
  }

  selectedNote() {
    if (this.currentNoteSequenceIndex === -1) return nullNote
    return this.notes[this.currentNoteSequenceIndex]
  }

  isSelected(sequenceIndex) {
    return this.note(sequenceIndex).isSelected
  }

  clickHitNote(clickPoint) {
    for (let sequenceIndex = 0; sequenceIndex < this.notes.length; sequenceIndex++)
      if (this.notes[sequenceIndex].isHit(clickPoint)) {
        this.click(sequenceIndex)
        return true
      }
    return false
  }

  click(sequenceIndex) {
    if (this.isSelected(sequenceIndex))
      this.deselect(sequenceIndex)
    else {
      this.deselectAll()
      this.select(sequenceIndex)
    }
  }

  deselect(sequenceIndex) {
    this.note(sequenceIndex).deselect()
    this.currentNoteSequenceIndex = -1
  }

  deselectAll() {
    this.selectedNote().deselect()
    this.currentNoteSequenceIndex = -1
  }

  select(sequenceIndex) {
    this.currentNoteSequenceIndex = sequenceIndex
    this.notes[sequenceIndex].select()
  }

  selectFirst() {
    this.select(0)
  }

  selectLast() {
    this.select(this.notes.length - 1)
  }

  selectNext() {
    this.selectedNote().deselect()
    this.currentNoteSequenceIndex = next(this.notes, this.currentNoteSequenceIndex)
    this.selectedNote().select()
  }

  selectPrev() {
    this.selectedNote().deselect()
    this.currentNoteSequenceIndex = prev(this.notes, this.currentNoteSequenceIndex)
    this.selectedNote().select()
  }

  currentBarIndex() {
    return this.bars().findIndex(bar => 
      bar.startIndex + bar.length() > this.currentNoteSequenceIndex)
  }

  selectNextBar() {
    this.selectedNote().deselect()
    const barIndex = next(this.bars(), this.currentBarIndex())
    this.currentNoteSequenceIndex = this.bars()[barIndex].startIndex
    this.selectedNote().select()
  }

  selectPrevBar() {
    this.selectedNote().deselect()
    const barIndex = prev(this.bars(), this.currentBarIndex())
    this.currentNoteSequenceIndex = this.bars()[barIndex].startIndex
    this.selectedNote().select()
  }

  // commands

  setSelectedTo(duration) {
    this.commander.execute(new ChangeDurationCommand(duration))
  }

  halveSelectedDuration() {
    this.setSelectedTo(Duration.halveDuration(this.selectedNote().duration))
  }

  doubleSelectedDuration() {
    this.setSelectedTo(Duration.doubleDuration(this.selectedNote().duration))
  }

  duplicateNote() {
    this.commander.execute(new DuplicateNoteCommand())
  }

  toggleDotForSelected() {
    this.commander.execute(new ToggleDotCommand())
  }

  incrementSelected() {
    this.commander.execute(new IncrementCommand())
  }

  decrementSelected() {
    this.commander.execute(new DecrementCommand())
  }

  deleteSelected() {
    if (this.notes.length === 1) return

    this.commander.execute(new DeleteCommand())
  }

  // ...

  toggleRestForSelected() {
    this.selectedNote().restToggle()
  }

  createTies(note, timeRemaining) {
    const excessTime = note.sixteenths() - timeRemaining
    const start = new Tie(note.name(), Duration.noteForSixteenths(timeRemaining))
    start.isSelected = note.isSelected
    const end = new Tie(note.name(), Duration.noteForSixteenths(excessTime))
    end.isSelected = note.isSelected
    end.startTie = start
    note.setTie(start, end) // TODO test
    return [start, end]
  }

  // TODO: optimization if needed: rebar from changed location only
  rebar() {
    const barSequence = []
    let bar = new Bar()
    bar.startIndex = 0
    this.notes.forEach((note, i) => {
      note.clearTie() // TODO test in context
      if (!bar.canAccommodate(note)) {
        if (bar.isFull()) {
          barSequence.push(bar)
          bar = new Bar(i, note)
        }
        else {
          const [tieStart, tieEnd] = this.createTies(note, bar.sixteenthsAvailable())
          bar.push(tieStart)
          barSequence.push(bar)
          bar = new Bar(i, tieEnd)
        }
      }
      else {
        bar.push(note)
      }
    })
    if (!bar.isEmpty()) barSequence.push(bar)
    this.barSequence = barSequence
  }

  bars() {
    return this.barSequence
  }
}
