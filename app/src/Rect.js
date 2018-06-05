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
  // constructor(centerX, centerY, halfWidth, halfHeight) {
  //   this.startX = centerX - halfWidth;
  //   this.startY = centerY - halfHeight;
  //   this.endX = centerX + halfWidth;
  //   this.endY = centerY + halfHeight;
  // }

  contains(point) {
    return point.x >= this.startX && point.x <= this.endX &&
      point.y >= this.startY && point.y <= this.endY;
  }
}
