import Rect from './Rect'
import * as Draw from './util/Draw'
import * as Duration from './Duration'
import { next, prev } from './js/ArrayUtil'
import NoteWidget, { restRectangle } from './ui/NoteWidget'
import * as Constants from './Constants'

const noteWidth = 7
export const noteHeight = 5

export default class Note {
  constructor(name, duration = Duration.quarter, isNote = true) {
    this.octave = parseInt(name.slice(-1), 10)
    let note = Note.note(name)
    this.baseName = note
    this.noteIndex = Constants.AscendingWholeNoteScale.indexOf(note)
    this.isSelected = false
    this.duration = duration
    this.isNote = isNote
    this.clearTie()
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
  }

  isRest() {
    return !this.isNote
  }

  setPosition(position) {
    this.position = position
  }

  isRepresentedAsTie() {
    return this.startTies !== undefined
  }

  setTies(startTies, endTies) {
    this.startTies = startTies
    this.endTies = endTies
  }

  clearTie() {
    this.startTies = undefined
    this.endTies = undefined
  }

  // TODO test?
  sixteenthsInTheDot() {
    return Duration.time(Duration.noteBase(this.duration)) / 2
  }

  sixteenths() {
    return Duration.time(this.duration)
  }

  isHigherOrEqual(that) {
    return this.octave > that.octave ||
      (this.octave === that.octave && this.noteIndex >= that.noteIndex)
  }

  toJSON() {
    return { name: this.name(), duration: this.duration, isNote: this.isNote }
  }

  toString() {
    return `${this.name()} ${this.duration}`
  }

  isDotted() {
    return Duration.isDotted(this.duration)
  }

  toggleDot() {
    if (Duration.isWholeBase(this.duration) || Duration.isSixteenthBase(this.duration))
      return

    if (this.duration.endsWith('.'))
      this.duration = this.duration.slice(0, -1)
    else
      this.duration += '.'
  }

  select() {
    if (this.isRepresentedAsTie()) {
      this.startTies.forEach(t => t.isSelected = true)
      this.endTies.forEach(t => t.isSelected = true)
    }
    this.isSelected = true
  }

  deselect() {
    if (this.isRepresentedAsTie()) {
      this.startTies.forEach(t => t.isSelected = false)
      this.endTies.forEach(t => t.isSelected = false)
    }
    this.isSelected = false
  }

  name() {
    if (this.noteIndex === -1) return ""
    return `${Constants.AscendingWholeNoteScale[this.noteIndex]}${this.octave}`
  }

  updateTiePitch() {
    if (this.isRepresentedAsTie()) {
      this.startTies.forEach(t => { 
        t.noteIndex = this.noteIndex
        t.octave = this.octave
      })
      this.endTies.forEach(t => { 
        t.noteIndex = this.noteIndex
        t.octave = this.octave
      })
    }
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
    const rect = this.isRest() ? restRectangle(this.x()) : this.noteRect(element)
    return rect.contains(mousePosition)
  }

  isHit(mousePosition) {
    if (this.isRepresentedAsTie())
      return this.startTies.concat(this.endTies).some(t => 
        this.isHitForElement(t, mousePosition))
      
    return this.isHitForElement(this, mousePosition)
  }

  x() { return Draw.x(this.position) }
  y() { return Draw.y(this.name()) }

  drawOn(context) {
    this.context = context // TODO: UGH. To support draw from playback
    new NoteWidget(context, this).draw()
  }
}
