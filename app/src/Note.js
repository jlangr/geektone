import Rect from './Rect'
import * as Draw from './util/Draw'
import * as Duration from './Duration'
import { next, prev } from './js/ArrayUtil'

import NoteWidget from './ui/NoteWidget'

const noteWidth = 7
const noteHeight = 5

const ascendingWholeNoteScale =
  ["C", "D", "E", "F", "G", "A", "B"]

const RestNoteName = 'R'
export default class Note {
  constructor(name, duration = Duration.quarter) {
    this.octave = parseInt(name.slice(-1), 10)
    let note = Note.note(name)
    this.baseName = note
    this.noteIndex = ascendingWholeNoteScale.indexOf(note)
    this.isSelected = false
    this.duration = duration
    this.isNote = (name !== RestNoteName)
    this.clearTie()
  }

  static note(name) {
    return name.slice(0, -1)
  }

  static Rest(duration) {
    return new Note(RestNoteName, duration)
  }

  isATie() { return false }

  restToggle() {
    this.isNote = !this.isNote
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

  isRest() {
    return !this.isNote
  }

  // TODO test?
  sixteenthsInTheDot() {
    return Duration.time(Duration.noteBase(this.duration)) / 2
  }

  sixteenths() {
    return Duration.time(this.duration)
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
    return `${ascendingWholeNoteScale[this.noteIndex]}${this.octave}`
  }

  isHighestNote() {
    return this.name() === 'C8'
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

  increment() {
    if (this.isHighestNote()) return

    if (this.noteIndex + 1 === ascendingWholeNoteScale.length) this.octave++
    this.noteIndex = next(ascendingWholeNoteScale, this.noteIndex)
    this.updateTiePitch()
  }

  isLowestNote() {
    return this.octave === 1 && this.noteIndex === 0
  }

  decrement() {
    if (this.isLowestNote()) return

    if (this.noteIndex === 0) this.octave--
    this.noteIndex = prev(ascendingWholeNoteScale, this.noteIndex)
    this.updateTiePitch()
  }

  isHitForElement(element, mousePosition) {
    const rect = new Rect(
      element.x() - noteWidth, element.y() - noteHeight,
      noteWidth * 2, noteHeight * 2)
    return rect.contains(mousePosition)
  }

  isHit(mousePosition) {
    if (this.isRepresentedAsTie())
      return this.startTies.concat(this.endTies).some(t => 
        this.isHitForElement(t, mousePosition))
      
    return this.isHitForElement(this, mousePosition)
  }

  x() { return Draw.x(this.position) }
  y() { return Draw.y(this.name()); }

  drawOn(context) {
    this.context = context // TODO: UGH. To support draw from playback
    new NoteWidget(context, this).draw()
  }
}
