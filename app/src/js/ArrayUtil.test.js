import { next, prev, remove } from './ArrayUtil';

describe('Array next', () => {
  const threeElementArray = [0, 0, 0];

  describe('remove', () => {
    it('removes item found', () => {
      const arr = [1, 2, 3];

      remove(arr, 2);
      
      expect(arr).toEqual([1, 3]);
    });
  });

  describe('next in array', () => {
    it('normally increments the index provided', () => {
      expect(next(threeElementArray, 1)).toEqual(2);
    });

    it('returns 0 when at end', () => {
      expect(next(threeElementArray, 2)).toEqual(0);
    });

    it('returns -1 if out of bounds', () => {
      expect(next(threeElementArray, -1)).toEqual(-1);
    });
  });

  describe('prev in array', () => {
    it('normally decrements the index provided', () => {
      expect(prev(threeElementArray, 1)).toEqual(0);
    });

    it('returns end index when at 0', () => {
      expect(prev(threeElementArray, 0)).toEqual(2);
    });

    it('returns -1 if out of bounds', () => {
      expect(prev(threeElementArray, -1)).toEqual(-1);
    });
  });
});
