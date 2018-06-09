import { Staff, lineClickTolerance, MiddleC } from "./Staff";
import { sharpArea, sharpsInWidth } from './Note';
import Rect from "./Rect";

describe('staff', () => {
  let staff;

  beforeEach(() => {
    staff = new Staff();
  });

  describe('staff', () => {
    it('creates an accidentals section on creation', () => {
      expect(staff.accidentalsRect).toEqual(new Rect(0, 0, sharpArea * sharpsInWidth, staff.noteY(MiddleC)));
    });
  });

  describe('sharps mode', () => {
    it('is on when track data has it on', () => {

    });
  });

  describe('nearest note', () => {
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
})