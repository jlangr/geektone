import Note from './Note'
import Tie from './Tie'
import * as Duration from './Duration'
import { prev, next } from './js/ArrayUtil'
import Bar from './Bar'
import { DuplicateNoteCommand,
  ToggleDotCommand,
  ChangeDurationCommand,
  DeleteCommand,
  IncrementCommand,
  DecrementCommand,
  ToggleRestCommand } from './notesequence_commands'
import Commander from './Commander'
import { ToggleAccidentalCommand } from './notesequence_commands/ToggleAccidentalCommand';

const nullNote = {
  name: () => 'null',
  select: () => {},
  deselect: () => {},
  toggleDot: () => {},
  toggleAccidental: _ => {},
  isSelected: false
}

export default class NoteSequence {
  constructor(noteData = []) {
    this.notes = []
    noteData.forEach(n => {
      if (Array.isArray(n)) {
        const [name, duration, isNote, accidental] = n
        this.addWithNoRebar(new Note(name, duration, isNote, accidental))
      }
      else {
        const noteName = n
        this.addWithNoRebar(new Note(noteName))
      }
    })
    if (noteData.length > 0) this.rebar()
    this.currentNoteSequenceIndex = -1

    this.commander = new Commander(this)
  }

  undo() {
    this.commander.executeUndo()
  }

  redo() {
    this.commander.executeRedo()
  }

  add(note) {
    this.addWithNoRebar(note)
    this.rebar()
  }
  
  addWithNoRebar(note) {
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

  allNotesWithDurations() {
    return this.notes.map(n => [n.name(), n.duration])
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
      this.deselect()
    else {
      this.deselect()
      this.select(sequenceIndex)
    }
  }

  deselect() {
    if (this.currentNoteSequenceIndex !== -1) {
      this.note(this.currentNoteSequenceIndex).deselect()
      this.currentNoteSequenceIndex = -1
    }
  }

  select(sequenceIndex) {
    this.deselect()
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

  setSelectedTo(duration) {
    this.commander.execute(new ChangeDurationCommand(duration))
  }

  halveSelectedDuration() {
    this.setSelectedTo(Duration.halveDuration(this.selectedNote().duration))
  }

  doubleSelectedDuration() {
    this.setSelectedTo(Duration.doubleDuration(this.selectedNote().duration))
  }

  incrementSelectedDuration() {
    this.setSelectedTo(Duration.incrementDuration(this.selectedNote().duration))
  }

  decrementSelectedDuration() {
    this.setSelectedTo(Duration.decrementDuration(this.selectedNote().duration))
  }

  duplicateNote() {
    this.commander.execute(new DuplicateNoteCommand())
  }

  toggleDotForSelected() {
    this.commander.execute(new ToggleDotCommand())
  }

  toggleAccidentalForSelected(accidental) {
    this.commander.execute(new ToggleAccidentalCommand(accidental))
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

  toggleRestForSelected() {
    this.commander.execute(new ToggleRestCommand())
  }

  createTiesToFit(note, time, tieIndexOffset=0) {
    return Duration.notesForSixteenths(time).map((duration, tieIndex) =>
      new Tie(note.name(), duration, !note.isRest(), note.accidental, note.isSelected, 
        tieIndex + tieIndexOffset)
  )}

  createTiesForNote(note) {
    const ties = this.createTiesToFit(note, note.sixteenths())
    ties[ties.length - 1].startTie = ties[0]
    note.setTies([ties]) // TODO test
    return ties
  }

  createTies(note, timeRemainingInFirstBar) {
    const noteTies = []

    const startTies = this.createTiesToFit(note, timeRemainingInFirstBar)
    noteTies.push(startTies)

    let noteTime = note.sixteenths() - timeRemainingInFirstBar
    let length = startTies.length

    do {
      const tieTime = Math.min(noteTime, 16)
      const ties = this.createTiesToFit(note, tieTime, length)
      length += ties.length
      noteTies.push(ties)
      noteTime -= tieTime
    } while (noteTime > 0)

    const lastTies = noteTies[noteTies.length - 1]
    const lastTie = lastTies[lastTies.length - 1]
    lastTie.startTie = startTies[0]

    note.setTies(noteTies)

    return noteTies
  }

  addNoteToBar(bar, note) {
    if (Duration.requiresTie(note.duration))
      this.createTiesForNote(note).forEach(tie => bar.push(tie))
    else
      bar.push(note)
  }

  rebar() {
    const barSequence = []
    let bar = new Bar()
    bar.startIndex = 0
    this.notes.forEach((note, i) => {
      note.clearTie()

      if (bar.isFull()) {
        barSequence.push(bar)
        bar = new Bar(i)
      }

      if (bar.canAccommodate(note))
        this.addNoteToBar(bar, note)
      else {
        const noteTies = this.createTies(note, bar.sixteenthsAvailable())
        noteTies.forEach(tiesForBar => {
          if (bar.isFull()) {
            barSequence.push(bar)
            bar = new Bar(i)
          }
          tiesForBar.forEach(note => bar.push(note))
        })
      }
    })
    if (!bar.isEmpty()) barSequence.push(bar)
    this.barSequence = barSequence
  }

  bars() {
    return this.barSequence
  }
}
