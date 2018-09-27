import Note from './Note'
import Tie from './Tie'
import * as Duration from './Duration'
import { prev, next } from './js/ArrayUtil'
import Bar from './Bar'

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

  // ==

  toJSON() {
    return this.allNotes().map(note => note.toJSON())
  }

  // ==

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
        console.log(`is hit seq index ${sequenceIndex}`)
        this.click(sequenceIndex)
        return true
      }
    return false
  }

  click(sequenceIndex) {
    console.log(`isSelected ${sequenceIndex}: ${this.isSelected(sequenceIndex)}`)
    if (this.isSelected(sequenceIndex)) {
      console.log(`deselecting ${sequenceIndex}`)
      this.deselect(sequenceIndex)
    }
    else {
      this.deselectAll()
      console.log(`selecting ${sequenceIndex}`)
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
    console.log(`selecting ${this.notes[sequenceIndex]}`)
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

  deleteSelected() {
    if (this.notes.length === 1) return

    this.notes.splice(this.currentNoteSequenceIndex, 1)
    this.currentNoteSequenceIndex = Math.max(0, this.currentNoteSequenceIndex - 1)
    this.select(this.currentNoteSequenceIndex)
    this.rebar()
  }

  duplicateNote() {
    const note = this.selectedNote()
    const copy = new Note(note.name())
    copy.duration = note.duration
    this.notes.splice(this.currentNoteSequenceIndex + 1, 0, copy)
    this.selectNext()
    this.rebar()
  }

  setSelectedTo(duration) {
    this.selectedNote().duration = duration
    this.rebar()
  }

  halveSelectedDuration() {
    this.selectedNote().duration = Duration.halveDuration(this.selectedNote().duration)
    this.rebar()
  }

  doubleSelectedDuration() {
    this.selectedNote().duration = Duration.doubleDuration(this.selectedNote().duration)
    this.rebar()
  }

  toggleDotForSelected() {
    this.selectedNote().toggleDot()
    this.rebar()
  }

  toggleRestForSelected() {
    this.selectedNote().restToggle()
  }

  incrementSelected() {
    this.selectedNote().increment()
  }

  decrementSelected() {
    this.selectedNote().decrement()
  }

  createTies(note, timeRemaining) {
    const excessTime = note.sixteenths() - timeRemaining
    const start = new Tie(note.name(), Duration.noteForSixteenths(timeRemaining))
    start.isSelected = note.isSelected // necessary?
    const end = new Tie(note.name(), Duration.noteForSixteenths(excessTime))
    end.isSelected = note.isSelected // necessary?
    end.startTie = start
    note.setTie(start, end) // TODO test
    return [start, end]
  }


  // The challenge:
  // drawing is involved with bars.
  // A note might span two bars in which case it needs a tie
  // A tie is a visual representation (view) of a note only relevant
  // for drawing purposes. The note still retains the same pitch and duration
  // for playing purposes

  // A note sequence is a list of Note objects, each of
  // which has a 0 based position

  // A rebar() creates a barSequence, which is
  // a list of Note objects, Bar objects, and Tie
  // Objects--so it is a view on a NoteSequence

  // Clicking on things and changing pitch or duration
  // involves the view and its representation.

  // To mesh the two... into a note sequence.
  // This would require that a tie note know how
  // to draw itself by drawing the start and end tie.
  // The rebar logic would need to change to support
  // the notion of a note, which goes in one bar,
  // and then that would alter the capacity for 
  // the subsequent bar

  // New concept: if a Note is a tie, it handles
  // the logic for drawing the two note images,
  // as well as handling interaction with them.
  // It does so by encapsulating two sub-note
  // instances. Everything goes through the Note,
  // and there is not a first-level Tie object
  // visible externally.

  // The logic in SongReducer.barsAndNotes will
  // need to be updated but that shouldn't be bad

  // Rebar: A note gets added to a bar if there is
  // any room. If too big, it is marked as a tie
  // and set up to store the two pieces of info needed
  // to draw start and end note symbols
  // 
  // The subsequent bar has to be updated to 
  // represent diminished capacity in rebar()

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
