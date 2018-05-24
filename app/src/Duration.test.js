import * as Duration from './Duration';
import Note from './Note';

describe('time', () => {
  it('converts notes into equivalent 16ths', () => {
    expect(Duration.time('16n')).toEqual(1);
    expect(Duration.time('8n')).toEqual(2);
    expect(Duration.time('4n')).toEqual(4);
    expect(Duration.time('2n')).toEqual(8);
    expect(Duration.time('1n')).toEqual(16);
  });

  it('converts dotted notes into equivalent 16ths', () => {
    expect(Duration.time('8n.')).toEqual(3);
    expect(Duration.time('4n.')).toEqual(6);
    expect(Duration.time('2n.')).toEqual(12);
  });
});

describe('is dotted', () => {
  expect(Duration.isDotted('4n')).toBeFalsy();
  expect(Duration.isDotted('4n.')).toBeTruthy();
});

describe('note bases', () => {
  it('returns truthy or falsiness of base inquiries', () => {
    expect(Duration.isEighthBase('8n')).toBeTruthy();
    expect(Duration.isHalfBase('8n')).toBeFalsy();
    expect(Duration.isQuarterBase('4n')).toBeTruthy();
    expect(Duration.isHalfBase('4n')).toBeFalsy();
    expect(Duration.isHalfBase('2n')).toBeTruthy();
    expect(Duration.isWholeBase('2n')).toBeFalsy();
    expect(Duration.isWholeBase('1n')).toBeTruthy();
    expect(Duration.isSixteenthBase('16n')).toBeTruthy();
  });

  it('can be extracted', () => {
    expect(Duration.noteBase('16n')).toEqual('16n');
  });
});

it ('halves durations', () => {
  expect(Duration.halveDuration('8n')).toEqual('16n');
});

it ('does not halve the smallest duration', () => {
  expect(Duration.halveDuration('16n')).toEqual('16n');
});

it ('doubles durations', () => {
  expect(Duration.doubleDuration('2n')).toEqual('1n');
});

it ('does not double the largest duration', () => {
  expect(Duration.doubleDuration('1n')).toEqual('1n');
});
