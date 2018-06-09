import * as UI from './UI';

describe('mouse position', () => {
  it('returns canvas-adjusted x y coordinate', () => {
    const left = 100;
    const top = 20;
    const boundingRectWidth = 1000;
    const boundingRectHeight = 200;
    const boundingRect = {
      left: left,
      top: top,
      right: left + boundingRectWidth,
      bottom: top + boundingRectHeight
    };
    const canvas = {
      getBoundingClientRect: () => boundingRect,
      width: 2000,
      height: 1000
    };

    const position = UI.mousePosition(canvas, { clientX: 300, clientY: 80 });

    expect(position).toEqual({
      x: (300 - left) / boundingRectWidth * 2000,
      y: (80 - top) / boundingRectHeight * 1000});
  });
});