export const height = 64
export const lineHeight = height / 4

const notePad = 25
const noteDistance = 8
export const defaultLineWeight = 1

export const sharpsInWidth = 3
export const sharpHeight = 20
export const sharpWidth = 20
export const sharpArea = sharpWidth + 4
const sharpPad = 8
export const sharpsArea = (sharpsInWidth * sharpArea) + sharpPad

const clefSignWidth = 40
export const accidentalsLeft = clefSignWidth + 1

export const trebleStaffLines = [ 'F5', 'D5', 'B4', 'G4', 'E4' ]
export const bassStaffLines = [ 'A3', 'F3', 'D3', 'B2', 'G2' ]

const countOfNotesOnStaff = 13

export const allStaffNotes = [
  'A5', 'G5', 'F5', 'E5', 'D5', 'C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4', // treble staff notes
  'B3', 'A3', 'G3', 'F3', 'E3', 'D3', 'C3', 'B2', 'A2', 'G2', 'F2', 'E2' // bass staff notes
]

export const staffHeight = (countOfNotesOnStaff + 1) * lineHeight / 2
export const staffWidthBetweenUpstrokes = sharpWidth / 4

export const drawLine = (context, xStart, yStart, xEnd, yEnd, weight=defaultLineWeight, color='black') => {
  context.strokeStyle = color
  context.lineWidth = weight
  context.moveTo(xStart, yStart)
  context.lineTo(xEnd, yEnd)
}

export const verticalIndex = noteName => allStaffNotes.indexOf(noteName)

export const y = noteName => verticalIndex(noteName) * lineHeight / 2

export const x = position => accidentalsLeft + sharpsArea + notePad + (position * (noteDistance + notePad))

export const topLineY = () => y(trebleStaffLines[0])