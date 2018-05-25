import { transportTime, time, halveDuration, doubleDuration } from './TimeUtil';

describe('time', () => {
  it('converts number of 16s into bars:quarters:sixteenths format', () => {
    expect(transportTime(1)).toEqual('0:0:1');
    expect(transportTime(2)).toEqual('0:0:2');
    expect(transportTime(4)).toEqual('0:1:0');
    expect(transportTime(5)).toEqual('0:1:1');
    expect(transportTime(15)).toEqual('0:3:3');
    expect(transportTime(16)).toEqual('1:0:0');
    expect(transportTime(17)).toEqual('1:0:1');
    expect(transportTime(30)).toEqual('1:3:2');
    expect(transportTime(33)).toEqual('2:0:1');
  });

});
