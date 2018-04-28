export default class Rect {
  constructor(centerX, centerY, width, height) {
    this.startX = centerX - width;
    this.startY = centerY - height;
    this.endX = centerX + width;
    this.endY = centerY + height;
  }

  contains(point) {
    return point.x >= this.startX && point.x <= this.endX &&
      point.y >= this.startY && point.y <= this.endY;
  }
}
