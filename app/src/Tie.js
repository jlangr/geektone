import Note from './Note'
import * as Draw from './util/Draw'

export default class Tie extends Note {

  drawNote(context) {
    super.drawNote(context)
    if (this.startTie) {
      const hookArcBy = 10
      const levitateBy = 10
      const bottom = this.y() - levitateBy
      const top = bottom - Draw.lineHeight
      // context.lineWidth = Draw.defaultLineWeight * 3
      context.moveTo(this.x(), bottom)
      context.bezierCurveTo(
        this.x() - hookArcBy, top,
        this.startTie.x() + hookArcBy, top,
        this.startTie.x(), bottom);
      context.stroke()
      // context.lineWidth = Draw.defaultLineWeight
    }
  }
}

// TODO fix stroke problems etc throughout

// TODO delete either tie deletes the other

// TODO delete note should delete forward