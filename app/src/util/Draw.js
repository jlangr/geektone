export const drawLine = (context, xStart, yStart, xEnd, yEnd, weight=1, color='black') => {
  context.strokeStyle = color;
  context.lineWidth = weight;
  context.moveTo(xStart, yStart);
  context.lineTo(xEnd, yEnd);
}
