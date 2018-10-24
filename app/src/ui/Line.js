export default class Line {
  constructor(start, end, strokeStyle='black', lineWidth=1) {
    this.start = start;
    this.end = end;
    this.lineWidth = lineWidth
    this.strokeStyle = strokeStyle
  }

  drawOn(context) {
    context.beginPath()
    context.lineWidth = this.lineWidth
    context.strokeStyle = this.strokeStyle
    context.moveTo(this.start.x, this.start.y)
    context.lineTo(this.end.x, this.end.y)
    context.stroke()
  }
}


export class NullLine extends Line {
  drawOn(context) {
  }
}