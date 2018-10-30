import * as Constants from './Constants'
import * as Draw from './util/Draw'

const SixteenthsCapacity = 16

export default class Bar {
  constructor(startIndex = 0) {
    this.notes = []
    this.sixteenths = 0
    this.startIndex = startIndex
  }

  length() {
    return this.notes.length
  }

  isEmpty() {
    return this.notes.length === 0
  }

  push(note) {
    this.notes.push(note)
    this.sixteenths += note.sixteenths()
  }

  canAccommodate(note) {
    return this.sixteenths + note.sixteenths() <= SixteenthsCapacity
  }

  sixteenthsAvailable() {
    return 16 - this.sixteenths
  }

  isFull() {
    return this.sixteenths === SixteenthsCapacity
  }

  positionsRequired() {
    const smallestIncrement = Math.min(...this.notes.map(note =>
      note.isDotted() ? note.sixteenthsInTheDot() : note.sixteenths()))
    return SixteenthsCapacity / smallestIncrement
  }

  // pass in positions required!
  // once that is working, remove as default arg
  layouts(positionsRequired = this.positionsRequired()) {
    let sixteenthsPerPosition = 16 / positionsRequired
    let currentNotePosition = 0
    return this.notes.map(note => {
      const layout = { note, position: currentNotePosition }
      const positionIncrement = note.sixteenths() / sixteenthsPerPosition
      currentNotePosition += positionIncrement
      return layout
    })
  }

  drawVerticalBar(context, staffLines) {
    context.beginPath()

    const x = Draw.x(this.position)
    const yTop = Draw.y(staffLines[0])
    const yBottom = Draw.y(staffLines[staffLines.length - 1])
    Draw.drawLine(context, x, yTop, x, yBottom)

    context.stroke()
  }

  drawOn(context, hasTrebleNotes, hasBassNotes) {
    if (hasTrebleNotes) this.drawVerticalBar(context, Constants.trebleStaffLines)
    if (hasBassNotes) this.drawVerticalBar(context, Constants.bassStaffLines)
  }
}