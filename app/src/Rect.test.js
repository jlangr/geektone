import Rect from './Rect';

describe('contains', () => {
  it('contains a point when inside bounding box', () => {
    const halfWidth = 5;
    const halfHeight = 3;
    const rect = new Rect(0, 0, halfWidth, halfHeight);

    expect(rect.contains({x: 0, y: 0})).toBeTruthy();
  });

  it('contains a point when on edge of bounding box', () => {
    const halfWidth = 5;
    const halfHeight = 3;
    const rect = new Rect(0, 0, halfWidth, halfHeight);

    expect(rect.contains({x: halfWidth, y: halfHeight})).toBeTruthy();
  });

  it('does not contain a point when outside bounding box', () => {
    const halfWidth = 5;
    const halfHeight = 3;
    const rect = new Rect(0, 0, halfWidth, halfHeight);

    expect(rect.contains({x: halfWidth + 1, y: halfHeight + 1})).toBeFalsy();
  });
});
