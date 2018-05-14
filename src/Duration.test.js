import { noteBase, isWholeBase, isHalfBase, isQuarterBase, isEighthBase, isSixteenthBase } from './Duration';
import Note from './Note';

describe('note bases', () => {
  it('returns truthy or falsiness of base inquiries', () => {
    expect(isEighthBase('8n')).toBeTruthy();
    expect(isHalfBase('8n')).toBeFalsy();
    expect(isQuarterBase('4n')).toBeTruthy();
    expect(isHalfBase('4n')).toBeFalsy();
    expect(isHalfBase('2n')).toBeTruthy();
    expect(isWholeBase('2n')).toBeFalsy();
    expect(isWholeBase('1n')).toBeTruthy();
    expect(isSixteenthBase('16n')).toBeTruthy();
  });

  it('can be extracted', () => {
    expect(noteBase('16n')).toEqual('16n');
  });
});
