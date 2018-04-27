export default class Rect {
  constructor(centerX, centerY, xRadius, yRadius) {
    this.startX = centerX - xRadius;
    this.startY = centerY - yRadius;
    this.endX = centerX + xRadius;
    this.endY = centerY + yRadius;
  }

  contains(point) {
    return point.x >= this.startX && point.x <= this.endX &&
      point.y >= this.startY && point.y <= this.endY;
  }
}
