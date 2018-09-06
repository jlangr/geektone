import Bar from './Bar';
import Note from './Note';
import * as Duration from './Duration';

describe('a bar', () => {
  let bar;
  beforeEach(() => {
    bar = new Bar();
  });

  it('is empty when created', () => {
    expect(bar.isEmpty()).toBeTruthy();
    expect(bar.isFull()).toBeFalsy();
    expect(bar.sixteenths).toEqual(0);
  });

  it('is not empty after note pushed', () => {
    bar.push(new Note('E4'));

    expect(bar.isEmpty()).toBeFalsy();
  });

  it('is not full when less than 16 sixteenths', () => {
    bar.push(new Note('E4', Duration.half));

    expect(bar.isFull()).toBeFalsy();
  });

  it('updates sixteenths on push', () => {
    bar.push(new Note('E4', Duration.half));

    expect(bar.sixteenths).toEqual(8);
  });

  it('is full when contains 16 sixteenths', () => {
    bar.push(new Note('E4', Duration.whole));

    expect(bar.isFull()).toBeTruthy();
  });

  it('can not accommodate notes when full', () => {
    bar.push(new Note('E4', Duration.whole));

    expect(bar.canAccommodate(new Note('E4', Duration.sixteenth))).toBeFalsy();
  });

  it('can not accommodate note larger than remaining size', () => {
    bar.push(new Note('E4', Duration.half));

    expect(bar.canAccommodate(new Note('E4', Duration.whole))).toBeFalsy();
  });

  it('can accommodate note less than remaining size', () => {
    bar.push(new Note('E4', Duration.half));

    expect(bar.canAccommodate(new Note('E4', Duration.quarter))).toBeTruthy();
  });
});