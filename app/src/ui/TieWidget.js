//import Note from './Note'
import NoteWidget from './NoteWidget'
import * as Draw from '../util/Draw'

export default class TieWidget extends NoteWidget {
  drawNote() {
    super.drawNote()
    if (this.startTie()) {
      const hookArcBy = 10
      const levitateBy = 10
      const bottom = this.y() - levitateBy
      const top = bottom - Draw.lineHeight
      // this.context.lineWidth = Draw.defaultLineWeight * 3
      this.context.moveTo(this.x(), bottom)
      this.context.bezierCurveTo(
        this.x() - hookArcBy, top,
        this.startTie().x() + hookArcBy, top,
        this.startTie().x(), bottom);
      this.context.stroke()
      // this.context.lineWidth = Draw.defaultLineWeight
    }
  }
}
