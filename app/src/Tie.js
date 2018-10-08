import Note from './Note'
import TieWidget from './ui/TieWidget'

export default class Tie extends Note {
  constructor(noteName, notes, sixteenthsCount) {
    super(noteName)
    this.sixteenthsCount = sixteenthsCount
    this.notes = notes
  }

  // only applies to the Note being manipulated
  isRepresentedAsTie() {
    return false
  }

  drawOn(context) {
    new TieWidget(context, this).draw()
  }

  sixteenths() {
    return this.sixteenthsCount
  }
}