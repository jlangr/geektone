import NoteWidget from './NoteWidget'
import * as Draw from '../util/Draw'

export default class TieWidget extends NoteWidget {
  drawArcBackTo(startTie) {
    const hookArcBy = 10
    const levitateBy = 10
    const bottom = this.y() - levitateBy
    const top = bottom - Draw.lineHeight
    this.context.moveTo(this.x(), bottom)
    this.context.bezierCurveTo(
      this.x() - hookArcBy, top,
      startTie.x() + hookArcBy, top,
      startTie.x(), bottom);
    this.context.stroke()
  }

  shouldDrawAccidental() {
    return super.shouldDrawAccidental() && 
      this.note.tieIndex === 0
  }

  hasStartTie() {
    return this.ties().length > 0
  }

  drawNote() {
    super.drawNote()
    if (this.note.startTie)
      this.drawArcBackTo(this.note.startTie)
  }
}
