import RectAroundCenter from './Rect';
import { verticalIndex } from './Staff';
import * as Duration from './Duration';
import { next, prev } from './js/ArrayUtil';

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

export default class Note {
  constructor(name, duration = Duration.quarter) {
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

  toJSON() {
    return { name: this.name(), duration: this.duration };
  }

  toggleDot() {
    if (Duration.isWholeBase(this.duration) || Duration.isSixteenthBase(this.duration))
      return;

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
    this.noteIndex = next(ascendingWholeNoteScale, this.noteIndex);
  }

  isLowestNote() {
    return this.octave === 1 && this.noteIndex === 0;
  }

  decrement() {
    if (this.isLowestNote()) return;

    if (this.noteIndex === 0) this.octave--;
    this.noteIndex = prev(ascendingWholeNoteScale, this.noteIndex);
  }

  // TODO externalize below ... to Staff?

  isHit(mousePosition, position) {
    return RectAroundCenter(this.x(position), this.y(), noteWidth, noteHeight)
      .contains(mousePosition);
    // return new Rect(this.x(position), this.y(), noteWidth, noteHeight)
  }

  x(position) {
    return sharpsArea + notePad + (position * (noteDistance + notePad));
  }

  // dup with noteY from staff
  y() {
    return (verticalIndex(this.name()) * lineHeight / 2);
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

  drawFlag(context, position) {
    context.moveTo(this.x(position) + noteWidth, this.y() - stemHeight);
    context.lineTo(this.x(position) + noteWidth + 6,
      this.y() - stemHeight + (stemHeight / 2));
  }

  drawLowerFlag(context, position) {
    const y = this.y() - stemHeight;
    const yIncrease = 12;
    context.moveTo(this.x(position) + noteWidth, y + yIncrease);
    context.lineTo(this.x(position) + noteWidth + 6,
      y + (stemHeight / 2) + yIncrease);
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

  drawEighth(context, position) {
    this.drawFilledEllipse(context, position, quarterFill);
    this.drawStem(context, position);
    this.drawFlag(context, position);
  }

  drawSixteenth(context, position) {
    this.drawFilledEllipse(context, position, quarterFill);
    this.drawStem(context, position);
    this.drawFlag(context, position);
    this.drawLowerFlag(context, position);
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

  drawNoteOn(context, position) {
    context.beginPath()
    context.lineWidth = noteStroke;
    context.strokeStyle = lineColor;
    // TODO inject function into note instead
    if (Duration.isWholeBase(this.duration)) this.drawWhole(context, position);
    else if (Duration.isHalfBase(this.duration)) this.drawHalf(context, position);
    else if (Duration.isQuarterBase(this.duration)) this.drawQuarter(context, position);
    else if (Duration.isEighthBase(this.duration)) this.drawEighth(context, position);
    else if (Duration.isSixteenthBase(this.duration)) this.drawSixteenth(context, position);

    if (Duration.isDotted(this.duration))
      this.drawDot(context, position);
    context.stroke();
  }

  drawOn(context, position) {
    this.drawNoteOn(context, position);
    if (this.isSelected)
      this.highlightNote(context, position);
  }
}
