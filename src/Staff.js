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
import Note, { height, lineHeight, sharpsArea, sharpArea, sharpWidth, sharpsInWidth } from './Note';

const width = 1200;

const drawLine = (context, xStart, yStart, xEnd, yEnd, weight=1, color='black') => {
  context.strokeStyle = color;
  context.lineWidth = weight;
  context.moveTo(xStart, yStart);
  context.lineTo(xEnd, yEnd);
};

export const drawSharp = (context, note, sharpCount) => {
  const height = 24;
  const widthBetweenUpstrokes = sharpWidth / 4;

  context.beginPath();

  const y = noteY(note) + 4;
  const x = ((sharpCount - 1) % sharpsInWidth) * sharpArea + sharpWidth;

  let top = y - (height / 2);
  let bottom = y + (height / 2);
  let upstrokeLeft = x - (widthBetweenUpstrokes / 2);
  let upstrokeRight = x + (widthBetweenUpstrokes / 2);

  let verticalOffset = height / 3;

  let weight = 2;
  drawLine(context, upstrokeLeft, top, upstrokeLeft, bottom, weight);
  drawLine(context, upstrokeRight, top - verticalOffset, upstrokeRight, bottom - verticalOffset, weight);

  context.stroke();

  context.beginPath();
  weight = 4;
  let left = x - (sharpWidth / 2);
  let right = x + (sharpWidth / 2);
  let upslashYstart = y - (height / 4);
  let upslashYend = upslashYstart - verticalOffset;
  drawLine(context, left, upslashYstart, right, upslashYend, weight);

  upslashYstart = y + (height / 4);
  upslashYend = upslashYstart - verticalOffset;
  drawLine(context, left, upslashYstart, right, upslashYend, weight);
  context.stroke();
};

// dup from note
const noteY = noteName => {
  return verticalIndex(noteName) * lineHeight / 2;
};

export const verticalIndex = noteName => {
  switch(noteName) {
    case "F5": return 0;
    case "E5": return 1;
    case "D5": return 2;
    case "C5": return 3;
    case "B4": return 4;
    case "A4": return 5;
    case "G4": return 6;
    case "F4": return 7;
    case "E4": return 8;
    case "D4": return 9;
    case "C4": return 10;
    default: break;
  };
  return -1;
};

export const drawStaff = context => {
  context.beginPath();
  const beginningStaffWidth = 7;
  drawLine(context, 0, 0, 0, height, beginningStaffWidth);
  for (let i = 0, currentY = 0; i < 5; i++) {
    drawLine(context, 0, currentY, width, currentY);
    currentY += lineHeight;
  }
  drawLine(context, width, 0, width, height);
  context.stroke();
};
