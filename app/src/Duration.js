export const sixteenth = '16n'
export const eighth = '8n'
export const quarter = '4n'
export const half = '2n'
export const whole = '1n'

const sixteenths = {[sixteenth]: 1, [eighth]: 2, [quarter]: 4, [half]: 8, [whole]: 16}

export const isWholeBase = duration => duration.startsWith(whole)
export const isHalfBase = duration => duration.startsWith(half)
export const isQuarterBase = duration => duration.startsWith(quarter)
export const isEighthBase = duration => duration.startsWith(eighth)
export const isSixteenthBase = duration => duration.startsWith(sixteenth)

export const isDotted = noteDuration => noteDuration.endsWith('.')

export const noteBase = noteDuration => {
  if (isDotted(noteDuration))
    return noteDuration.slice(0, -1)
  return noteDuration
}

export const halveDuration = duration => {
  if (duration === sixteenth) return duration
  return noteForSixteenths(time(duration) / 2)
}

export const doubleDuration = duration => {
  if (duration === whole) return duration
  return noteForSixteenths(time(duration) * 2)
}

export const time = noteDuration => {
  let result = sixteenths[noteBase(noteDuration)]
  if (isDotted(noteDuration))
    result += (result / 2)
  return result
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