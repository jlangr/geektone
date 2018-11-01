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
    console.log('should draw accidental in TieWidget; tie index:', this.note.tieIndex)
    console.log(`this.note.name(): ${this.note.name()}`)
    const result = super.shouldDrawAccidental() && 
      this.note.tieIndex === 0

    console.log('... result: ', result)
    return result
  }

  drawNote() {
    super.drawNote()
    if (this.startTie())
      this.drawArcBackTo(this.startTie())
  }
}
