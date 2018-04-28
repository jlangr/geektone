import Rect from './Rect';

describe('contains', () => {
  it('contains a point when inside bounding box', () => {
    const width = 5;
    const height = 3;
    const rect = new Rect(0, 0, width, height);

    expect(rect.contains({x: 0, y: 0})).toBeTruthy();

  });
});
