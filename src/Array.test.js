import './ArrayProtos';

describe('Array next', () => {
  describe('next', () => {
    it('normally increments the index provided', () => {
      const threeElementArray = [0, 0, 0];
      expect(threeElementArray.next(1)).toEqual(2);
    });

    it('returns 0 when at end', () => {
      const threeElementArray = [0, 0, 0];
      expect(threeElementArray.next(2)).toEqual(0);
    });
  });

  describe('prev', () => {
    it('normally decrements the index provided', () => {
      const threeElementArray = [0, 0, 0];
      expect(threeElementArray.prev(1)).toEqual(0);
    });

    it('returns end when at 0', () => {
      const threeElementArray = [0, 0, 0];
      expect(threeElementArray.prev(0)).toEqual(3);
    });
  });
})
