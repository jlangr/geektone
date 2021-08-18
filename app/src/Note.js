import Rect from './Rect'
import * as Draw from './util/Draw'
import * as Duration from './Duration'
import { next, prev } from './js/ArrayUtil'
import NoteWidget, { restRectangle } from './ui/NoteWidget'
import * as Constants from './Constants'

const noteWidth = 7
export const noteHeight = 5

export default class Note {
  constructor(name, duration = Duration.quarter, isNote = true, accidental = '') {
    this.octave = parseInt(name.slice(-1), 10)
    let note = Note.note(name)
    this.noteIndex = Constants.AscendingWholeNoteScale.indexOf(note)
    this.isSelected = false
    this.duration = duration
    this.isNote = isNote
    this.clearTie()
    this.accidental = accidental
  }

  static note(name) {
    return name.slice(0, -1)
  }

  static Rest(duration) {
    return new Note(Constants.MiddleC, duration, false)
  }

  isATie() { return false }

  restToggle() {
    this.isNote = !this.isNote
    this.ties.forEach(bar => bar.forEach(t => t.restToggle()))
  }

  isRest() {
    return !this.isNote
  }

  setPosition(position) {
    this.position = position
  }

  isRepresentedAsTie() {
    return this.ties.length > 0
  }

  firstTie() {
    return this.ties[0][0]
  }

  setTies(ties) {
    this.ties = ties
  }

  clearTie() {
    this.ties = []
  }

  sixteenthsInTheDot() {
    return Duration.toSixteenths(Duration.noteBase(this.duration)) / 2
  }

  sixteenths() {
    return Duration.toSixteenths(this.duration)
  }

  isHigherOrEqual(that) {
    return this.octave > that.octave ||
      (this.octave === that.octave && this.noteIndex >= that.noteIndex)
  }

  toJSON() {
    return { name: this.name(), duration: this.duration, isNote: this.isNote, accidental: this.accidental }
  }

  toString() {
    return `${this.name()} ${this.duration}`
  }

  isDotted() {
    return Duration.isDotted(this.duration)
  }

  toggleDot() {
    if (Duration.isSixteenthBase(this.duration))
      return

    if (Duration.isDotted(this.duration))
      this.duration = Duration.transportTime(Duration.toSixteenths(this.duration) * 2 / 3)
    else
      this.duration = Duration.transportTime(Duration.toSixteenths(this.duration) * 3 / 2)
  }

  toggleAccidental(accidental) {
    this.accidental = (this.accidental === accidental) ? '' : accidental 
    if (this.isRepresentedAsTie())
      this.firstTie().toggleAccidental(accidental)
  }

  select() {
    this.ties.forEach(bar => bar.forEach(t => t.isSelected = true))
    this.isSelected = true
  }

  deselect() {
    this.ties.forEach(bar => bar.forEach(t => t.isSelected = false))
    this.isSelected = false
  }

  name() {
    if (this.noteIndex === -1) return ""
    return `${Constants.AscendingWholeNoteScale[this.noteIndex]}${this.octave}`
  }

  updateTiePitch() {
    this.ties.forEach(bar => bar.forEach(t => {
      t.noteIndex = this.noteIndex
      t.octave = this.octave
    }))
  }

  isHighestNote() {
    return this.name() === Constants.allStaffNotes[0]
  }

  increment() {
    if (this.isRest() || this.isHighestNote()) return

    if (this.noteIndex + 1 === Constants.AscendingWholeNoteScale.length) this.octave++
    this.noteIndex = next(Constants.AscendingWholeNoteScale, this.noteIndex)
    this.updateTiePitch()
  }

  isLowestNote() {
    return this.name() === Constants.allStaffNotes[Constants.allStaffNotes.length - 1]
  }

  decrement() {
    if (this.isRest() || this.isLowestNote()) return

    if (this.noteIndex === 0) this.octave--
    this.noteIndex = prev(Constants.AscendingWholeNoteScale, this.noteIndex)
    this.updateTiePitch()
  }

  noteRect(element) {
    return new Rect(
      element.x() - noteWidth, element.y() - noteHeight,
      noteWidth * 2, noteHeight * 2)
  }

  isHitForElement(element, mousePosition) {
    const rect = element.isRest() ? restRectangle(element.x()) : this.noteRect(element)
    return rect.contains(mousePosition)
  }

  isHit(mousePosition) {
    if (this.isRepresentedAsTie())
      return this.ties.some(bar => bar.some(t => this.isHitForElement(t, mousePosition)))
    return this.isHitForElement(this, mousePosition)
  }

  x() { return Draw.x(this.position) }
  y() { return Draw.y(this.name()) }

  drawOn(context) {
    this.context = context // supports ability to draw from playback
    new NoteWidget(context, this).draw()
  }
}
