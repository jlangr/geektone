import './ArrayProtos';

describe('Array next', () => {
  const threeElementArray = [0, 0, 0];
    
  describe('next', () => {
    it('normally increments the index provided', () => {
      expect(threeElementArray.next(1)).toEqual(2);
    });

    it('returns 0 when at end', () => {
      expect(threeElementArray.next(2)).toEqual(0);
    });

    it('returns -1 if out of bounds', () => {
      expect(threeElementArray.next(-1)).toEqual(-1);
    });
  });

  describe('prev', () => {
    it('normally decrements the index provided', () => {
      expect(threeElementArray.prev(1)).toEqual(0);
    });

    it('returns end index when at 0', () => {
      expect(threeElementArray.prev(0)).toEqual(2);
    });

    it('returns -1 if out of bounds', () => {
      expect(threeElementArray.prev(-1)).toEqual(-1);
    });
  });
})
