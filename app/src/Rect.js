export const RectAroundCenter = (centerX, centerY, halfWidth, halfHeight) => 
  new Rect(
    centerX - halfWidth, centerY - halfHeight, 
    centerX + halfWidth, centerY + halfHeight);

export default class Rect {
  constructor(startX, startY, endX, endY) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
  }

  drawOn(context, color='black', weight=1) {
    context.strokeStyle = color;
    context.lineWidth = weight;
    context.rect(this.startX, this.startY, this.endX, this.endY);
  }

  contains(point) {
    return point.x >= this.startX && point.x <= this.endX &&
      point.y >= this.startY && point.y <= this.endY;
  }
}
