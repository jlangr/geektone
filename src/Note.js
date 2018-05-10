import Rect from './Rect';
import { verticalIndex } from './Staff';

export const height = 64;
export const lineHeight = height / 4;

const stemHeight = 36;

const notePad = 25;
export const noteDistance = 8;
const noteWidth = 7;
const noteHeight = 5;
const noteStroke = 2;
const highlightStroke = 4;
const rotation = 0;

export const sharpsInWidth = 3;
const sharpPad = 8;
export const sharpWidth = 20;
export const sharpArea = sharpWidth + 4;
export const sharpsArea = (sharpsInWidth * sharpArea) + sharpPad;

const lineColor = 'black';
const highlightColor = 'red';
const wholeFill = 'white';
const quarterFill = 'black';

const ascendingWholeNoteScale =
  ["C", "D", "E", "F", "G", "A", "B"];

export const quarter = '4n';
export const half = '2n';
export const whole = '1n';

export default class Note {
  constructor(name, duration = quarter) {
    this.octave = parseInt(name.slice(-1), 10);
    let note = Note.note(name); //name.slice(0, -1);
    this.noteIndex = ascendingWholeNoteScale.indexOf(note);
    this.isSelected = false;
    this.duration = duration;
  }

  static note(name) {
    return name.slice(0, -1);
  }

  static isOnLine(name) {
    return Note.note(name).charCodeAt() % 2 === 1;
  }

  toggleDot() {
    // not whole note
    if (this.duration.endsWith('.'))
      this.duration = this.duration.slice(0, -1);
    else
      this.duration += '.';
  }

  select() {
    this.isSelected = true;
  }

  deselect() {
    this.isSelected = false;
  }

  name() {
    if (this.noteIndex === -1) return "";
    return `${ascendingWholeNoteScale[this.noteIndex]}${this.octave}`;
  }


  isHighestNote() {
    return this.name() === 'C8';
  }

  increment() {
    if (this.isHighestNote()) return;

    if (this.noteIndex + 1 === ascendingWholeNoteScale.length) this.octave++;
    this.noteIndex = ascendingWholeNoteScale.next(this.noteIndex);
  }

  isLowestNote() {
    return this.octave === 1 && this.noteIndex === 0;
  }

  decrement() {
    if (this.isLowestNote()) return;

    if (this.noteIndex === 0) this.octave--;
    this.noteIndex = ascendingWholeNoteScale.prev(this.noteIndex);
  }

  // TODO externalize below ... to Staff?

  isHit(mousePosition, position) {
    return new Rect(this.x(position), this.y(), noteWidth, noteHeight)
      .contains(mousePosition);
  }

  x(position) {
    return sharpsArea + notePad + (position * (noteDistance + notePad));
  }

  y() {
    return verticalIndex(this.name()) * lineHeight / 2;
  }

  drawEllipse(context, position, extraRadius=0) {
    context.ellipse(
      this.x(position), this.y(),
      noteWidth + extraRadius, noteHeight + extraRadius,
      rotation, 0, 2 * Math.PI);
  }

  drawFilledEllipse(context, position, color, extraRadius=0) {
    this.drawEllipse(context, position, extraRadius);
    context.fillStyle = color;
    context.fill();
  }

  drawStem(context, position) {
    context.moveTo(this.x(position) + noteWidth, this.y());
    context.lineTo(this.x(position) + noteWidth, this.y() - stemHeight);
  }

  drawWhole(context, position) {
    this.drawFilledEllipse(context, position, wholeFill);
  }

  drawHalf(context, position) {
    this.drawFilledEllipse(context, position, wholeFill);
    this.drawStem(context, position);
  }

  drawQuarter(context, position) {
    this.drawFilledEllipse(context, position, quarterFill);
    this.drawStem(context, position);
  }

  drawDot(context, position) {
    const dotSize = 2;
    const dotPad = 3;
    const dotDescension = 5;
    const x = this.x(position) + noteWidth + (2 * dotSize + dotPad);
    const y = this.y() + dotDescension;
    context.moveTo(x, y);
    context.ellipse(x, y, dotSize, dotSize, rotation, 0, 2 * Math.PI);
    context.fill();
  }

  highlightNote(context, position) {
    context.beginPath();
    context.strokeStyle = highlightColor;
    context.lineWidth = highlightStroke;
    this.drawEllipse(context, position, highlightStroke);
    context.stroke();
  }

  isWholeBase() { return this.duration.startsWith(whole); }
  isHalfBase() { return this.duration.startsWith(half); }
  isQuarterBase() { return this.duration.startsWith(quarter); }

  isDottedDuration() {
    return this.duration.endsWith('.');
  }

  drawNoteOn(context, position) {
    context.beginPath()
    context.lineWidth = noteStroke;
    context.strokeStyle = lineColor;
    // TODO externalize
    if (this.isWholeBase()) this.drawWhole(context, position);
    else if (this.isHalfBase()) this.drawHalf(context, position);
    else if (this.isQuarterBase()) this.drawQuarter(context, position);

    if (this.isDottedDuration())
      this.drawDot(context, position);
    context.stroke();
  }

  drawOn(context, position) {
    this.drawNoteOn(context, position);
    if (this.isSelected)
      this.highlightNote(context, position);
  }
}
