import * as Duration from './Duration'

describe('transport time', () => {
  it('converts number of 16s into bars:quarters:sixteenths format', () => {
    expect(Duration.transportTime(1)).toEqual('0:0:1')
    expect(Duration.transportTime(2)).toEqual('0:0:2')
    expect(Duration.transportTime(4)).toEqual('0:1:0')
    expect(Duration.transportTime(5)).toEqual('0:1:1')
    expect(Duration.transportTime(15)).toEqual('0:3:3')
    expect(Duration.transportTime(16)).toEqual('1:0:0')
    expect(Duration.transportTime(17)).toEqual('1:0:1')
    expect(Duration.transportTime(30)).toEqual('1:3:2')
    expect(Duration.transportTime(33)).toEqual('2:0:1')
  })

  it('converts transport time to 16s', () => {
    expect(Duration.toSixteenths('0:0:1')).toEqual(1)
    expect(Duration.toSixteenths('0:0:2')).toEqual(2)
    expect(Duration.toSixteenths('0:1:0')).toEqual(4)
    expect(Duration.toSixteenths('0:1:1')).toEqual(5)
    expect(Duration.toSixteenths('0:3:3')).toEqual(15)
    expect(Duration.toSixteenths('1:0:0')).toEqual(16)
    expect(Duration.toSixteenths('1:0:1')).toEqual(17)
    expect(Duration.toSixteenths('1:3:2')).toEqual(30)
    expect(Duration.toSixteenths('2:0:1')).toEqual(33)
  })
})

describe('is dotted', () => {
  expect(Duration.isDotted('0:1:2')).toBeTruthy()
  expect(Duration.isDotted('0:1:0')).toBeFalsy()
})

describe('note bases', () => {
  it('returns truthy or falsiness of base inquiries', () => {
    expect(Duration.isEighthBase('0:0:2')).toBeTruthy()
    expect(Duration.isEighthBase('0:0:3')).toBeTruthy()
    expect(Duration.isEighthBase('0:1:0')).toBeFalsy()

    expect(Duration.isHalfBase('0:2:0')).toBeTruthy()
    expect(Duration.isHalfBase('0:3:0')).toBeTruthy()
    expect(Duration.isHalfBase('0:0:2')).toBeFalsy()

    expect(Duration.isQuarterBase('0:1:0')).toBeTruthy()
    expect(Duration.isQuarterBase('0:1:2')).toBeTruthy()
    expect(Duration.isQuarterBase('0:2:0')).toBeFalsy()

    expect(Duration.isWholeBase('1:0:0')).toBeTruthy()
    expect(Duration.isWholeBase('1:2:0')).toBeTruthy()
    expect(Duration.isWholeBase('1:1:0')).toBeFalsy()

    expect(Duration.isSixteenthBase('0:0:1')).toBeTruthy()
    expect(Duration.isSixteenthBase('0:1:0')).toBeFalsy()
  })

  it('can be extracted', () => {
    expect(Duration.noteBase(Duration.sixteenth)).toEqual(Duration.sixteenth)
    expect(Duration.noteBase('0:0:3')).toEqual(Duration.eighth)
  })
})

describe('increment / decrement duration by 16ths', () => {
  it('increases 16ths on increment', () => {
    expect(Duration.incrementDuration('0:0:2')).toEqual('0:0:3')
  })

  it('decreases 16ths on decrement', () => {
    expect(Duration.decrementDuration('0:0:2')).toEqual('0:0:1')
  })

  it('does not decrease 16s when at 1', () => {
    expect(Duration.decrementDuration('0:0:1')).toEqual('0:0:1')
  })
})

it ('halves durations', () => {
  expect(Duration.halveDuration('0:0:2')).toEqual('0:0:1')
})

it ('does not halve the smallest duration', () => {
  expect(Duration.halveDuration('0:0:1')).toEqual('0:0:1')
})

it ('rounds down halved odd sixteenths', () => {
  expect(Duration.halveDuration('0:1:3')).toEqual('0:0:3')
})

it ('doubles durations', () => {
  expect(Duration.doubleDuration(Duration.half)).toEqual(Duration.whole)
})

it ('doubles dotted durations', () => {
  expect(Duration.doubleDuration('0:1:2')).toEqual('0:3:0')
})

it ('does not double the largest duration for BPM durations', () => {
  expect(Duration.doubleDuration(Duration.whole)).toEqual('2:0:0')
})

it ('doubles larger durations', () => {
  expect(Duration.doubleDuration('1:2:3')).toEqual('3:1:2')
})

describe('requires tie', () => {
  it('requires tie when over one measure', () => {
    expect(Duration.requiresTie('1:0:2')).toBeTruthy()
  })

  it('requires tie when requires two notes to render', () => {
    expect(Duration.requiresTie('0:4:3')).toBeTruthy()
  })

  it('requires no tie when requires one note to render', () => {
    expect(Duration.requiresTie('0:1:2')).toBeFalsy()
  })
})