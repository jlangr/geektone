import Note from './Note'
import TieWidget from './ui/TieWidget'

export default class Tie extends Note {
  constructor(noteName, duration, isNote=true, accidental='', isSelected=false, tieIndex=0) {
    super(noteName, duration, isNote, accidental)
    this.isSelected = isSelected
    this.tieIndex = tieIndex
  }

  isRepresentedAsTie() { // only applies to the Note being manipulated
    return false
  }

  drawOn(context) {
    new TieWidget(context, this).draw()
  }
}