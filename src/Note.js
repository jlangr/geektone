import Rect from './Rect';
import { verticalIndex } from './Staff';

export const height = 64;
export const lineHeight = height / 4;

const notePad = 25;
const noteDistance = 8;
const noteWidth = 7;
const noteHeight = 5;
const noteStroke = 2;

const ascendingChromaticScale =
  ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export default class Note {
  // nope position is relative to other notes
  // also maybe pass context to ctor
  constructor(name) {
    if (name === '') {
      this.noteIndex = -1;
      this.octave = -1;
    } else {
      this.octave = parseInt(name.slice(-1), 10);
      let note = name.slice(0, -1);
      this.noteIndex = ascendingChromaticScale.indexOf(note);

      this.y = verticalIndex(this.name()) * lineHeight / 2;

      this.rotation = 0;
      this.isSelected = false;
    }
  }

  clickOn(mousePosition, position, hitFn) {
    if (!this.isHit(mousePosition, position)) return;

    this.isSelected = !this.isSelected;
    hitFn(this, position);
  }

  click(mousePosition, position) {
    this.isSelected = !this.isSelected;
  }

  select() {
    this.isSelected = true;
  }

  deselect() {
    this.isSelected = false;
  }

  isHit(mousePosition, position) {
    return new Rect(this.x(position), this.y, noteWidth, noteHeight)
      .contains(mousePosition);
  }

  x(position) {
    return notePad + (position * (noteDistance + notePad));
  }

  name() {
    if (this.noteIndex === -1) return "";
    return `${ascendingChromaticScale[this.noteIndex]}${this.octave}`;
  }

  incrementHalf() {
    if (this.name() === 'C8')
      return;

    if (this.noteIndex + 1 === ascendingChromaticScale.length) this.octave++;
    this.noteIndex = ascendingChromaticScale.next(this.noteIndex);
    // redundant
    this.y -= lineHeight / 2;
  }

  decrementHalf() {
    if (this.octave === 1 && this.noteIndex === 0)
      return;

    if (this.noteIndex === 0) this.octave--;
    this.noteIndex = ascendingChromaticScale.prev(this.noteIndex);
    this.y += lineHeight / 2;
  }

  drawOn(context, position) {
    context.beginPath();
    context.lineWidth = noteStroke;
    context.ellipse(this.x(position), this.y, noteWidth, noteHeight, this.rotation, 0, 2 * Math.PI);
    context.fillStyle = this.isSelected ? 'red' : 'white';
    context.fill();
    context.stroke();
  }
}
