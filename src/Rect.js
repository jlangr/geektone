export default class Rect {
  constructor(centerX, centerY, halfWidth, halfHeight) {
    this.startX = centerX - halfWidth;
    this.startY = centerY - halfHeight;
    this.endX = centerX + halfWidth;
    this.endY = centerY + halfHeight;
  }

  contains(point) {
    return point.x >= this.startX && point.x <= this.endX &&
      point.y >= this.startY && point.y <= this.endY;
  }
}
