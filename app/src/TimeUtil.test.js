import { toSixteenths, transportTime, time, halveDuration, doubleDuration } from './TimeUtil'

describe('time', () => {
  it('converts number of 16s into bars:quarters:sixteenths format', () => {
    expect(transportTime(1)).toEqual('0:0:1')
    expect(transportTime(2)).toEqual('0:0:2')
    expect(transportTime(4)).toEqual('0:1:0')
    expect(transportTime(5)).toEqual('0:1:1')
    expect(transportTime(15)).toEqual('0:3:3')
    expect(transportTime(16)).toEqual('1:0:0')
    expect(transportTime(17)).toEqual('1:0:1')
    expect(transportTime(30)).toEqual('1:3:2')
    expect(transportTime(33)).toEqual('2:0:1')
  })

  it('converts transport time to 16s', () => {
    expect(toSixteenths('0:0:1')).toEqual(1)
    expect(toSixteenths('0:0:2')).toEqual(2)
    expect(toSixteenths('0:1:0')).toEqual(4)
    expect(toSixteenths('0:1:1')).toEqual(5)
    expect(toSixteenths('0:3:3')).toEqual(15)
    expect(toSixteenths('1:0:0')).toEqual(16)
    expect(toSixteenths('1:0:1')).toEqual(17)
    expect(toSixteenths('1:3:2')).toEqual(30)
    expect(toSixteenths('2:0:1')).toEqual(33)
  })
})
