import { trebleStaffLines, allStaffNotes } from '../Constants'
export const height = 64
export const lineHeight = height / 4

const notePad = 25
const noteDistance = 8
export const defaultLineWeight = 1

export const bassClefSymbol = '\uD834\uDD22'
export const trebleClefSymbol = '\uD834\uDD1E'
export const sharpSymbol = '\u266F'
export const flatSymbol = '\u266D'
export const naturalSymbol = '\u266E'

export const sharpsInWidth = 3
export const sharpHeight = 20
export const sharpWidth = 20
export const sharpArea = sharpWidth + 4
const sharpPad = 8
export const sharpsArea = (sharpsInWidth * sharpArea) + sharpPad

const clefSignWidth = 40
export const accidentalsLeft = clefSignWidth + 1

const countOfNotesOnStaff = 13

export const staffHeight = (countOfNotesOnStaff + 1) * lineHeight / 2
export const staffWidthBetweenUpstrokes = sharpWidth / 4

export const drawLine = (context, xStart, yStart, xEnd, yEnd, weight=defaultLineWeight, color='black') => {
  context.beginPath()
  context.strokeStyle = color
  context.lineWidth = weight
  context.moveTo(xStart, yStart)
  context.lineTo(xEnd, yEnd)
  context.stroke()
}

export const drawText = (context, text, x, y, px) => {
  context.beginPath()
  context.fillStyle = 'black'
  context.font = `${px}px Arial`
  context.fillText(text, x, y)
  context.stroke()
}

export const xLeftOffset = accidentalsLeft + sharpsArea + notePad

export const xPositionSpan = noteDistance + notePad

export const verticalIndex = noteName => allStaffNotes.indexOf(noteName)

export const y = noteName => verticalIndex(noteName) * lineHeight / 2

export const x = position => xLeftOffset + (position * xPositionSpan)

export const position = x => Math.floor((x - xLeftOffset) / xPositionSpan)

export const topLineY = () => y(trebleStaffLines[0])