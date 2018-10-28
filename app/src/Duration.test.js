import * as Duration from './Duration'

describe('time', () => {
  it('converts notes into equivalent 16ths', () => {
    expect(Duration.toSixteenths('16n')).toEqual(1)
    expect(Duration.toSixteenths('8n')).toEqual(2)
    expect(Duration.toSixteenths('4n')).toEqual(4)
    expect(Duration.toSixteenths('2n')).toEqual(8)
    expect(Duration.toSixteenths('1n')).toEqual(16)
  })

  it('converts dotted notes into equivalent 16ths', () => {
    expect(Duration.toSixteenths('8n.')).toEqual(3)
    expect(Duration.toSixteenths('4n.')).toEqual(6)
    expect(Duration.toSixteenths('2n.')).toEqual(12)
  })
})

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

  describe('isTransportTime', () => {
    expect(Duration.isTransportTime('8n')).toBeFalsy()
    expect(Duration.isTransportTime('0:1:0')).toBeTruthy()
  })

  describe('convert duration to transport time', () => {
    expect(Duration.toTransportTime('4n')).toEqual('0:1:0')
    expect(Duration.toTransportTime('2n.')).toEqual('0:3:0')
    expect(Duration.toTransportTime('8n.')).toEqual('0:0:3')
  })
})

describe('is dotted', () => {
  expect(Duration.isDotted('4n')).toBeFalsy()
  expect(Duration.isDotted('4n.')).toBeTruthy()

  expect(Duration.isDotted('0:1:2')).toBeTruthy()
  expect(Duration.isDotted('0:1:0')).toBeFalsy()
})

describe('note bases', () => {
  it('returns truthy or falsiness of base inquiries', () => {
    expect(Duration.isEighthBase('8n')).toBeTruthy()
    expect(Duration.isEighthBase('8n.')).toBeTruthy()
    expect(Duration.isEighthBase('4n.')).toBeFalsy()

    expect(Duration.isEighthBase('0:0:2')).toBeTruthy()
    expect(Duration.isEighthBase('0:0:3')).toBeTruthy()
    expect(Duration.isEighthBase('0:1:0')).toBeFalsy()

    expect(Duration.isHalfBase('2n')).toBeTruthy()
    expect(Duration.isHalfBase('2n.')).toBeTruthy()
    expect(Duration.isHalfBase('4n')).toBeFalsy()

    expect(Duration.isHalfBase('0:2:0')).toBeTruthy()
    expect(Duration.isHalfBase('0:3:0')).toBeTruthy()
    expect(Duration.isHalfBase('0:0:2')).toBeFalsy()

    expect(Duration.isQuarterBase('4n')).toBeTruthy()
    expect(Duration.isQuarterBase('4n.')).toBeTruthy()
    expect(Duration.isQuarterBase('2n.')).toBeFalsy()

    expect(Duration.isQuarterBase('0:1:0')).toBeTruthy()
    expect(Duration.isQuarterBase('0:1:2')).toBeTruthy()
    expect(Duration.isQuarterBase('0:2:0')).toBeFalsy()

    expect(Duration.isWholeBase('1n')).toBeTruthy()
    expect(Duration.isWholeBase('1n.')).toBeTruthy()
    expect(Duration.isWholeBase('2n')).toBeFalsy()

    expect(Duration.isWholeBase('1:0:0')).toBeTruthy()
    expect(Duration.isWholeBase('1:2:0')).toBeTruthy()
    expect(Duration.isWholeBase('1:1:0')).toBeFalsy()

    expect(Duration.isSixteenthBase('16n')).toBeTruthy()
    expect(Duration.isSixteenthBase('16n.')).toBeTruthy()
    expect(Duration.isSixteenthBase('8n')).toBeFalsy()

    expect(Duration.isSixteenthBase('0:0:1')).toBeTruthy()
    expect(Duration.isSixteenthBase('0:1:0')).toBeFalsy()
  })

  it('can be extracted', () => {
    expect(Duration.noteBase('16n')).toEqual('16n')
  })
})

it ('halves durations', () => {
  expect(Duration.halveDuration('8n')).toEqual('16n')

  expect(Duration.halveDuration('0:0:2')).toEqual('0:0:1')
})

it ('does not halve the smallest duration', () => {
  expect(Duration.halveDuration('16n')).toEqual('16n')

  expect(Duration.halveDuration('0:0:1')).toEqual('0:0:1')
})

it ('does not halve dotted durations or odd sixteenths', () => {
  expect(Duration.halveDuration('4n.')).toEqual('4n.')

  expect(Duration.halveDuration('0:1:3')).toEqual('0:1:3')
})

it ('doubles durations', () => {
  expect(Duration.doubleDuration('2n')).toEqual('1n')

  expect(Duration.doubleDuration('0:0:2')).toEqual('0:1:0')
})

it ('does not double dotted durations', () => {
  expect(Duration.doubleDuration('4n.')).toEqual('4n.')
})

it ('does not double the largest duration for BPM durations', () => {
  expect(Duration.doubleDuration('1n')).toEqual('1n')
})

it ('doubles larger durations', () => {
  expect(Duration.doubleDuration('1:2:3')).toEqual('3:1:2')
})
