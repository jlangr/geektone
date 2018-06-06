import { Staff, lineClickTolerance } from "./Staff";

describe('nearest note', () => {
  let staff;
  beforeEach(() => {
    staff = new Staff();
  });

  it('selects a staff-line note if dead-on', () => {
    const nearest = staff.nearestNote({ x: 1, y: staff.noteY('F5')});

    expect(nearest).toEqual('F5');
  });

  it('selects a staff-line note if within tolerance above', () => {
    const justAbove = staff.noteY('D5') - 1;

    const note = staff.nearestNote({ x: 1, y: justAbove });

    expect(note).toEqual('D5');
  });

  it('returns undefined if above staff', () => {
    const tooHigh = staff.noteY('F5') - lineClickTolerance - 1;

    const nearest = staff.nearestNote({ x: 1, y: tooHigh });

    expect(nearest).toBeUndefined();
  });

  it('returns undefined if below staff', () => {
    const tooLow = staff.noteY('E4') + lineClickTolerance + 1;

    const nearest = staff.nearestNote({ x: 1, y: tooLow });

    expect(nearest).toBeUndefined();
  });
  
  it('selects an off-line note in the middle', () => {
    const tooLow = staff.noteY('B4') + lineClickTolerance + 1;

    const nearest = staff.nearestNote({ x: 1, y: tooLow });

    expect(nearest).toEqual('A4');
  });

});

describe('mouse position', () => {
  it('returns canvas-adjusted x y coordinate', () => {
    const staff = new Staff();
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

    const position = staff.mousePosition(canvas, { clientX: 300, clientY: 80 });

    expect(position).toEqual({
      x: (300 - left) / boundingRectWidth * 2000,
      y: (80 - top) / boundingRectHeight * 1000});
  });
});