import { transportTime, time, noteObjects, halveDuration, doubleDuration } from './TimeUtil';
import Note from './Note';

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

  it('creates note objects with time transpoprts', () => {
    let notes = [ new Note('C4', '8n'), new Note('D4', '4n')];

    expect(noteObjects(notes)).toEqual([
      { name: 'C4', duration: '8n', time: '0:0:0'},
      { name: 'D4', duration: '4n', time: '0:0:2'}
    ]);
  });
});
