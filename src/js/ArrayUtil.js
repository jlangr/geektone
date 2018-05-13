export const next = (array, i) => {
  if (i < 0 || i >= array.length) return -1;
  return i === array.length - 1? 0 : i + 1;
};

export const prev = (array, i) => {
  if (i < 0 || i >= array.length) return -1;
  return i === 0 ? array.length - 1 : i - 1;
};
