export const transportTime = totalSixteenths => {
  const measures = Math.floor(totalSixteenths / 16);
  const measureSixteenths = totalSixteenths % 16;
  const quarters = Math.floor(measureSixteenths / 4);
  const sixteenths = totalSixteenths % 4;
  return `${measures}:${quarters}:${sixteenths}`;
};