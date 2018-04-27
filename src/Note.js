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

// NoteSequence class?

export default class Note {
  // nope position is relative to other notes
  // also maybe pass context to ctor
  constructor(name, position) {
    this.octave = parseInt(name.slice(-1));
    let note = name.slice(0, -1);
    this.noteIndex = ascendingChromaticScale.indexOf(note);

    this.x = notePad + (position * (noteDistance + notePad));
    this.y = verticalIndex(this.name()) * lineHeight / 2;

    this.rotation = 0;
    this.isSelected = false;
    this.rect = new Rect(this.x, this.y, noteWidth, noteHeight);
  }

  click(context, mousePosition) {
    if (!this.isHit(mousePosition)) return;

    this.isSelected = !this.isSelected;
    this.drawOn(context);
  }

  select() {
    this.isSelected = true;
  }

  deselect() {
    this.isSelected = false;
  }

  isHit(mousePosition) {
    return this.rect.contains(mousePosition);
  }

  name() {
    return `${ascendingChromaticScale[this.noteIndex]}${this.octave}`;
  }

  incrementHalf() {
    if (this.name() === 'C8')
      return;

    this.noteIndex++;
    if (this.noteIndex === ascendingChromaticScale.length) {
      this.noteIndex = 0;
      this.octave++;
    }
    this.y -= lineHeight / 2;
  }

  decrementHalf() {
    if (this.octave === 1 && this.noteIndex === 0)
      return;

    this.noteIndex--;
    if (this.noteIndex < 0) {
      this.noteIndex = ascendingChromaticScale.length - 1;
      this.octave--;
    }
    this.y += lineHeight / 2;
  }

  drawOn(context) {
    context.beginPath();
    this.drawNote(context);
    context.fillStyle = this.isSelected ? 'red' : 'white';
    context.fill();
    context.stroke();

//    this.isSelected ? this.highlightOn(context) : this.drawOn(context);
  }

  drawNote(context) {
    context.lineWidth = noteStroke;
    context.ellipse(this.x, this.y, noteWidth, noteHeight, this.rotation, 0, 2 * Math.PI);
  }

  highlightOn(context) {
    context.beginPath();
    this.drawNote(context);
    context.fillStyle = 'red';
    context.fill();
    context.stroke();
  }
}
