export const sixteenth = '16n'
export const eighth = '8n'
export const quarter = '4n'
export const half = '2n'
export const whole = '1n'

const sixteenths = {[sixteenth]: 1, [eighth]: 2, [quarter]: 4, [half]: 8, [whole]: 16}

export const toSixteenths = duration => {
  if (isTransportTime(duration)) {
    const parts = duration.split(':')
    const [bars, quarters, sixteenths] = parts.map(s => parseInt(s, 10))
    return (bars * 16) + (quarters * 4) + sixteenths
  }
  else {
    let result = sixteenths[noteBase(duration)]
    if (isDotted(duration))
      result += (result / 2)
    return result
  }
}

export const isTransportTime = duration => duration.includes(':')

export const toTransportTime = duration => {
  const sixteenths = time(duration)
  return transportTime(sixteenths)
}

export const transportTime = totalSixteenths => {
  const measures = Math.floor(totalSixteenths / 16)
  const measureSixteenths = totalSixteenths % 16
  const quarters = Math.floor(measureSixteenths / 4)
  const sixteenths = totalSixteenths % 4
  return `${measures}:${quarters}:${sixteenths}`
}

const dottedNotes = [3, 6, 12, 24]

const isNoteBase = (duration, noteBase, s1, s2) => {
  if (isTransportTime(duration)) {
    const sixteenths = toSixteenths(duration)
    return sixteenths === s1 || sixteenths === s2
  }
  else
    return duration.startsWith(noteBase)
}

export const isWholeBase = duration => isNoteBase(duration, whole, 16, 24)
export const isHalfBase = duration => isNoteBase(duration, half, 8, 12)
export const isQuarterBase = duration => isNoteBase(duration, quarter, 4, 6)
export const isEighthBase = duration => isNoteBase(duration, eighth, 2, 3)
export const isSixteenthBase = duration => isNoteBase(duration, sixteenth, 1)

export const isDotted = duration => {
  if (isTransportTime(duration)) {
    const sixteenths = toSixteenths(duration) 
    return dottedNotes.includes(sixteenths)
  }
  return duration.endsWith('.')
}

export const noteBase = noteDuration => {
  if (isDotted(noteDuration))
    return noteDuration.slice(0, -1)
  return noteDuration
}

export const halveDuration = duration => {
  if (isTransportTime(duration)) {
    const sixteenths = toSixteenths(duration)
    if (sixteenths === 1 || sixteenths % 2) return duration

    return transportTime(sixteenths / 2)
  }
  else {
    if (duration === sixteenth || isDotted(duration)) return duration

    return noteForSixteenths(time(duration) / 2)
  }
}

export const doubleDuration = duration => {
  if (isTransportTime(duration)) {
    const sixteenths = toSixteenths(duration)
    return transportTime(sixteenths * 2)
  }
  else {
    if (duration === whole || isDotted(duration)) return duration

    return noteForSixteenths(time(duration) * 2)
  }
}

// TODO delete
export const time = duration => {
  return toSixteenths(duration)
}

const dot = note => `${note}.`

export const noteForSixteenths = sixteenths => {
  switch (sixteenths) {
    case 1: return sixteenth
    case 2: return eighth
    case 3: return dot(eighth)
    case 4: return quarter
    case 6: return dot(quarter)
    case 8: return half
    case 12: return dot(half)
    case 16: return whole
    default: return quarter
  }
}

export const notesForSixteenths = sixteenths => {
  switch (sixteenths) {
    case 1: return [sixteenth]
    case 2: return [eighth]
    case 3: return [dot(eighth)]
    case 4: return [quarter]
    case 5: return [quarter, sixteenth]
    case 6: return [dot(quarter)]
    case 7: return [dot(quarter), sixteenth]
    case 8: return [half]
    case 9: return [half, sixteenth]
    case 10: return [half, eighth]
    case 11: return [half, dot(eighth)]
    case 12: return [dot(half)]
    case 13: return [dot(half), sixteenth]
    case 14: return [half, dot(quarter)]
    case 15: return [half, dot(quarter), sixteenth]
    case 16: return [whole]
    default: return [quarter]
  }
}