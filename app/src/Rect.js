export default class Rect {
  constructor(startX, startY, width, height) {
    this.startX = startX;
    this.startY = startY;
    this.width = width;
    this.height = height;
  }

  drawOn(context, color='black', weight=1) {
    context.strokeStyle = color;
    context.lineWidth = weight;
    context.rect(this.startX, this.startY, this.width, this.height);
  }

  contains(point) {
    return point.x >= this.startX && point.x <= this.startX + this.width &&
      point.y >= this.startY && point.y <= this.startY + this.height;
  }
}