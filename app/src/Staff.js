import { lineHeight, sharpArea, sharpWidth, sharpsInWidth } from './Note';
import Rect from './Rect';

const staffWidth = 1200;
const highlightColor = 'red'; // move to ui constants source
const trebleStaffNotes = [ 'A6', 'G5', 'F5', 'E5', 'D5', 'C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4' ];
const trebleStaffLines = [ 'F5', 'D5', 'B4', 'G4', 'E4' ];
const trebleStaffInterlineIndices = [ 3, 5, 7, 9 ];

export const lineClickTolerance = 3;

export const verticalIndex = noteName => {
  return trebleStaffNotes.indexOf(noteName);
};

export class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  contains(number) {
    return number >= this.start && number <= this.end;
  }
}

export default class Staff {
  constructor(ctx, ui) {
    this.context = ctx;
    this.createAccidentalsRect();
    this.buildStaffNoteLineRanges();
    this.ui = ui;
  }

  createAccidentalsRect() {
    const right = sharpArea * sharpsInWidth;
    const top = 0;
    const left = 0;
    const bottom = this.noteY('C4');
    this.accidentalsRect = new Rect(left, top, right, bottom);
  }

  withinTolerance(note, point) {
    return Math.abs(point.y - this.noteY(note)) <= lineClickTolerance;
  }

  buildStaffNoteLineRanges() {
    this.ranges = {};
    trebleStaffLines.forEach(note => {
      const y = this.noteY(note);
      this.ranges[note] = new Range(y - lineClickTolerance, y + lineClickTolerance);
    });
    trebleStaffInterlineIndices.forEach(i => {
      const note = trebleStaffNotes[i];
      const higherNote = trebleStaffNotes[i - 1];
      const lowerNote = trebleStaffNotes[i + 1];
      this.ranges[note] = 
        new Range(this.ranges[higherNote].end + 1, this.ranges[lowerNote].start - 1);
    });
  }

  nearestNote(point) {
    const pair = Object.entries(this.ranges)
      .find(([note, range]) => range.contains(point.y));
    return pair ? pair[0] : undefined;
  }
  
  // TODO test
  isClickInAccidentals(point) {
    return this.accidentalsRect.contains(point);
  }

  y(noteName) {
    return (verticalIndex(noteName) * lineHeight / 2);
  }

  draw() {
    this.context.beginPath();

    const topLineY = this.y(trebleStaffLines[0]);
    for (let i = 0; i < trebleStaffLines.length; i++) {
      const currentY = this.y(trebleStaffLines[i]);
      this.drawLine(0, currentY, staffWidth, currentY);
    }
    this.staffHeight = trebleStaffLines.length * lineHeight;
    this.drawLine(staffWidth, topLineY, staffWidth, this.staffHeight);
    this.context.stroke();
    this.drawAccidentalsArea(this.context);
  }

  drawLine(xStart, yStart, xEnd, yEnd, weight=1, color='black') {
    this.context.strokeStyle = color;
    this.context.lineWidth = weight;
    this.context.moveTo(xStart, yStart);
    this.context.lineTo(xEnd, yEnd);
  }

  drawSharp(note, sharpCount) {
    const sharpHeight = 20;
    const staffWidthBetweenUpstrokes = sharpWidth / 4;

    this.context.beginPath();

    const y = this.noteY(note) + 4;
    const x = ((sharpCount - 1) % sharpsInWidth) * sharpArea + sharpWidth;

    let top = y - (sharpHeight / 2);
    let bottom = y + (sharpHeight / 2);
    let upstrokeLeft = x - (staffWidthBetweenUpstrokes / 2);
    let upstrokeRight = x + (staffWidthBetweenUpstrokes / 2);

    let verticalOffset = sharpHeight / 3;

    let weight = 2;
    this.drawLine(upstrokeLeft, top, upstrokeLeft, bottom, weight);
    this.drawLine(upstrokeRight, top - verticalOffset, upstrokeRight, bottom - verticalOffset, weight);

    this.context.stroke();

    this.context.beginPath();
    weight = 4;
    let left = x - (sharpWidth / 2);
    let right = x + (sharpWidth / 2);
    let upslashYstart = y - (sharpHeight / 4);
    let upslashYend = upslashYstart - verticalOffset;
    this.drawLine(left, upslashYstart, right, upslashYend, weight);

    upslashYstart = y + (sharpHeight / 4);
    upslashYend = upslashYstart - verticalOffset;
    this.drawLine(left, upslashYstart, right, upslashYend, weight);
    this.context.stroke();
  }

  drawAccidentalsArea() {
    console.log('this.ui', this.ui);
    if (this.ui.sharpsMode) {
      this.context.beginPath();
      const lineWidth = 6;
      this.accidentalsRect.drawOn(this.context, highlightColor, lineWidth);
      this.context.stroke();
    }
  }

  // dup from note
  noteY(noteName) {
    return (verticalIndex(noteName) * lineHeight / 2);
  }
}