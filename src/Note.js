import Rect from './Rect';
import { verticalIndex } from './Staff';

export const height = 64;
export const lineHeight = height / 4;

const notePad = 25;
const noteDistance = 8;
const noteWidth = 7;
const noteHeight = 5;
const noteStroke = 2;
const rotation = 0;

const ascendingWholeNoteScale =
  ["C", "D", "E", "F", "G", "A", "B"];

export default class Note {
  constructor(name) {
    this.octave = parseInt(name.slice(-1), 10);
    let note = name.slice(0, -1);
    this.noteIndex = ascendingWholeNoteScale.indexOf(note);
    this.isSelected = false;
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

  // TODO externalize below:
  
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

  drawOn(context, position) {
    context.beginPath();
    context.lineWidth = noteStroke;
    context.ellipse(this.x(position), this.y(), noteWidth, noteHeight, rotation, 0, 2 * Math.PI);
    context.fillStyle = this.isSelected ? 'red' : 'white';
    context.fill();
    context.stroke();
  }
}
