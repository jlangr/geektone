import { whole, half, quarter, eighth, sixteenth } from './TimeUtil';

export const isWholeBase = duration => duration.startsWith(whole);
export const isHalfBase = duration => duration.startsWith(half);
export const isQuarterBase = duration => duration.startsWith(quarter);
export const isEighthBase = duration => duration.startsWith(eighth);
export const isSixteenthBase = duration => duration.startsWith(sixteenth);

export const isDotted = (noteDuration) => noteDuration.endsWith('.');

export const noteBase = noteDuration => {
  if (isDotted(noteDuration))
    return noteDuration.slice(0, -1);
  return noteDuration;
};
