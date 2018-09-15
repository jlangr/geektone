import * as Draw from './util/Draw';

const SixteenthsCapacity = 16

export default class Bar {
  constructor() {
    this.notes = []
    this.sixteenths = 0
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

  isFull() {
    return this.sixteenths === SixteenthsCapacity
  }

  positionsRequired() {
    const smallestIncrement = Math.min(...this.notes.map(note => 
      note.isDotted() ? note.dotSixteenths() : note.sixteenths()))
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

  drawOn(context, xFunc) {
    const x = xFunc(this.position);
    context.beginPath();
    Draw.drawLine(context, x, this.topLineY, x, this.staffHeight);
    context.stroke();
  }
}