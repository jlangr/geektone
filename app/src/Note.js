import Rect from './Rect'
import * as Draw from './util/Draw'
import * as Duration from './Duration'
import { next, prev } from './js/ArrayUtil'

const stemHeight = 36

const noteWidth = 7
const restWidth = 20
const noteHeight = 5
const noteStroke = 2
const highlightStroke = 4
const rotation = 0

const lineColor = 'black'
const highlightColor = 'red'
const wholeFill = 'white'
const quarterFill = 'black'
const solidFill = 'black'

const ascendingWholeNoteScale =
  ["C", "D", "E", "F", "G", "A", "B"]

const RestNoteName = 'R'
export default class Note {
  constructor(name, duration = Duration.quarter) {
    this.octave = parseInt(name.slice(-1), 10)
    let note = Note.note(name) //name.slice(0, -1);
    this.baseName = note
    this.noteIndex = ascendingWholeNoteScale.indexOf(note)
    this.isSelected = false
    this.duration = duration // objectify?
    this.isNote = (name !== RestNoteName)
  }

  static note(name) {
    return name.slice(0, -1)
  }

  static Rest(duration) {
    return new Note(RestNoteName, duration)
  }

  restToggle() {
    this.isNote = !this.isNote;
  }

  isRest() {
    return !this.isNote;
  }

  dotSixteenths() {
    return Duration.time(Duration.noteBase(this.duration)) / 2
  }

  sixteenths() {
    return Duration.time(this.duration)
  }

  toJSON() {
    return { name: this.name(), duration: this.duration }
  }

  toString() {
    return `${this.name()} ${this.duration}`
  }

  // TODO test
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
    this.isSelected = true
  }

  deselect() {
    this.isSelected = false
  }

  name() {
    if (this.noteIndex === -1) return ""
    return `${ascendingWholeNoteScale[this.noteIndex]}${this.octave}`
  }

  isHighestNote() {
    return this.name() === 'C8'
  }

  increment() {
    if (this.isHighestNote()) return

    if (this.noteIndex + 1 === ascendingWholeNoteScale.length) this.octave++
    this.noteIndex = next(ascendingWholeNoteScale, this.noteIndex)
  }

  isLowestNote() {
    return this.octave === 1 && this.noteIndex === 0
  }

  decrement() {
    if (this.isLowestNote()) return

    if (this.noteIndex === 0) this.octave--
    this.noteIndex = prev(ascendingWholeNoteScale, this.noteIndex)
  }

  // TODO externalize below ... to Staff?
  isHit(mousePosition) {
    const centerX = this.x()
    const centerY = this.y()
    return new Rect(
      centerX - noteWidth, centerY - noteHeight,
      noteWidth * 2, noteHeight * 2)
      .contains(mousePosition)
  }

  // should be relative to bar start
  x() { return Draw.x(this.position) }

  y() { return Draw.y(this.name()); }

  drawNoteEllipse(context, extraRadius=0) {
    context.ellipse(
      this.x(), this.y(this.name()),
      noteWidth + extraRadius, noteHeight + extraRadius,
      rotation, 0, 2 * Math.PI)
  }

  drawFilledNoteEllipse(context, color, extraRadius=0) {
    this.drawNoteEllipse(context, extraRadius)
    context.fillStyle = color
    context.fill()
  }

  drawStem(context) {
    context.moveTo(this.x() + noteWidth, this.y())
    context.lineTo(this.x() + noteWidth, this.y() - stemHeight)
  }

  drawFlag(context) {
    context.moveTo(this.x() + noteWidth, this.y() - stemHeight)
    context.lineTo(this.x() + noteWidth + 6,
      this.y() - stemHeight + (stemHeight / 2))
  }

  drawLowerFlag(context) {
    const y = this.y() - stemHeight
    const yIncrease = 12
    context.moveTo(this.x() + noteWidth, y + yIncrease)
    context.lineTo(this.x() + noteWidth + 6,
      y + (stemHeight / 2) + yIncrease)
  }

  drawWhole(context) {
    this.drawFilledNoteEllipse(context, wholeFill)
  }

  drawHalf(context) {
    this.drawFilledNoteEllipse(context, wholeFill)
    this.drawStem(context)
  }

  drawQuarter(context) {
    this.drawFilledNoteEllipse(context, quarterFill)
    this.drawStem(context)
  }

  drawEighth(context) {
    this.drawFilledNoteEllipse(context, quarterFill)
    this.drawStem(context)
    this.drawFlag(context)
  }

  drawSixteenth(context) {
    this.drawFilledNoteEllipse(context, quarterFill)
    this.drawStem(context)
    this.drawFlag(context)
    this.drawLowerFlag(context)
  }

  drawDot(context) {
    const dotSize = 2
    const dotPad = 3
    const dotDescension = 5
    const x = this.x() + noteWidth + (2 * dotSize + dotPad)
    const y = this.y() + dotDescension
    context.moveTo(x, y)
    context.ellipse(x, y, dotSize, dotSize, rotation, 0, 2 * Math.PI)
  }

  drawRestHighlight(context, extraRadius=0) {
    const y = Draw.y('F5')
    const height = Draw.y('E4') - y
    const width = (restWidth + 8)
    context.rect(this.x() - width / 2, y, width, height)
  }

  highlightNote(context) {
    context.beginPath()
    context.strokeStyle = highlightColor
    context.lineWidth = highlightStroke
    if (this.isRest())
      this.drawRestHighlight(context, highlightStroke)
    else
      this.drawNoteEllipse(context, highlightStroke)
    context.stroke()
  }

  drawEighthRest(context) {
    let x = this.x() - noteWidth / 2
    const restY = Draw.y('E4') - 6
    let y = restY - 20
    
    const radius = 4
    context.ellipse(x, y, radius, radius, rotation, 0, 2 * Math.PI)
    context.fillStyle = quarterFill
    context.fill()
    y += radius - 2
    context.moveTo(x, y)
    context.bezierCurveTo(x, y + 6, x + 6, y, x + 16, y - 10)
    x += 16
    y -= 10
    context.moveTo(x, y)
    context.lineTo(x - 8, y + 30)
  }

  r16ball(context, x, y, radius) {
    context.moveTo(x, y)
    context.ellipse(x, y, radius, radius, rotation, 0, 2 * Math.PI)
    context.fillStyle = quarterFill
    context.fill()
  }

  r16swoop(context, x, y, radius) {
    y += radius - 2
    context.moveTo(x, y)
    context.bezierCurveTo(x, y + 6, x + 6, y, x + 16, y - 10)
  }

  drawSixteenthRest(context) {
    const radius = 4
    let x = this.x() - noteWidth / 2
    let y = Draw.y('G4') - 16
    
    this.r16ball(context, x, y, radius)
    this.r16swoop(context, x, y, radius)

    this.r16ball(context, x - 4, y + radius + 8, radius)
    this.r16swoop(context, x - 4, y + radius + 8, radius)

    // ew hardcoded, use trig funcs instead
    x += 16
    y -= 10
    context.moveTo(x, y)
    context.lineTo(x - 8, y + 30)
  }

  drawWholeOrHalfRest(context, heightOffset=0) {
    const width = 20
    const height = 8
    let x = this.x()
    let y = Draw.y('B4')
    context.rect(
      x - (width / 2), y + (heightOffset * height), 
      width, height);
    context.fillStyle = solidFill
    context.fill()
  }

  drawWholeRest(context) {
    this.drawWholeOrHalfRest(context, 0)
  }

  drawHalfRest(context) {
    this.drawWholeOrHalfRest(context, -1)
  }

  drawQuarterRest(context) {
    let x = this.x()
    let y = Draw.y('E4') - 6
    context.lineWidth = 4
    context.moveTo(x, y)
    context.bezierCurveTo(x - 8, y - 4, x - 3, y - 10, x + 5, y - 5)
    x = x + 5
    y = y - 5
    context.moveTo(x, y)
    context.bezierCurveTo(x - 20, y - 18, x + 6, y - 16, x - 5, y - 22)
  }
//  experiment w/ beziers: http://jsfiddle.net/halfsoft/Gsz2a/

  drawRest(context) {
    if (Duration.isQuarterBase(this.duration)) this.drawQuarterRest(context)
    else if (Duration.isEighthBase(this.duration)) this.drawEighthRest(context)
    else if (Duration.isHalfBase(this.duration)) this.drawHalfRest(context)
    else if (Duration.isWholeBase(this.duration)) this.drawWholeRest(context)
    else if (Duration.isSixteenthBase(this.duration)) this.drawSixteenthRest(context)
  }

  drawNote(context) {
      // TODO inject function into note instead
    if (Duration.isWholeBase(this.duration)) this.drawWhole(context)
    else if (Duration.isHalfBase(this.duration)) this.drawHalf(context)
    else if (Duration.isQuarterBase(this.duration)) this.drawQuarter(context)
    else if (Duration.isEighthBase(this.duration)) this.drawEighth(context)
    else if (Duration.isSixteenthBase(this.duration)) this.drawSixteenth(context)
  }

  drawElementOn(context) {
    context.beginPath()
    context.lineWidth = noteStroke
    context.strokeStyle = lineColor

    if (this.isRest())
      this.drawRest(context)
    else
      this.drawNote(context)

    if (this.isDotted())
      this.drawDot(context)

    context.stroke()
  }

  drawOn(context) {
    this.drawElementOn(context)
    if (this.isSelected)
      this.highlightNote(context)
  }
}
