export const sixteenth = '0:0:1'
export const eighth = '0:0:2'
export const dottedEighth = '0:0:3'
export const quarter = '0:1:0'
export const dottedQuarter = '0:1:2'
export const half = '0:2:0'
export const dottedHalf = '0:3:0'
export const whole = '1:0:0'
export const dottedWhole = '1:2:0'

export const sixteenthBase = '0:0:1'
export const eighthBase = '0:0:2'
export const quarterBase = '0:1:0'
export const halfBase = '0:2:0'
export const wholeBase = '1:0:0'

export const toSixteenths = duration => {
  const parts = duration.split(':')
  const [bars, quarters, sixteenths] = parts.map(s => parseInt(s, 10))
  return (bars * 16) + (quarters * 4) + sixteenths
}

export const transportTime = totalSixteenths => {
  const measures = Math.floor(totalSixteenths / 16)
  const measureSixteenths = totalSixteenths % 16
  const quarters = Math.floor(measureSixteenths / 4)
  const sixteenths = totalSixteenths % 4
  return `${measures}:${quarters}:${sixteenths}`
}

// 2 -> 3
// 4 -> 6
// 8 -> 12
// 16 -> 24

const isNoteBase = (duration, s1, s2) => {
  const sixteenths = toSixteenths(duration)
  return sixteenths === s1 || sixteenths === s2
}

export const isWholeBase = duration => isNoteBase(duration, 16, 24)
export const isHalfBase = duration => isNoteBase(duration, 8, 12)
export const isQuarterBase = duration => isNoteBase(duration, 4, 6)
export const isEighthBase = duration => isNoteBase(duration, 2, 3)
export const isSixteenthBase = duration => isNoteBase(duration, 1)

const dottedNotes = [3, 6, 12, 24]

export const isDotted = duration => {
  const sixteenths = toSixteenths(duration) 
  return dottedNotes.includes(sixteenths)
}

export const noteBase = noteDuration => {
  if (isDotted(noteDuration))
    return transportTime(toSixteenths(noteDuration) * 2 / 3)
  return noteDuration
}

export const halveDuration = duration => {
  const sixteenths = toSixteenths(duration)
  if (sixteenths === 1 || sixteenths % 2) return duration

  return transportTime(sixteenths / 2)
}

export const doubleDuration = duration => {
  const sixteenths = toSixteenths(duration)
  return transportTime(sixteenths * 2)
}

export const noteForSixteenths = sixteenths => {
  switch (sixteenths) {
    case 1: return sixteenth
    case 2: return eighth
    case 3: return dottedEighth
    case 4: return quarter
    case 6: return dottedQuarter
    case 8: return half
    case 12: return dottedHalf
    case 16: return whole
    default: return quarter
  }
}

export const notesForSixteenths = sixteenths => {
  switch (sixteenths) {
    case 1: return [sixteenth]
    case 2: return [eighth]
    case 3: return [dottedEighth]
    case 4: return [quarter]
    case 5: return [quarter, sixteenth]
    case 6: return [dottedQuarter]
    case 7: return [dottedQuarter, sixteenth]
    case 8: return [half]
    case 9: return [half, sixteenth]
    case 10: return [half, eighth]
    case 11: return [half, dottedEighth]
    case 12: return [dottedHalf]
    case 13: return [dottedHalf, sixteenth]
    case 14: return [half, dottedQuarter]
    case 15: return [half, dottedQuarter, sixteenth]
    case 16: return [whole]
    default: return [quarter]
  }
}