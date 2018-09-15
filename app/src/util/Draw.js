//import { lineHeight, sharpsArea, notePad, noteDistance } from '../Note';

// DUPS:

export const height = 64
export const lineHeight = height / 4

export const sharpsInWidth = 3
const sharpPad = 8
export const sharpWidth = 20
export const sharpArea = sharpWidth + 4
export const sharpsArea = (sharpsInWidth * sharpArea) + sharpPad

export const notePad = 25
export const noteDistance = 8


console.log('sharpsArea', sharpsArea)
// TODO: move such constants somewhere central

export const trebleStaffLines = [ 'F5', 'D5', 'B4', 'G4', 'E4' ];
const trebleStaffNotes = [ 'A6', 'G5', 'F5', 'E5', 'D5', 'C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4' ];

export const drawLine = (context, xStart, yStart, xEnd, yEnd, weight=1, color='black') => {
  context.strokeStyle = color
  context.lineWidth = weight
  context.moveTo(xStart, yStart)
  context.lineTo(xEnd, yEnd)
}

export const verticalIndex = 
  noteName => trebleStaffNotes.indexOf(noteName)

export const staffHeight = trebleStaffLines.length * lineHeight

console.log('lineHeight', lineHeight)

export const y = noteName =>
  verticalIndex(noteName) * lineHeight / 2

export const x = position => 
  sharpsArea + notePad + (position * (noteDistance + notePad))

export const topLineY = () => y(trebleStaffLines[0])