  // F ---
  // E
  // D ---
  // C
  // B ---
  // A
  // G ---
  // F
  // E ---
  // D
  // C (---)
import { height, lineHeight, sharpArea, sharpWidth, sharpsInWidth } from './Note';
import store from './store';

const width = 1200;
const highlightColor = 'red'; // move to ui constants source
const defaultColor = 'black'; // move to ui constants source
const defaultWeight = 1;

const trebleStaffNotes = [ 'A6', 'G5', 'F5', 'E5', 'D5', 'C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4' ];
const trebleStaffLines = [ 'F5', 'D5', 'B4', 'G4', 'E4' ];

export const verticalIndex = noteName => {
  return trebleStaffNotes.indexOf(noteName);
};

class Staff {
  constructor(ctx) {
    this.context = ctx;
  }

  y(noteName) {
    return (verticalIndex(noteName) * lineHeight / 2);
  }

  draw() {
    this.context.beginPath();

    const staffHeight = trebleStaffLines.length * lineHeight;

    const topLineY = this.y(trebleStaffLines[0]);
    for (let i = 0; i < trebleStaffLines.length; i++) {
      const currentY = this.y(trebleStaffLines[i]);
      this.drawLine(0, currentY, width, currentY);
    }
    this.drawLine(width, topLineY, width, staffHeight);
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
    const height = 20;
    const widthBetweenUpstrokes = sharpWidth / 4;

    this.context.beginPath();

    const y = this.noteY(note) + 4;
    const x = ((sharpCount - 1) % sharpsInWidth) * sharpArea + sharpWidth;

    let top = y - (height / 2);
    let bottom = y + (height / 2);
    let upstrokeLeft = x - (widthBetweenUpstrokes / 2);
    let upstrokeRight = x + (widthBetweenUpstrokes / 2);

    let verticalOffset = height / 3;

    let weight = 2;
    this.drawLine(upstrokeLeft, top, upstrokeLeft, bottom, weight);
    this.drawLine(upstrokeRight, top - verticalOffset, upstrokeRight, bottom - verticalOffset, weight);

    this.context.stroke();

    this.context.beginPath();
    weight = 4;
    let left = x - (sharpWidth / 2);
    let right = x + (sharpWidth / 2);
    let upslashYstart = y - (height / 4);
    let upslashYend = upslashYstart - verticalOffset;
    this.drawLine(left, upslashYstart, right, upslashYend, weight);

    upslashYstart = y + (height / 4);
    upslashYend = upslashYstart - verticalOffset;
    this.drawLine(left, upslashYstart, right, upslashYend, weight);
    this.context.stroke();
  }

  drawAccidentalsArea() {
    if (store.getState().ui.sharpsMode) {
      this.context.beginPath();
      this.context.strokeStyle = highlightColor;
      this.context.lineWidth = 6;
      const right = sharpArea * sharpsInWidth;
      const top = 0;
      const left = 0;
      const bottom = this.noteY('C4');
      this.context.rect(left, top, right, bottom);
      this.context.stroke();
    }
  }

  // dup from note
  noteY(noteName) {
    return (verticalIndex(noteName) * lineHeight / 2);
  }
}

export default Staff;