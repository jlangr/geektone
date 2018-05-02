import Rect from './Rect';
import { verticalIndex } from './Staff';

export const height = 64;
export const lineHeight = height / 4;

const stemHeight = 25;

const notePad = 25;
const noteDistance = 8;
const noteWidth = 7;
const noteHeight = 5;
const noteStroke = 2;
const highlightStroke = 4;
const rotation = 0;

const lineColor = 'black';
const highlightColor = 'red';
const wholeFill = 'white';
const quarterFill = 'black'

const ascendingWholeNoteScale =
  ["C", "D", "E", "F", "G", "A", "B"];

export const quarter = '4n';
export const half = '2n';
export const whole = '1n';

export default class Note {
  constructor(name, duration = quarter) {
    this.octave = parseInt(name.slice(-1), 10);
    let note = name.slice(0, -1);
    this.noteIndex = ascendingWholeNoteScale.indexOf(note);
    this.isSelected = false;
    this.duration = duration;
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

  increment() {
    if (this.name() === 'C8')
      return;

    if (this.noteIndex + 1 === ascendingWholeNoteScale.length) this.octave++;
    this.noteIndex = ascendingWholeNoteScale.next(this.noteIndex);
  }

  decrement() {
    if (this.octave === 1 && this.noteIndex === 0)
      return;

    if (this.noteIndex === 0) this.octave--;
    this.noteIndex = ascendingWholeNoteScale.prev(this.noteIndex);
  }

  // TODO externalize below ... to Staff?

  isHit(mousePosition, position) {
    return new Rect(this.x(position), this.y(), noteWidth, noteHeight)
      .contains(mousePosition);
  }

  x(position) {
    return notePad + (position * (noteDistance + notePad));
  }

  y() {
    return verticalIndex(this.name()) * lineHeight / 2;
  }

  ellipse(context, position, extraRadius=0) {
    context.ellipse(
      this.x(position), this.y(),
      noteWidth + extraRadius, noteHeight + extraRadius,
      rotation, 0, 2 * Math.PI);
  }

  filledEllipse(context, position, color, extraRadius=0) {
    this.ellipse(context, position, extraRadius);
    context.fillStyle = color;
    context.fill();
  }

  stem(context, position) {
    context.moveTo(this.x(position) + noteWidth, this.y());
    context.lineTo(this.x(position) + noteWidth, this.y() - stemHeight);
  }

  drawWhole(context, position) {
    this.filledEllipse(context, position, wholeFill);
  }

  drawHalf(context, position) {
    this.filledEllipse(context, position, wholeFill);
    this.stem(context, position);
  }

  drawQuarter(context, position) {
    this.filledEllipse(context, position, quarterFill);
    this.stem(context, position);
  }

  highlightNote(context, position) {
    context.beginPath();
    context.strokeStyle = highlightColor;
    context.lineWidth = highlightStroke;
    this.ellipse(context, position, highlightStroke);
    context.stroke();
  }

  drawNoteOn(context, position) {
    context.beginPath();
    context.lineWidth = noteStroke;
    context.strokeStyle = lineColor;
    switch (this.duration) {
      case whole: this.drawWhole(context, position); break;
      case half: this.drawHalf(context, position); break;
      case quarter: this.drawQuarter(context, position); break;
      default: break;
    }
    context.stroke();
  }

  drawOn(context, position) {
    this.drawNoteOn(context, position);
    if (this.isSelected)
      this.highlightNote(context, position);
  }
}
