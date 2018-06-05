import Rect from './Rect';

describe('contains', () => {
  const width = 5;
  const height = 3;

  it('contains a point when inside bounding box', () => {
    const rect = new Rect(0, 0, width, height);

    expect(rect.contains({x: 1, y: 1})).toBeTruthy();
  });

  it('contains a point when on edge of bounding box', () => {
    const rect = new Rect(0, 0, width, height);

    expect(rect.contains({x: width, y: height})).toBeTruthy();
  });

  it('does not contain a point when outside bounding box', () => {
    const rect = new Rect(0, 0, width, height);

    expect(rect.contains({x: width + 1, y: height + 1})).toBeFalsy();
  });
});
